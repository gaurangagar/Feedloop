import FeedbackEmail from "../../emails/feedbackEmail";
import { resend } from "@/lib/resend";
import { FeedbackEmailInterface } from "@/types/FeedbackEmailInterface";

export async function sendFeedbackEmail({productname, customername, orderno, organizationName, gstin, date, feedbackForm,customerEmail} : FeedbackEmailInterface) {
    try {
        await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [customerEmail],
        subject: 'Tell us about your experience with {productname}',
        react: FeedbackEmail({productname, customername, orderno, organizationName, gstin, date, feedbackForm,customerEmail}),
    });
    } catch (error) {
        console.error("Error sending feedback email:", error);
        throw error;
    }
}