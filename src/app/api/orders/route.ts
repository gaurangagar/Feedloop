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
      const {orderId,productName,customername,customeremail,orderno,gstin,questions, date,organizationid}=await request.json();
      const organization=await organizationModel.findById(organizationid)
      if (!organization) {
        return Response.json(
          {
            success: false,
            message: "Organization not found",
          },{ status: 404 });
      }
      if(organization.email!=user.email) {
        return Response.json(
          {
            success: false,
            message: "You are not authorized to make order from this organization.",
          },
          { status: 403 }
        )
      }
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
      const order=await OrderModel.create({
          orderId,
          productName,
          customeremail,
          date,
          feedback,
          orderno,
          gstin,
          organizationid
      })
      const cust=await CustomerModel.create({name:customername,email:customeremail})
      await sendFeedbackEmail({productname:productName, customername, orderno, organizationName: user.name ?? "", gstin, date, feedbackForm:feedback.formid, customerEmail:customeremail})
    } catch(error){
      console.error("Feedback API Error:", error);
      return Response.json(
        {
          success: false,
          message: "Something went wrong while creating feedback form",
        },
        { status: 500 }
      );
    }
}