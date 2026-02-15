import type { JSONSchema7 } from "json-schema";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { UITool } from "../types/tools-types";

/**
 * Type for a tool definition with JSON Schema parameters.
 */
export type ToolJSONSchema = {
  description?: string;
  parameters: JSONSchema7;
};

function isStandardSchema(schema: unknown): schema is StandardSchemaV1 & {
  "~standard": StandardSchemaV1["~standard"] & { toJSONSchema?: () => unknown };
} {
  return (
    typeof schema === "object" &&
    schema !== null &&
    "~standard" in schema &&
    typeof (schema as StandardSchemaV1)["~standard"] === "object"
  );
}

function hasToJSONSchemaMethod(
  schema: unknown,
): schema is { toJSONSchema: () => unknown } {
  return (
    typeof schema === "object" &&
    schema !== null &&
    "toJSONSchema" in schema &&
    typeof (schema as { toJSONSchema: unknown }).toJSONSchema === "function"
  );
}

function hasToJSONMethod(schema: unknown): schema is { toJSON: () => unknown } {
  return (
    typeof schema === "object" &&
    schema !== null &&
    "toJSON" in schema &&
    typeof (schema as { toJSON: unknown }).toJSON === "function"
  );
}

/**
 * Converts a schema to JSONSchema7.
 * Supports:
 * - StandardSchemaV1 with ~standard.toJSONSchema (e.g., Zod v4)
 * - Objects with toJSONSchema() method
 * - Objects with toJSON() method
 * - Plain JSONSchema7 objects
 */
export function toJSONSchema(
  schema: StandardSchemaV1 | JSONSchema7,
): JSONSchema7 {
  // StandardSchemaV1 with ~standard.toJSONSchema (e.g., Zod v4)
  if (isStandardSchema(schema)) {
    const toJSONSchemaMethod = schema["~standard"].toJSONSchema;
    if (typeof toJSONSchemaMethod === "function") {
      return toJSONSchemaMethod() as JSONSchema7;
    }
  }

  // toJSONSchema method on the schema itself
  if (hasToJSONSchemaMethod(schema)) {
    return schema.toJSONSchema() as JSONSchema7;
  }

  // toJSON method on the schema
  if (hasToJSONMethod(schema)) {
    return schema.toJSON() as JSONSchema7;
  }

  // Already a plain JSONSchema7
  return schema as JSONSchema7;
}

/**
 * Converts a record of tools to a record of tool definitions with JSON Schema parameters.
 * By default, filters out disabled tools and backend tools.
 */
export function toToolsJSONSchema(
  tools: Record<string, UITool<any, any>> | undefined,
): Record<string, ToolJSONSchema> {
  if (!tools) return {};

  return Object.fromEntries(
    Object.entries(tools)
      .map(([name, tool]) =>
        tool.type === "frontend" && tool.parameters
          ? [
              name,
              {
                ...(tool.description && { description: tool.description }),
                parameters: toJSONSchema(tool.parameters!),
              },
            ]
          : null,
      )
      .filter((r) => r !== null),
  );
}
