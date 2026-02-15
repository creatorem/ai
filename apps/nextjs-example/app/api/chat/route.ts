import { createOpenAI } from "@ai-sdk/openai";
import {
  streamText,
  convertToModelMessages,
  type UIMessage,
  smoothStream,
} from "ai";
import { weatherTool } from "../../../lib/tools/weather-tool";
import { getServerUtils } from "@creatorem/ai-chat/server";
import { DEFAULT_AI_MODEL } from "@/lib/ai-constants";

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY ?? "",
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  const { messages, ...body }: { messages: UIMessage[] } = await req.json();
  const { getModel, toolsFilter, frontendTools } = getServerUtils(body);

  const model = groq(getModel() ?? DEFAULT_AI_MODEL);

  const result = streamText({
    model,
    messages: await convertToModelMessages(messages),
    tools: toolsFilter({
      ...frontendTools,
      weather: weatherTool,
    }),
    experimental_transform: smoothStream({
      delayInMs: 30, // optional: defaults to 10ms
      chunking: "line", // optional: defaults to 'word'
    }),
  });

  return result.toUIMessageStreamResponse();
}
