"use client";

import { MealType } from "@prisma/client";
import { useActionState, useState } from "react";

import { logMealEntryAction } from "@/app/actions/meals";
import { SubmitButton } from "@/components/auth/submit-button";
import { ProductAutocomplete } from "@/components/meals/product-autocomplete";
import { Input } from "@/components/ui/input";
import { EMPTY_MEAL_LOG_STATE } from "@/lib/meals/validation";

type MealLogFormProps = {
  mealType: MealType;
};

export function MealLogForm({ mealType }: MealLogFormProps) {
  const [state, formAction] = useActionState(logMealEntryAction, EMPTY_MEAL_LOG_STATE);
  const [mode, setMode] = useState<"database" | "manual">("database");

  return (
    <form action={formAction} className="grid gap-4">
      <input name="mealType" type="hidden" value={mealType} />
      <input name="mode" type="hidden" value={mode} />

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

      <div className="flex gap-2">
        <button
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            mode === "database" ? "bg-[var(--primary)] text-white" : "bg-[var(--surface-strong)] text-[var(--foreground)]"
          }`}
          onClick={() => setMode("database")}
          type="button"
        >
          Из базы
        </button>
        <button
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            mode === "manual" ? "bg-[var(--primary)] text-white" : "bg-[var(--surface-strong)] text-[var(--foreground)]"
          }`}
          onClick={() => setMode("manual")}
          type="button"
        >
          Свой продукт
        </button>
      </div>

      {mode === "database" ? (
        <ProductAutocomplete error={state.errors.query} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <Input error={state.errors.name} label="Название продукта" name="name" placeholder="Например, Овсянка" />
          <Input error={state.errors.caloriesPer100g} label="Калории на 100 г" name="caloriesPer100g" type="number" />
          <Input error={state.errors.proteinPer100g} label="Белки на 100 г" name="proteinPer100g" type="number" />
          <Input error={state.errors.fatPer100g} label="Жиры на 100 г" name="fatPer100g" type="number" />
          <Input error={state.errors.carbsPer100g} label="Углеводы на 100 г" name="carbsPer100g" type="number" />
        </div>
      )}

      <Input
        error={state.errors.grams}
        label="Граммы"
        min="1"
        name="grams"
        placeholder="150"
        required
        step="1"
        type="number"
      />

      <div className="flex justify-start">
        <SubmitButton idleLabel="Добавить в прием пищи" pendingLabel="Сохраняем..." />
      </div>
    </form>
  );
}
