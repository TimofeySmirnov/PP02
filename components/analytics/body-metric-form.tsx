"use client";

import { useActionState } from "react";

import { saveBodyMetricAction } from "@/app/actions/body-metrics";
import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/ui/input";
import { EMPTY_BODY_METRIC_STATE } from "@/lib/body-metrics/validation";

type BodyMetricFormProps = {
  currentWeightKg?: number | null;
};

export function BodyMetricForm({ currentWeightKg }: BodyMetricFormProps) {
  const [state, formAction] = useActionState(saveBodyMetricAction, EMPTY_BODY_METRIC_STATE);

  return (
    <form action={formAction} className="grid gap-4">
      {state.success ? (
        <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {state.success}
        </p>
      ) : null}

      {state.errors.form ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.errors.form}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          defaultValue={currentWeightKg ?? ""}
          error={state.errors.weightKg}
          label="Вес (кг)"
          min="35"
          name="weightKg"
          required
          step="0.1"
          type="number"
        />
        <Input
          error={state.errors.bodyFatPercent}
          label="Жир (%)"
          max="70"
          min="2"
          name="bodyFatPercent"
          step="0.1"
          type="number"
        />
        <Input error={state.errors.waistCm} label="Талия (см)" min="30" name="waistCm" step="0.1" type="number" />
        <Input error={state.errors.hipsCm} label="Бедра (см)" min="30" name="hipsCm" step="0.1" type="number" />
        <Input error={state.errors.chestCm} label="Грудь (см)" min="30" name="chestCm" step="0.1" type="number" />
      </div>

      <div className="flex justify-start">
        <SubmitButton idleLabel="Сохранить показатели" pendingLabel="Сохраняем..." />
      </div>
    </form>
  );
}
