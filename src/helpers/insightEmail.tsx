import { resend } from "@/lib/resend";
import { InsightEmailInterface } from "@/types/InsightEmailInterface";
import insightEmail from "../../emails/insightEmail";

export async function sendinsightEmail({orderId,companyName,organizationEmail, feedbackInsight}:InsightEmailInterface) {
    try {
        await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [organizationEmail],
        subject: '',
        react: insightEmail({
            orderId,
            companyName,
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