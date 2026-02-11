"use client";

import { FC } from "react";
import { useAssistantToolUI } from "@creatorem/ai-react";
import type { ToolCallMessagePartProps } from "@creatorem/ai-chat/types/message-part-component-types";

const HOUR_LABELS = ["1PM", "2PM", "3PM", "4PM", "5PM"] as const;

const toCelsius = (fahrenheit: number) =>
  Math.round(((fahrenheit ?? 0) - 32) * (5 / 9));

const getConditionKey = (condition?: string) => {
  const value = (condition ?? "").toLowerCase();
  if (value.includes("rain") || value.includes("storm")) return "rain";
  if (value.includes("snow") || value.includes("sleet")) return "snow";
  if (value.includes("cloud") || value.includes("overcast")) return "cloud";
  return "sun";
};

const WeatherIcon: FC<{ condition?: string; size?: number }> = ({
  condition,
  size = 28,
}) => {
  const key = getConditionKey(condition);
  if (key === "cloud") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        aria-hidden
        className="text-white/90"
      >
        <path
          d="M20 46h26a12 12 0 0 0 0-24 16 16 0 0 0-31-3A11 11 0 0 0 20 46Z"
          fill="currentColor"
        />
      </svg>
    );
  }
  if (key === "rain") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        aria-hidden
        className="text-white/90"
      >
        <path
          d="M20 38h26a10 10 0 0 0 0-20 14 14 0 0 0-27-3A9 9 0 0 0 20 38Z"
          fill="currentColor"
        />
        <path
          d="M22 44l-4 8M32 44l-4 8M42 44l-4 8"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (key === "snow") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        aria-hidden
        className="text-white/90"
      >
        <path
          d="M20 38h26a10 10 0 0 0 0-20 14 14 0 0 0-27-3A9 9 0 0 0 20 38Z"
          fill="currentColor"
        />
        <circle cx="24" cy="48" r="3" fill="currentColor" />
        <circle cx="34" cy="50" r="3" fill="currentColor" />
        <circle cx="44" cy="48" r="3" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden
      className="text-yellow-200"
    >
      <circle cx="32" cy="32" r="14" fill="currentColor" />
    </svg>
  );
};

const WeatherToolCard: FC<ToolCallMessagePartProps> = ({
  args,
  result,
  status,
}) => {
  const forecast = (result as any)?.forecast as
    | Array<{
        date: string;
        temperatureF: number;
        condition: string;
        sunlightHours: number;
      }>
    | undefined;
  const location = (result as any)?.location ?? (args as any)?.location ?? "—";
  const range = (result as any)?.range as
    | { startDate: string; endDate: string }
    | undefined;
  const temps = forecast?.map((day) => day.temperatureF) ?? [];
  const highF = temps.length ? Math.max(...temps) : undefined;
  const lowF = temps.length ? Math.min(...temps) : undefined;
  const currentF = forecast?.[0]?.temperatureF;
  const currentCondition = forecast?.[0]?.condition;
  const hourly = forecast
    ? forecast.slice(0, HOUR_LABELS.length).map((day, index) => ({
        label: HOUR_LABELS[index],
        tempC: toCelsius(day.temperatureF),
        condition: day.condition,
      }))
    : [];

  return (
    <div className="aui-tool-weather w-full max-w-lg overflow-hidden rounded-[28px] border border-white/20 bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 p-4 text-white shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-white/20">
            <WeatherIcon condition={currentCondition} size={30} />
          </div>
          <div>
            <div className="text-4xl font-semibold tracking-tight">
              {currentF !== undefined ? `${toCelsius(currentF)}°C` : "--"}
            </div>
            <div className="text-sm text-white/80">{location}</div>
          </div>
        </div>
        <div className="text-right text-sm text-white/80">
          <div>
            H:{highF !== undefined ? `${toCelsius(highF)}°` : "--"}
          </div>
          <div>
            L:{lowF !== undefined ? `${toCelsius(lowF)}°` : "--"}
          </div>
        </div>
      </div>

      {range && (
        <div className="mt-1 text-xs text-white/70">
          {range.startDate} - {range.endDate}
        </div>
      )}

      {!forecast && (
        <div className="mt-3 text-sm text-white/80">
          {status.type === "running" ? "Fetching forecast..." : "No forecast yet."}
        </div>
      )}

      {forecast && (
        <div className="mt-4 grid grid-cols-5 gap-2">
          {hourly.map((slot) => (
            <div
              key={slot.label}
              className="flex flex-col items-center gap-2 rounded-2xl bg-white/15 px-2 py-3"
            >
              <div className="text-xs text-white/80">{slot.label}</div>
              <WeatherIcon condition={slot.condition} size={26} />
              <div className="text-sm font-medium">{slot.tempC}°C</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const WeatherToolRegistration: FC = () => {
  useAssistantToolUI({
    toolName: "weather",
    render: WeatherToolCard,
  });
  return null;
};
