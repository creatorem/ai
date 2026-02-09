import { tool } from "ai";
import { z } from "zod";

const CONDITIONS = [
  "sunny",
  "partly-cloudy",
  "cloudy",
  "foggy",
  "rainy",
  "stormy",
  "windy",
  "snowy",
] as const;

type Condition = (typeof CONDITIONS)[number];

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const toDateKey = (date: Date) => date.toISOString().slice(0, 10);

const parseDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${value}. Use YYYY-MM-DD.`);
  }
  return date;
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

const hashString = (input: string) => {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const seededRandom = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0xffffffff;
  };
};

const pickCondition = (rand: () => number, temperatureF: number): Condition => {
  const roll = rand();
  if (temperatureF <= 32) return roll > 0.8 ? "snowy" : "cloudy";
  if (temperatureF <= 45) return roll > 0.7 ? "rainy" : "cloudy";
  if (temperatureF <= 60) {
    if (roll > 0.85) return "foggy";
    if (roll > 0.6) return "rainy";
    return "cloudy";
  }
  if (temperatureF <= 75) {
    if (roll > 0.8) return "rainy";
    if (roll > 0.55) return "partly-cloudy";
    return "sunny";
  }
  if (roll > 0.9) return "stormy";
  if (roll > 0.7) return "windy";
  if (roll > 0.5) return "partly-cloudy";
  return "sunny";
};

const getBaseTempForLocation = (location: string) => {
  const seed = hashString(location.toLowerCase());
  const rand = seededRandom(seed);
  return 45 + Math.round(rand() * 40);
};

const buildForecast = (location: string, date: Date) => {
  const dateKey = toDateKey(date);
  const seed = hashString(`${location.toLowerCase()}::${dateKey}`);
  const rand = seededRandom(seed);

  const base = getBaseTempForLocation(location);
  const dailySwing = Math.round((rand() - 0.5) * 16);
  const temperatureF = clamp(base + dailySwing, -5, 110);

  const condition = pickCondition(rand, temperatureF);
  const sunlightHoursRaw = 6 + rand() * 10;
  const sunlightHours = clamp(
    condition === "stormy" || condition === "rainy"
      ? sunlightHoursRaw - 2
      : condition === "foggy"
        ? sunlightHoursRaw - 1
        : sunlightHoursRaw,
    2,
    14,
  );

  return {
    date: dateKey,
    temperatureF,
    condition,
    sunlightHours: Math.round(sunlightHours * 10) / 10,
  };
};

export const weatherTool = tool({
  description:
    "Get mock weather for a location over a date or date range (fahrenheit).",
  inputSchema: z.object({
    location: z.string().describe("The location to get the weather for"),
    startDate: z
      .string()
      .optional()
      .describe("Start date in YYYY-MM-DD (defaults to today)"),
    endDate: z
      .string()
      .optional()
      .describe("End date in YYYY-MM-DD (inclusive)"),
    days: z
      .number()
      .int()
      .min(1)
      .max(30)
      .optional()
      .describe("Number of days to include (defaults to 1)"),
  }),
  execute: async ({ location, startDate, endDate, days }) => {
    const today = new Date();
    const start = startDate ? parseDate(startDate) : today;

    let count = 1;
    if (endDate) {
      const end = parseDate(endDate);
      const diffMs = end.getTime() - start.getTime();
      count = Math.floor(diffMs / (24 * 60 * 60 * 1000)) + 1;
      if (count < 1) {
        throw new Error("endDate must be the same as or after startDate.");
      }
    } else if (days) {
      count = days;
    }

    const forecast = Array.from({ length: count }, (_, idx) =>
      buildForecast(location, addDays(start, idx)),
    );

    return {
      location,
      unit: "fahrenheit",
      range: {
        startDate: toDateKey(start),
        endDate: toDateKey(addDays(start, count - 1)),
      },
      forecast,
    };
  },
});
