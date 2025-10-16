import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { User } from "next-auth";
import { quesGenerate } from "@/helpers/quesGenerate";

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
        const { productName, productDescription } = await request.json();
        const questionsString = await quesGenerate(productName, productDescription);
        const questions=questionsString.split('||')
        return Response.json({
            success:true,
            message:'',
            data: questions,
        },{status:200})
    } catch(error){
      console.error("Feedback API Error:", error);
      return Response.json(
        {
          success: false,
          message: "Something went wrong while generating questions.",
        },
        { status: 500 }
      );
    }
}