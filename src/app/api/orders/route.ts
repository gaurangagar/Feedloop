import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { User } from "next-auth";
import OrderModel, { feedbackFormModel } from "@/models/feedbackForm";
import { v4 as uuidv4 } from 'uuid';
import { sendFeedbackEmail } from "@/helpers/feedbackEmail";

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
      const {productName,customername,customeremail,orderno,gstin,questions, date}=await request.json();
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
          productName,
          customeremail,
          date,
          feedback,
          orderno,
          gstin
      })
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