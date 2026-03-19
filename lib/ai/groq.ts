import Groq from "groq-sdk";

let groqClient: Groq | null = null;

export function getGroqClient(): Groq {
  if (!groqClient) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not set");
    }
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
}

export async function callGroq(prompt: string): Promise<string> {
  const client = getGroqClient();

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1,
    max_tokens: 2048,
    response_format: { type: "json_object" },
  });

  return completion.choices[0]?.message?.content ?? "{}";
}
