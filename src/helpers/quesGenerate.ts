import { ai } from "@/lib/genai";

export async function quesGenerate(productName: string, productDescription: string): Promise<string> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are a shopkeeper seeking customer insights. Generate a few relevant questions about the product. The product name is: "${productName}". The product description is: "${productDescription}" (optional). Focus on features, uses, comparisons, or potential improvements. Do not ask about product ratings. Provide the questions in a single string, separated by ||. Keep it concise.`
    });
    // Extract the string from the response
    let content = response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    if (!content) {
        throw new Error("No content returned from model");
    }
    content = content
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/```$/, "")
            .trim();
    
    return content;
}
        