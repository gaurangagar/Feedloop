import { feedbackSummarize } from "@/helpers/feedbackSummarize";
import { sendinsightEmail } from "@/helpers/insightEmail";
import dbConnect from "@/lib/dbConnect";
import OrderModel, { feedbackFormModel } from "@/models/feedbackForm";
import organizationModel from "@/models/organization";
import { NextRequest } from "next/server";

export async function GET(request:NextRequest, {params}:{ params: Promise<{ formid: string }> }) {
    await dbConnect();
    try {
        const { formid } = await params;
        const form=await feedbackFormModel.findOne({formid});
        if(!form) {
            return Response.json(
                {
                success: false,
                message: "Form does not exists",
                },
                { status: 500 }
            );
        }
        if(form.isFilled) {
            return Response.json(
                {
                success: false,
                message: "Form is already filled. Contact owner of this form for more details.",
                },
                { status: 400 }
            );
        }
        return Response.json(
            {
                success: true,
                message: "Feedback form fetched successfully.",
                form
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Feedback API Error:", error);
        return Response.json(
            {
            success: false,
            message: "Something went wrong while fetching feedback form",
            },
            { status: 500 }
        );
    }
}

export async function POST(request: Request, { params }: { params: Promise<{ formid: string }> }) {
    await dbConnect();
    try {
        const { formid } = await params;
        const { answers,productRating,shopRating } = await request.json();
        
        if (!answers || !Array.isArray(answers)) {
            return Response.json(
                { success: false, message: "Answers must be an array" },
                { status: 400 }
            )
        };
        const form=await feedbackFormModel.findOne({formid})
        if(!form) {
            return Response.json(
                {
                success: false,
                message: "Form does not exists",
                },
                { status: 500 }
            );
        }
        if(form.isFilled) {
            return Response.json(
                {
                success: false,
                message: "Form is already filled. Contact owner of this form for more details.",
                },
                { status: 400 }
            );
        }
        if(form.answers.length !== answers.length) {
            return Response.json(
                {
                success: false,
                message: "All answers have not been answered",
                },
                { status: 400 }
            );
        }
        form.answers = form.answers.map((q, i) => ({
            question: q.question,
            answer: answers[i] ?? "",
        }));
        form.productRating=productRating;
        form.shopRating=shopRating;
        form.isFilled=true
        await form.save();
        const order=await OrderModel.findOne({feedbackForm:form._id})
        if(!order) {
            return Response.json(
                {
                success: false,
                message: "Order does not exists",
                },
                { status: 500 }
            );
        }
        const org = await organizationModel.findById(order.organizationid);
        if (!org) {
            return Response.json(
                {
                    success: false,
                    message: "Organization not found",
                },{ status: 404 }
            );
        }
        const response = await feedbackSummarize(order.orderId, form.answers,productRating,shopRating );
        await sendinsightEmail({ orderId:order.orderId, companyName: org.name, productRating, shopRating,organizationEmail: org.email, feedbackInsight: response });
        await org.addRating(shopRating);
        return Response.json(
            {
                success: true,
                message: "Feedback submitted successfully",
            },
            { status: 200 }
        );
    } catch(error) {
        console.error("Feedback API Error:", error);
        return Response.json(
            {
            success: false,
            message: "Something went wrong while submitting feedback form",
            },
            { status: 500 }
        );
    }
}