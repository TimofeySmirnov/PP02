import { Card } from "@/components/ui/card";

type StatCardProps = {
  label: string;
  value: string;
  hint: string;
};

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <Card className="p-6">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-3 text-sm text-[var(--muted)]">{hint}</p>
    </Card>
  );
}
