"use client";

import { Gender, GoalType, type Profile } from "@prisma/client";
import { useActionState } from "react";

import { saveProfileAction } from "@/app/actions/profile";
import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { EMPTY_PROFILE_STATE } from "@/lib/profile/validation";

type ProfileFormProps = {
  profile: Profile | null;
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const [state, formAction] = useActionState(saveProfileAction, EMPTY_PROFILE_STATE);

  return (
    <form action={formAction} className="grid gap-5">
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
          defaultValue={profile?.displayName ?? ""}
          error={state.errors.displayName}
          label="Имя"
          name="displayName"
          placeholder="Анна Иванова"
          required
        />
        <Select
          defaultValue={profile?.gender ?? ""}
          error={state.errors.gender}
          label="Пол"
          name="gender"
          required
        >
          <option value="">Выберите пол</option>
          <option value={Gender.FEMALE}>Женский</option>
          <option value={Gender.MALE}>Мужской</option>
        </Select>
        <Input
          defaultValue={profile?.age ?? ""}
          error={state.errors.age}
          label="Возраст"
          max={100}
          min={14}
          name="age"
          required
          type="number"
        />
        <Input
          defaultValue={profile?.weightKg ?? ""}
          error={state.errors.weightKg}
          label="Вес (кг)"
          max="300"
          min="35"
          name="weightKg"
          required
          step="0.1"
          type="number"
        />
        <Input
          defaultValue={profile?.heightCm ?? ""}
          error={state.errors.heightCm}
          label="Рост (см)"
          max="250"
          min="130"
          name="heightCm"
          required
          step="0.1"
          type="number"
        />
        <Select
          defaultValue={profile?.goal ?? ""}
          error={state.errors.goal}
          label="Цель"
          name="goal"
          required
        >
          <option value="">Выберите цель</option>
          <option value={GoalType.LOSE_WEIGHT}>Снижение веса</option>
          <option value={GoalType.MAINTAIN}>Поддержание</option>
          <option value={GoalType.GAIN_WEIGHT}>Набор веса</option>
        </Select>
      </div>

      <div className="flex justify-start">
        <SubmitButton idleLabel="Сохранить профиль" pendingLabel="Сохраняем..." />
      </div>
    </form>
  );
}
