import z from "zod";
import { BODY_KEY } from "../utils/request-keys";
import type { streamText, Tool } from "ai";
import { jsonSchema } from "ai";
import type { JSONSchema7 } from "json-schema";

export type ModelResolver = (model?: string) => string | null;

const defaultModelResolver: ModelResolver = (model) => model ?? null;

export const getModel = (
  body: Record<string, unknown>,
  resolveModel: ModelResolver = defaultModelResolver,
): string | null => {
  const model =
    z.string().nullable().optional().safeParse(body?.[BODY_KEY.SELECTED_MODEL])
      .data || undefined;
  return resolveModel(model);
};

export const getDisabledToolsFiter = (
  body: Record<string, unknown>,
): ((
  tools: Parameters<typeof streamText>[0]["tools"],
) => Parameters<typeof streamText>[0]["tools"]) => {
  const disabledTools =
    z
      .array(z.string())
      .nullable()
      .optional()
      .safeParse(body?.[BODY_KEY.DISABLED_TOOLS]).data || [];
  return (serverTools: Parameters<typeof streamText>[0]["tools"]) =>
    Object.fromEntries(
      Object.entries(serverTools as Record<string, Tool<any, any>>).filter(
        ([toolName]) => !disabledTools.includes(toolName),
      ),
    );
};

export const frontendTools = (
  body: Record<string, unknown>,
): Record<string, Tool<any, any>> => {
  const tools =
    z
      .record(z.string(), z.any())
      .nullable()
      .optional()
      .safeParse(body?.[BODY_KEY.TOOLS]).data || {};
  return Object.fromEntries(
    Object.entries(tools).map(([name, tool]) => [
      name,
      {
        ...(tool.description ? { description: tool.description } : undefined),
        inputSchema: jsonSchema(tool.parameters as JSONSchema7),
      },
    ]),
  );
};

export const getServerUtils = (body: Record<string, unknown>) => {
  return {
    getModel: (resolveModel: ModelResolver = defaultModelResolver) =>
      getModel(body, resolveModel),
    toolsFilter: getDisabledToolsFiter(body),
    frontendTools: frontendTools(body),
  };
};

export { BODY_KEY } from "../utils/request-keys";
