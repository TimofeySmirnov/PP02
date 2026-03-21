import { Card } from "@/components/ui/card";

type SummaryCardProps = {
  label: string;
  value: string;
  hint: string;
};

export function SummaryCard({ label, value, hint }: SummaryCardProps) {
  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">{hint}</p>
    </Card>
  );
}
