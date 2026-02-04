import { openai, createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, type UIMessage } from "ai";

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY ?? '',
  baseURL: 'https://api.groq.com/openai/v1',
});


export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    // model: openai.responses("gpt-5-nano"),
    model: groq('llama-3.3-70b-versatile'),
    messages: await convertToModelMessages(messages),
    providerOptions: {
      openai: {
        reasoningEffort: "low",
        reasoningSummary: "auto",
      },
    },
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
  });
}
