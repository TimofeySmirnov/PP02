export type BodyMetricFormErrors = {
  weightKg?: string;
  bodyFatPercent?: string;
  waistCm?: string;
  hipsCm?: string;
  chestCm?: string;
  form?: string;
};

export type BodyMetricFormState = {
  errors: BodyMetricFormErrors;
  success?: string;
};

export const EMPTY_BODY_METRIC_STATE: BodyMetricFormState = {
  errors: {},
};

function parseOptionalNumber(value: string, min: number, max: number) {
  const normalized = value.trim();

  if (!normalized) {
    return { value: null, error: undefined };
  }

  const parsed = Number(normalized);

  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    return { value: null, error: `Значение должно быть в диапазоне ${min}-${max}.` };
  }

  return { value: parsed, error: undefined };
}

export function validateBodyMetricInput(input: {
  weightKg: string;
  bodyFatPercent: string;
  waistCm: string;
  hipsCm: string;
  chestCm: string;
}) {
  const errors: BodyMetricFormErrors = {};

  const weight = parseOptionalNumber(input.weightKg, 35, 300);
  const bodyFat = parseOptionalNumber(input.bodyFatPercent, 2, 70);
  const waist = parseOptionalNumber(input.waistCm, 30, 250);
  const hips = parseOptionalNumber(input.hipsCm, 30, 250);
  const chest = parseOptionalNumber(input.chestCm, 30, 250);

  if (weight.value == null) {
    errors.weightKg = "Вес обязателен и должен быть в диапазоне 35-300 кг.";
  }

  if (bodyFat.error) {
    errors.bodyFatPercent = bodyFat.error;
  }

  if (waist.error) {
    errors.waistCm = waist.error;
  }

  if (hips.error) {
    errors.hipsCm = hips.error;
  }

  if (chest.error) {
    errors.chestCm = chest.error;
  }

  if (Object.keys(errors).length > 0 || weight.value == null) {
    return { errors };
  }

  return {
    errors,
    values: {
      weightKg: weight.value,
      bodyFatPercent: bodyFat.value,
      waistCm: waist.value,
      hipsCm: hips.value,
      chestCm: chest.value,
    },
  };
}
