import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import { getSession } from "@/lib/auth/session";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const [session, params] = await Promise.all([getSession(), searchParams]);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <AuthLayout title="С возвращением" description="Войдите в свой аккаунт.">
      <AuthCard
        footer={
          <p className="text-sm text-[var(--muted)]">
            Впервые здесь?{" "}
            <Link className="font-medium text-[var(--primary)]" href="/register">
              Создать аккаунт
            </Link>
          </p>
        }
      >
        <LoginForm nextPath={params.next} />
      </AuthCard>
    </AuthLayout>
  );
}
