import type { DefaultOptionType } from "antd/lib/select";
import { FormikErrors, FormikProps } from "formik";
import { get, isObjectLike, set } from "lodash-es";

export function getFormError(errors: object = {}) {
  return (errors as any).error;
}

export type IFormikFormErrors<Values> = FormikErrors<Values> & {
  error?: string | string[];
};

export function markErrorFieldsTouched(
  errors: Record<string, any>,
  touched: Record<string, any>
): Record<string, any> {
  touched = { ...touched };
  Object.keys(errors).forEach((key) => {
    const fieldErrors = errors[key];
    let fieldTouched: boolean | Record<string, any> = true;

    if (isObjectLike(fieldErrors)) {
      fieldTouched = markErrorFieldsTouched(
        fieldErrors,
        get(touched, key) || {}
      );
    }

    set(touched, key, fieldTouched);
  });

  return touched;
}

export async function preSubmitCheck(formik: FormikProps<any>) {
  const valErrors = await formik.validateForm();
  const newTouched = markErrorFieldsTouched(valErrors, formik.touched);
  formik.setTouched(newTouched);
}

export function filterOption(
  input: string,
  option: DefaultOptionType | undefined
) {
  const label = option?.label as string;
  return label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

export function filterSort(
  optionA: DefaultOptionType,
  optionB: DefaultOptionType
) {
  const label01 = optionA?.label as string;
  const label02 = optionB?.label as string;
  return label01.toLowerCase().localeCompare(label02.toLowerCase());
}
