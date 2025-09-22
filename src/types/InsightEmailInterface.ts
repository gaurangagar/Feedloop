import { FeedbackSummaryEmailInterface } from "./FeedbackSummaryEmailInterface";

export interface InsightEmailInterface {
    orderId:string,
    companyName:string,
    productRating:number,
    shopRating:number,
    organizationEmail:string,
    feedbackInsight: FeedbackSummaryEmailInterface
}