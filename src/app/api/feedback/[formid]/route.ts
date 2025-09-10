import { feedbackSummarize } from "@/helpers/feedbackSummarize";
import { sendinsightEmail } from "@/helpers/insightEmail";
import dbConnect from "@/lib/dbConnect";
import { feedbackFormModel } from "@/models/feedbackForm";

export async function POST(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const { answers,productRating,shopRating,organizationEmail } = await request.json();
        if (!answers || !Array.isArray(answers)) {
        return Response.json(
            { success: false, message: "Answers must be an array" },
            { status: 400 }
        )};
        const id=params.id
        const form=await feedbackFormModel.findOne({formid:id})
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
        const response = await feedbackSummarize({ answers: form.answers });
        await sendinsightEmail({organizationEmail,feedbackInsight:response.text})
        return Response.json(
            {
                success: true,
                message: "Feedback submitted successfully",
                formId: form.formid,
            },
            { status: 200 }
        );
    } catch(error) {
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