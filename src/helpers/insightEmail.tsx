import { resend } from "@/lib/resend";
import { InsightEmailInterface } from "@/types/InsightEmailInterface";
import insightEmail from "../../emails/insightEmail";

export async function sendinsightEmail({orderId,companyName,productRating, shopRating,organizationEmail, feedbackInsight}:InsightEmailInterface) {
    try {
        await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [organizationEmail],
        subject: `Customer Feedback Summary – Order ${orderId} for ${companyName}`,
        react: insightEmail({
            orderId,
            companyName,
            productRating,
            shopRating,
            overallSentiment: feedbackInsight.overallSentiment,
            summary: feedbackInsight.summary,
            highlights: feedbackInsight.highlights,
            improvements: feedbackInsight.improvements,
            urgentIssues: feedbackInsight.urgentIssues,
            rawFeedback: feedbackInsight.rawFeedback
        }),
    });
    } catch (error) {
        console.error("Error sending insight email:", error);
        throw error;
    }
}