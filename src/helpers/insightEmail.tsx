import { resend } from "@/lib/resend";
import { InsightEmailInterface } from "@/types/InsightEmailInterface";
import insightEmail from "../../emails/insightEmail";

export async function sendinsightEmail({organizationEmail, feedbackInsight}:InsightEmailInterface) {
    try {
        await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [organizationEmail],
        subject: '',
        react: insightEmail({feedbackInsight}),
    });
    } catch (error) {
        console.error("Error sending insight email:", error);
        throw error;
    }
}