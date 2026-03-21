import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";
import { BodyMetricForm } from "@/components/analytics/body-metric-form";
import { PageHeader } from "@/components/layout/page-header";
import { ProtectedAppShell } from "@/components/layout/protected-app-shell";
import { Card } from "@/components/ui/card";
import { getAnalyticsData } from "@/lib/analytics/get-analytics-data";
import { calculateAdherenceMetrics } from "@/lib/analytics/utils";
import { requireSession } from "@/lib/auth/session";
import { getUserProfile } from "@/lib/profile/get-profile";

export default async function AnalyticsPage() {
  const session = await requireSession();
  const [profile, analytics] = await Promise.all([
    getUserProfile(session.userId),
    getAnalyticsData(session.userId),
  ]);

  const adherence = {
    "7d": calculateAdherenceMetrics(analytics.days.slice(-7)),
    "30d": calculateAdherenceMetrics(analytics.days.slice(-30)),
    all: calculateAdherenceMetrics(analytics.days),
  };

  return (
    <ProtectedAppShell>
      <PageHeader
        eyebrow="Показатели"
        title="Прогресс и аналитика"
        description="Следите за динамикой веса, калорий и макронутриентов, а также за соблюдением дневной цели."
      />

      <section className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold">Добавить показатели за сегодня</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Вес обязателен. Остальные параметры можно добавлять по желанию.
          </p>
          <div className="mt-6">
            <BodyMetricForm currentWeightKg={profile?.weightKg} />
          </div>
        </Card>

        <AnalyticsDashboard
          adherence={adherence}
          days={analytics.days}
          hasBodyData={analytics.hasBodyData}
          hasMealData={analytics.hasMealData}
          latestMeasurements={analytics.latestMeasurements}
        />
      </section>
    </ProtectedAppShell>
  );
}
