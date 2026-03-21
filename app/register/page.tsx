import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthLayout } from "@/components/auth/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";
import { getSession } from "@/lib/auth/session";

type RegisterPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const [session, params] = await Promise.all([getSession(), searchParams]);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <AuthLayout title="Создайте аккаунт" description="Заполните форму регистрации.">
      <AuthCard
        footer={
          <p className="text-sm text-[var(--muted)]">
            Уже есть аккаунт?{" "}
            <Link className="font-medium text-[var(--primary)]" href="/login">
              Войти
            </Link>
          </p>
        }
      >
        <RegisterForm nextPath={params.next} />
      </AuthCard>
    </AuthLayout>
  );
}
