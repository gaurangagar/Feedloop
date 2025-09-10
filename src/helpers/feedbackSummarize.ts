import { ai } from "@/lib/genai";

type FeedbackItem = { question: string; answer: string };

export async function feedbackSummarize(orderId: string, feedbackArray: FeedbackItem[]) {
    const response=await ai.models.generateContent({
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

            Make the tone professional and business-friendly, suitable for emailing directly to the company.
            `
    });
    return response;
}