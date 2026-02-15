import { FC, useMemo } from "react";
import { View } from "react-native";
import { useToolUI } from "@creatorem/ai-chat";
import type { ToolCallMessagePartProps } from "@creatorem/ai-chat/types/message-part-component-types";
import { Text } from "../ui/text";
import { cn } from "~/lib/cn";
import { IconName } from "../ui/icon";

const HOUR_LABELS = ["1PM", "2PM", "3PM", "4PM", "5PM"] as const;

const toCelsius = (fahrenheit: number) =>
  Math.round(((fahrenheit ?? 0) - 32) * (5 / 9));

const getConditionEmoji = (condition?: string) => {
  const value = (condition ?? "").toLowerCase();
  if (value.includes("rain") || value.includes("storm")) return "🌧️";
  if (value.includes("snow") || value.includes("sleet")) return "❄️";
  if (value.includes("cloud") || value.includes("overcast")) return "☁️";
  if (value.includes("fog")) return "🌫️";
  if (value.includes("wind")) return "💨";
  return "☀️";
};

type ForecastDay = {
  date: string;
  temperatureF: number;
  condition: string;
  sunlightHours: number;
};

const WeatherToolCard: FC<ToolCallMessagePartProps> = ({
  args,
  result,
  status,
}) => {
  const forecast = (result as any)?.forecast as ForecastDay[] | undefined;
  const location = (result as any)?.location ?? (args as any)?.location ?? "—";
  const range = (result as any)?.range as
    | { startDate: string; endDate: string }
    | undefined;

  const temps = forecast?.map((day) => day.temperatureF) ?? [];
  const highF = temps.length ? Math.max(...temps) : undefined;
  const lowF = temps.length ? Math.min(...temps) : undefined;
  const currentF = forecast?.[0]?.temperatureF;
  const currentCondition = forecast?.[0]?.condition;

  const hourly = useMemo(
    () =>
      forecast
        ? forecast.slice(0, HOUR_LABELS.length).map((day, index) => ({
            label: HOUR_LABELS[index],
            tempC: toCelsius(day.temperatureF),
            condition: day.condition,
          }))
        : [],
    [forecast],
  );

  return (
    <View className="mb-4 w-full rounded-3xl border border-sky-200/50 bg-sky-500 p-4">
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-center gap-3">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <Text className="text-2xl">
              {getConditionEmoji(currentCondition)}
            </Text>
          </View>
          <View>
            <Text className="font-semibold text-3xl text-white">
              {currentF !== undefined ? `${toCelsius(currentF)}°C` : "--"}
            </Text>
            <Text className="text-sm text-white/85">{location}</Text>
          </View>
        </View>
        <View>
          <Text className="text-right text-sm text-white/85">
            H:{highF !== undefined ? `${toCelsius(highF)}°` : "--"}
          </Text>
          <Text className="text-right text-sm text-white/85">
            L:{lowF !== undefined ? `${toCelsius(lowF)}°` : "--"}
          </Text>
        </View>
      </View>

      {range && (
        <Text className="mt-1 text-white/75 text-xs">
          {range.startDate} - {range.endDate}
        </Text>
      )}

      {!forecast && (
        <Text className="mt-3 text-sm text-white/85">
          {status.type === "running"
            ? "Fetching forecast..."
            : "No forecast yet."}
        </Text>
      )}

      {forecast && (
        <View className="mt-4 flex-row justify-between gap-2">
          {hourly.map((slot) => (
            <View
              key={slot.label}
              className={cn(
                "min-w-[58px] flex-1 items-center rounded-2xl bg-white/15 px-2 py-3",
              )}
            >
              <Text className="text-white/80 text-xs">{slot.label}</Text>
              <Text className="my-1 text-xl">
                {getConditionEmoji(slot.condition)}
              </Text>
              <Text className="font-medium text-sm text-white">
                {slot.tempC}°C
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export const WeatherToolRegistration: FC = () => {
  useToolUI({
    toolName: "weather",
    display: {
      icon: 'CloudSun' as IconName,
      title: 'Weather',
      description: 'Get the weather forecast for a location',
    },
    render: WeatherToolCard,
  });
  return null;
};
