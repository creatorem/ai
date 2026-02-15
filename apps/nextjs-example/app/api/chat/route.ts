import { createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, type UIMessage, smoothStream } from "ai";
import { weatherTool } from "../../../lib/tools/weather-tool";
import { getModel, getDisabledToolsFiter } from "@creatorem/ai-chat/server";

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY ?? '',
  baseURL: 'https://api.groq.com/openai/v1',
});

export async function POST(req: Request) {
  const { messages, ...body }: { messages: UIMessage[] } = await req.json();

  const model = groq(getModel(body) ?? 'llama-3.3-70b-versatile')
  const toolsFilter = getDisabledToolsFiter(body);

  const result = streamText({
    // model: groq('llama-3.3-70b-versatile'),
    // model: groq('meta-llama/llama-4-scout-17b-16e-instruct'),
    // model: groq('meta-llama/llama-4-scout-17b-16e-instruct'),
    model,
    messages: await convertToModelMessages(messages),
    tools: toolsFilter({
      weather: weatherTool,
    }),
    experimental_transform: smoothStream({
      delayInMs: 30, // optional: defaults to 10ms
      chunking: 'line', // optional: defaults to 'word'
    }),
  });

  return result.toUIMessageStreamResponse();
}
