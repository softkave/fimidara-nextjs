import { AppError, flattenErrorList } from "@/lib/utils/errors";
import { AnyObject } from "@/lib/utils/types";
import { message } from "antd";
import { FormikTouched } from "formik";
import { get } from "lodash";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";
import { AnySchema, ValidationError } from "yup";
import { IFormBag, IFormBagHelpers, IFormItem } from "./types";

export const validateWithYupSchema = (
  yupSchema: AnySchema<any>,
  values: any
) => {
  try {
    yupSchema.validateSync(values, { abortEarly: false });
    return null;
  } catch (validationError: any) {
    const err: any = {};

    if (
      Array.isArray(validationError.inner) &&
      validationError.inner.length > 0
    ) {
      validationError.inner.forEach((item: ValidationError) => {
        if (item.path && !err[item.path]) {
          err[item.path] = item.message;
        }
      });
    } else {
      err[validationError.path] = validationError.message;
    }

    return err;
  }
};

export const getFormikTouched = <T extends AnyObject>(
  val: T
): FormikTouched<T> => {
  return Object.keys(val).reduce((accumulator, field: keyof T) => {
    if (isObject(val[field]) || isArray(val[field])) {
      accumulator[field] = getFormikTouched(val[field]) as any;
    } else {
      accumulator[field] = true as any;
    }

    return accumulator;
  }, {} as FormikTouched<T>);
};

export function handleFormError(
  loadingState: { error?: AppError[] | null },
  helpers: IFormBagHelpers<any>,
  defaultMessage = "An error occurred",
  errorStartFrom?: string
) {
  const error = loadingState.error || [new Error(defaultMessage)];
  const flatError = flattenErrorList(error, true);
  const saveError = errorStartFrom ? get(flatError, errorStartFrom) : flatError;
  message.error(flatError.error || defaultMessage, 15);
  if (saveError) {
    helpers.setErrors(saveError);
  }
}

export function makeFormItemSaveFn<T extends AnyObject>(
  saveFn: (values: Partial<T>, helpers: IFormBagHelpers<T>) => Promise<void>
) {
  return async (item: IFormItem<any>, bag: IFormBag<any>) => {
    const k = item.name as keyof T;
    await saveFn({ [k]: bag.values[k] } as Partial<T>, bag);
  };
}
