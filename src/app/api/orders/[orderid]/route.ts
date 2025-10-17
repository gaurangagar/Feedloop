import dbConnect from "@/lib/dbConnect";
import OrderModel, { feedbackFormModel } from "@/models/feedbackForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { User } from "next-auth";
import organizationModel from "@/models/organization";

export async function GET( req: Request,{ params }: { params: { orderid: string } }) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 });
    }
    try {
        const { orderid } = await params;
        const order=await OrderModel.findOne({orderId:orderid})
        if(!order) {
            return Response.json(
                {
                success: false,
                message: "Order does not exists",
                },
                { status: 500 }
            );
        }
        const org = await organizationModel.findOne({ email: user.email });
        if(!org) {
            return Response.json(
                {
                success: false,
                message: "Organization does not exists",
                },
                { status: 500 }
            );
        }
        if(String(order.organizationid) !== String(org._id)) {
            return Response.json(
                {
                success: false,
                message: "You are not authenticated to fetch this order.",
                },
                { status: 500 }
            );
        }
        const feedbackForm=await feedbackFormModel.findById(order.feedbackForm)
        return Response.json({
            success:true,
            message:'Orders successfully fetched',
            order,
            feedbackForm
        },{status:200})
    } catch (error) {
        console.error("Feedback API Error:", error);
        return Response.json(
            {
            success: false,
            message: "Something went wrong while fetching the order",
            },
            { status: 500 }
        );
    }
}