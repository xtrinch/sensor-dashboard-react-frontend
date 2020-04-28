import { validate } from "class-validator";

export interface FieldErrors {
  [key: string]: {
    id?: string;
    message: string;
  };
}

export async function validateAndTransform(
  object: Object
): Promise<FieldErrors> {
  const validationErrors = await validate(object);
  const fieldErrors: FieldErrors = {};
  for (const { property, constraints } of validationErrors) {
    fieldErrors[property] = {
      message: Object.values(constraints).join(", "),
    };
  }
  return fieldErrors;
}
