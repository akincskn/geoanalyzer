import { GoogleGenerativeAI } from "@google/generative-ai";

let geminiClient: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!geminiClient) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set");
    }
    geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return geminiClient;
}

export async function callGemini(prompt: string): Promise<string> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Strip markdown code blocks if present
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  return jsonMatch ? jsonMatch[1].trim() : text.trim();
}
