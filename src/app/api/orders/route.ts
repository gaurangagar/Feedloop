import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { User } from "next-auth";
import OrderModel, { feedbackFormModel } from "@/models/feedbackForm";
import { v4 as uuidv4 } from 'uuid';
import { sendFeedbackEmail } from "@/helpers/feedbackEmail";
import CustomerModel from "@/models/customer";
import organizationModel from "@/models/organization";

export async function POST(request:Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 });
    }
    try{
      const {orderId,productName,customerName,customerEmail,orderNo,gstin,questions, date,}=await request.json();
      if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return Response.json(
          {
            success: false,
            message: "Questions must be provided in the request body",
          },
          { status: 400 }
        );
      }
      const answers = questions.map((q: string) => ({ question: q, answer: "" }));
      const feedback=await feedbackFormModel.create({
          formid: uuidv4(),
          answers,
      })
      const org = await organizationModel.findOne({ email: user.email });
      if (!org) {
        return Response.json(
          {
            success: false,
            message: "Organization not found for the current user.",
          },
          { status: 404 }
        );
      }
      const parsedDate = new Date(date);
      const order = await OrderModel.create({
          orderId,
          productName,
          customeremail:customerEmail,
          date:parsedDate,
          feedbackForm:feedback,
          orderNo,
          gstin,
          organizationid: org._id
      })
      let cust = await CustomerModel.findOne({email: customerEmail });
      if (!cust) {
        cust = await CustomerModel.create({ name: customerName, email: customerEmail });
      }
      await sendFeedbackEmail({productname:productName, customername: customerName, orderno: orderNo, organizationName: user.name ?? "", gstin, date:parsedDate, feedbackForm:feedback.formid, customerEmail})
      return Response.json({
        success:true,
        message:'Orders successfully created and feedback mail send to customer',
        formid:feedback.formid,
        order
      },{status:200})
    } catch(error){
      console.log("Feedback API Error:", error);
      return Response.json(
        {
          success: false,
          message: "Something went wrong while creating feedback form",
        },
        { status: 500 }
      );
    }
}

export async function GET() {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 });
    }
    try{
      const org = await organizationModel.findOne({ email: user.email });
      if (!org) {
        return Response.json(
          {
            success: false,
            message: "Organization not found for the current user.",
          },
          { status: 404 }
        );
      }
      const allorders=await OrderModel.find({organizationid:org._id})
      return Response.json({
        success:true,
        message:'Orders successfully fetched',
        allorders
      },{status:200})
    } catch(error){
      console.error("Feedback API Error:", error);
      return Response.json(
        {
          success: false,
          message: "Something went wrong while fetching orders",
        },
        { status: 500 }
      );
    }
}