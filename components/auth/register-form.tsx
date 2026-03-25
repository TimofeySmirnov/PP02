"use client";

import { useActionState } from "react";

import { registerAction } from "@/app/actions/auth";
import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/ui/input";
import { EMPTY_AUTH_STATE } from "@/lib/auth/validation";

type RegisterFormProps = {
  nextPath?: string;
};

export function RegisterForm({ nextPath = "/" }: RegisterFormProps) {
  const [state, formAction] = useActionState(registerAction, EMPTY_AUTH_STATE);

  return (
    <form action={formAction} className="grid gap-4">
      <input name="next" type="hidden" value={nextPath} />

      {state.errors.form ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.errors.form}
        </p>
      ) : null}

      <Input
        autoComplete="name"
        error={state.errors.name}
        label="Полное имя"
        name="name"
        placeholder="Анна Иванова"
        required
      />
      <Input
        autoComplete="email"
        error={state.errors.email}
        label="Эл. почта"
        name="email"
        placeholder="you@example.com"
        required
        type="email"
      />
      <Input
        autoComplete="new-password"
        error={state.errors.password}
        label="Пароль"
        maxLength={20}
        minLength={8}
        name="password"
        pattern="[A-Za-z]{8,20}"
        placeholder="Только английские буквы, 8-20 символов"
        required
        title="Только английские буквы, от 8 до 20 символов"
        type="password"
      />
      <SubmitButton idleLabel="Создать аккаунт" pendingLabel="Создаем аккаунт..." />
    </form>
  );
}
