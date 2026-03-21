import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Трекер питания"
        title="Чистая основа для приложения в стиле LifeSum."
        description="Этот шаблон уже включает общий каркас приложения, базовые маршруты и Prisma-модели, чтобы следующим шагом добавить авторизацию, учет приемов пищи и аналитику."
      />

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="p-8">
          <h2 className="text-2xl font-semibold tracking-tight">Что уже готово</h2>
          <div className="mt-4 grid gap-3 text-sm text-[var(--muted)]">
            <p>Страницы App Router для входа, регистрации и основных экранов приложения.</p>
            <p>Дизайн-токены на Tailwind и переиспользуемые UI-компоненты.</p>
            <p>Prisma-схема для пользователей, профиля, приемов пищи и позиций в них.</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/dashboard">Открыть дашборд</Button>
            <Button href="/register" variant="secondary">
              Создать аккаунт
            </Button>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold tracking-tight">Следующие шаги</h2>
          <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            <li>Подключить авторизацию и управление сессией.</li>
            <li>Собрать формы добавления приемов пищи и метрики на дашборде.</li>
            <li>Подвязать Prisma-запросы к server actions и route handlers.</li>
          </ul>
        </Card>
      </section>
    </AppShell>
  );
}
