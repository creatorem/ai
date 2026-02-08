import { openai, createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, type UIMessage, tool, stepCountIs } from "ai";
import { z } from 'zod'

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY ?? '',
  baseURL: 'https://api.groq.com/openai/v1',
});


// export async function POST(req: Request) {
//   const { messages, message, id } = await req.json();

//   const resolvedMessages: UIMessage[] = messages ?? [message];

//   const result = streamText({
//     // model: openai.responses("gpt-5-nano"),
//     model: groq('llama-3.3-70b-versatile'),
//     messages: await convertToModelMessages(resolvedMessages),
//     providerOptions: {
//       openai: {
//         reasoningEffort: "low",
//         reasoningSummary: "auto",
//       },
//     },
//     stopWhen: stepCountIs(5),
//     onStepFinish: ({ toolResults }) => {
//       console.log(toolResults);
//     },
//     tools: {
//       weather: tool({
//         description: 'Get the weather in a location (fahrenheit)',
//         inputSchema: z.object({
//           location: z.string().describe('The location to get the weather for'),
//         }),
//         execute: async ({ location }) => {
//           const temperature = Math.round(Math.random() * (90 - 32) + 32);
//           return {
//             location,
//             temperature,
//           };
//         },
//       }),
//       convertFahrenheitToCelsius: tool({
//         description: 'Convert a temperature in fahrenheit to celsius',
//         inputSchema: z.object({
//           temperature: z
//             .number()
//             .describe('The temperature in fahrenheit to convert'),
//         }),
//         execute: async ({ temperature }) => {
//           const celsius = Math.round((temperature - 32) * (5 / 9));
//           return {
//             celsius,
//           };
//         },
//       }),
//     },
//   });

//   return result.toUIMessageStreamResponse({
//     sendReasoning: true,
//   });
// }

function throttleStream(stream: ReadableStream, delay = 50) {
  const reader = stream.getReader();

  return new ReadableStream({
    async start(controller) {
      async function push() {
        const { done, value } = await reader.read();

        if (done) {
          controller.close();
          return;
        }

        // Artificial delay per chunk
        await new Promise((r) => setTimeout(r, delay));

        controller.enqueue(value);
        push();
      }

      push();
    },
  });
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    messages: await convertToModelMessages(messages),
    tools: {
      weather: tool({
        description: 'Get the weather in a location (fahrenheit)',
        inputSchema: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32);
          return {
            location,
            temperature,
          };
        },
      }),
    },
  });

  // const slowStream = throttleStream(
  //   result.toUIMessageStreamResponse().body!,
  //   20 // ms per chunk — tweak this
  // );

  // return new Response(slowStream, {
  //   headers: {
  //     "Content-Type": "text/plain; charset=utf-8",
  //   },
  // });

  return result.toUIMessageStreamResponse();
}