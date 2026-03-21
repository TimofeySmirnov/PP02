const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^[A-Za-z]{8,20}$/;

export type AuthFieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  form?: string;
};

export type AuthFormState = {
  errors: AuthFieldErrors;
};

export const EMPTY_AUTH_STATE: AuthFormState = {
  errors: {},
};

export function validateRegisterInput(input: {
  name: string;
  email: string;
  password: string;
}): AuthFieldErrors {
  const errors: AuthFieldErrors = {};

  if (!input.name.trim()) {
    errors.name = "Введите имя.";
  }

  if (!EMAIL_REGEX.test(input.email)) {
    errors.email = "Введите корректный email.";
  }

  if (!PASSWORD_REGEX.test(input.password)) {
    errors.password =
      "Пароль должен содержать 8-20 символов и состоять только из английских букв.";
  }

  return errors;
}

export function validateLoginInput(input: {
  email: string;
  password: string;
}): AuthFieldErrors {
  const errors: AuthFieldErrors = {};

  if (!EMAIL_REGEX.test(input.email)) {
    errors.email = "Введите корректный email.";
  }

  if (!PASSWORD_REGEX.test(input.password)) {
    errors.password =
      "Пароль должен содержать 8-20 символов и состоять только из английских букв.";
  }

  return errors;
}
