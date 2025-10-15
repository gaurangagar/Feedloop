import { ai } from "@/lib/genai";
import { FeedbackSummaryEmailInterface } from "@/types/FeedbackSummaryEmailInterface";
import { FeedbackItem } from "@/types/FeedbackSummaryEmailInterface";

export async function feedbackSummarize(orderId: string, feedbackArray: FeedbackItem[], productRating:number, shopRating:number):Promise<FeedbackSummaryEmailInterface> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
            You are an assistant that reviews customer feedback for companies.

            I will give you:
            - An orderId
            - An array of questions and answers from the customer’s feedback form

            Your task:
            Analyze the feedback and return a JSON object with the following fields:

            {
            "orderId": string,
            "productRating":number,
            "ShopRating":number,
            "overallSentiment": "Positive | Neutral | Negative",
            "summary": string,  // A concise summary of the customer’s experience
            "highlights": string[],  // Key highlights of what the customer appreciated
            "improvements": string[],  // Specific areas the customer suggested for improvement
            "urgentIssues": string[]  // Any urgent issues that require immediate attention
            }

            Important:
            - Output only valid JSON.
            - Do not include any extra commentary or text outside the JSON.

            Order ID: ${orderId}

            Customer Feedback:
            ${feedbackArray.map(item => `Q: ${item.question}\nA: ${item.answer}`).join("\n\n")}
            - product rating-${productRating} and shop rating-${shopRating}

            Make the tone professional and business-friendly, suitable for emailing directly to the company.
            `
    });

    // Extract the JSON string from the response and parse it
    let content = response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    if (!content) {
        throw new Error("No content returned from model");
    }
    content = content
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/, "")
        .trim();
    const summary: FeedbackSummaryEmailInterface = JSON.parse(content);
    
    return summary;
}