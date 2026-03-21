"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { clearSession, createSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import {
  type AuthFormState,
  validateLoginInput,
  validateRegisterInput,
} from "@/lib/auth/validation";

function getSafeRedirectPath(value: FormDataEntryValue | null) {
  const nextPath = String(value ?? "").trim();
  return nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/dashboard";
}

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "").trim();

  const errors = validateRegisterInput({ name, email, password });

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return {
      errors: {
        email: "Пользователь с таким email уже существует.",
      },
    };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      profile: {
        create: {
          displayName: name,
        },
      },
    },
    include: {
      profile: {
        select: {
          displayName: true,
        },
      },
    },
  });

  await createSession({
    userId: user.id,
    email: user.email,
    name: user.profile?.displayName || name,
  });

  redirect(getSafeRedirectPath(formData.get("next")));
}

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "").trim();

  const errors = validateLoginInput({ email, password });

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      profile: {
        select: {
          displayName: true,
        },
      },
    },
  });

  if (!user) {
    return {
      errors: {
        form: "Неверный email или пароль.",
      },
    };
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    return {
      errors: {
        form: "Неверный email или пароль.",
      },
    };
  }

  await createSession({
    userId: user.id,
    email: user.email,
    name: user.profile?.displayName || user.email,
  });

  redirect(getSafeRedirectPath(formData.get("next")));
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
