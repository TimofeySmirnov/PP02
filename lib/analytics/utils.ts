import { AdherenceMetrics, AnalyticsDay } from "@/lib/analytics/types";

export type AnalyticsPeriod = "7d" | "30d" | "all";

export function formatAnalyticsDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function parseAnalyticsDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function eachDayBetween(start: Date, end: Date) {
  const dates: string[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const final = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  while (cursor <= final) {
    dates.push(formatAnalyticsDate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

export function filterAnalyticsByPeriod(days: AnalyticsDay[], period: AnalyticsPeriod) {
  if (period === "all" || days.length === 0) {
    return days;
  }

  const end = parseAnalyticsDate(days[days.length - 1].date);
  const start = new Date(end);
  start.setDate(end.getDate() - (period === "7d" ? 6 : 29));

  return days.filter((day) => parseAnalyticsDate(day.date) >= start);
}

export function calculateAdherenceMetrics(days: AnalyticsDay[]): AdherenceMetrics {
  const trackedDays = days.filter((day) => day.targetCalories != null && day.consumedCalories > 0);

  if (trackedDays.length === 0) {
    return {
      adherencePercent: 0,
      currentStreak: 0,
      averageCalorieDeviation: 0,
      trackedDays: 0,
    };
  }

  const withinTargetDays = trackedDays.filter((day) => {
    const target = day.targetCalories ?? 0;
    const deviation = Math.abs(day.consumedCalories - target);
    return deviation <= target * 0.1;
  });

  let currentStreak = 0;

  for (let index = trackedDays.length - 1; index >= 0; index -= 1) {
    const day = trackedDays[index];
    const target = day.targetCalories ?? 0;
    const deviation = Math.abs(day.consumedCalories - target);

    if (deviation <= target * 0.1) {
      currentStreak += 1;
    } else {
      break;
    }
  }

  const totalDeviation = trackedDays.reduce((sum, day) => sum + (day.consumedCalories - (day.targetCalories ?? 0)), 0);

  return {
    adherencePercent: Math.round((withinTargetDays.length / trackedDays.length) * 100),
    currentStreak,
    averageCalorieDeviation: Math.round(totalDeviation / trackedDays.length),
    trackedDays: trackedDays.length,
  };
}
