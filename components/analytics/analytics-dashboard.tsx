"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { EmptyStateCard } from "@/components/analytics/empty-state-card";
import { SummaryCard } from "@/components/analytics/summary-card";
import { Card } from "@/components/ui/card";
import { AdherenceMetrics, AnalyticsDay } from "@/lib/analytics/types";
import { AnalyticsPeriod, filterAnalyticsByPeriod } from "@/lib/analytics/utils";

type AnalyticsDashboardProps = {
  days: AnalyticsDay[];
  adherence: Record<AnalyticsPeriod, AdherenceMetrics>;
  hasBodyData: boolean;
  hasMealData: boolean;
  latestMeasurements: {
    waistCm: number | null;
    hipsCm: number | null;
    chestCm: number | null;
  };
};

const PERIOD_OPTIONS: { value: AnalyticsPeriod; label: string }[] = [
  { value: "7d", label: "7 дней" },
  { value: "30d", label: "30 дней" },
  { value: "all", label: "Все время" },
];

function formatDeviation(value: number) {
  return `${value > 0 ? "+" : ""}${value} ккал`;
}

export function AnalyticsDashboard({
  days,
  adherence,
  hasBodyData,
  hasMealData,
  latestMeasurements,
}: AnalyticsDashboardProps) {
  const [period, setPeriod] = useState<AnalyticsPeriod>("7d");

  const filteredDays = useMemo(() => filterAnalyticsByPeriod(days, period), [days, period]);
  const metrics = adherence[period];

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          hint={`Дней с логами: ${metrics.trackedDays}`}
          label="Попадание в цель"
          value={`${metrics.adherencePercent}%`}
        />
        <SummaryCard hint="Подряд дней в диапазоне ±10%" label="Текущая серия" value={`${metrics.currentStreak}`} />
        <SummaryCard
          hint="Средняя разница между фактом и целью"
          label="Среднее отклонение"
          value={formatDeviation(metrics.averageCalorieDeviation)}
        />
        <SummaryCard
          hint={`Талия: ${latestMeasurements.waistCm ?? "—"} см, Бедра: ${latestMeasurements.hipsCm ?? "—"} см`}
          label="Измерения"
          value={`Грудь: ${latestMeasurements.chestCm ?? "—"} см`}
        />
      </section>

      <section className="flex flex-wrap gap-2">
        {PERIOD_OPTIONS.map((option) => (
          <button
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              period === option.value ? "bg-[var(--primary)] text-white" : "bg-[var(--surface-strong)] text-[var(--foreground)]"
            }`}
            key={option.value}
            onClick={() => setPeriod(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </section>

      <section className="grid gap-6">
        {hasBodyData ? (
          <Card className="p-6">
            <h2 className="text-xl font-semibold">Параметры тела</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">График веса и процента жира по дням.</p>
            <div className="mt-6 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={filteredDays}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(111, 102, 89, 0.2)" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="weightKg"
                    name="Вес"
                    stroke="#0f766e"
                    strokeWidth={3}
                    dot={false}
                    connectNulls={true}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="bodyFatPercent"
                    name="Жир %"
                    stroke="#dd6b20"
                    strokeWidth={2}
                    dot={false}
                    connectNulls={true}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>
        ) : (
          <EmptyStateCard
            title="Пока нет истории параметров"
            description="Сохраните показатели веса или жира, чтобы увидеть график прогресса."
          />
        )}

        {hasMealData ? (
          <Card className="p-6">
            <h2 className="text-xl font-semibold">Калории: факт и цель</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">Сравнение съеденных калорий с целевой нормой.</p>
            <div className="mt-6 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={filteredDays}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(111, 102, 89, 0.2)" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="consumedCalories"
                    name="Съедено"
                    stroke="#0f766e"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="targetCalories"
                    name="Цель"
                    stroke="#dd6b20"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>
        ) : (
          <EmptyStateCard
            title="Пока нет истории питания"
            description="Добавьте приемы пищи, чтобы увидеть сравнение калорий и целей."
          />
        )}

        {hasMealData ? (
          <Card className="p-6">
            <h2 className="text-xl font-semibold">Макронутриенты по дням</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">Суммарные белки, жиры и углеводы за каждый день.</p>
            <div className="mt-6 h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={filteredDays}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(111, 102, 89, 0.2)" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="protein" name="Белки" stackId="macros" fill="#0f766e" />
                  <Bar dataKey="fat" name="Жиры" stackId="macros" fill="#dd6b20" />
                  <Bar dataKey="carbs" name="Углеводы" stackId="macros" fill="#1d4ed8" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>
        ) : null}
      </section>
    </div>
  );
}
