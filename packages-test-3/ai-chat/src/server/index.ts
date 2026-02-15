import z from "zod";
import { BODY_KEY } from "../utils/request-keys";
import type { streamText, Tool } from "ai";

export type ModelResolver = (model?: string) => string | null;

const defaultModelResolver: ModelResolver = (model) => model ?? null;

export const getModel =
  (body: Record<string, unknown>, resolveModel: ModelResolver = defaultModelResolver): string | null => {
    const model = z.string().nullable().optional().safeParse(body?.[BODY_KEY.SELECTED_MODEL]).data || undefined;
    return resolveModel(model);
  };

export const getDisabledToolsFiter = (body: Record<string, unknown>): ((tools: Parameters<typeof streamText>[0]['tools']) => Parameters<typeof streamText>[0]['tools']) => {
  const disabledTools = z.array(z.string()).nullable().optional().safeParse(body?.[BODY_KEY.DISABLED_TOOLS]).data || [];
  return (serverTools: Parameters<typeof streamText>[0]['tools']) => Object.fromEntries(
    Object.entries(serverTools as Record<string, Tool<any, any>>).filter(([toolName]) => !disabledTools.includes(toolName)),
  )
};

export { BODY_KEY } from "../utils/request-keys";
