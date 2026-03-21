import { Card } from "@/components/ui/card";

type EmptyStateCardProps = {
  title: string;
  description: string;
};

export function EmptyStateCard({ title, description }: EmptyStateCardProps) {
  return (
    <Card className="flex min-h-[260px] items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{description}</p>
      </div>
    </Card>
  );
}
