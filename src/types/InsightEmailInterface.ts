import { FeedbackSummaryEmailInterface } from "./FeedbackSummaryEmailInterface";

export interface InsightEmailInterface {
    orderId:string,
    companyName:string
    organizationEmail:string,
    feedbackInsight: FeedbackSummaryEmailInterface
}