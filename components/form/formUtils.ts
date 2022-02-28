import { FormikErrors, FormikProps } from "formik";
import { IFormError } from "../types";
import { get, set, isObjectLike } from "lodash";

export function getFormError(errors: object = {}) {
    return (errors as any).error;
}

export type IFormikFormErrors<Values> = FormikErrors<Values> & {
    error?: string | string[];
};

export function wrapFormFunc<
    FuncParams extends Array<any>,
    FuncResult,
    FuncType extends (...args: FuncParams) => FuncResult
>(
    func: FuncType,
    setErrors: (e: IFormError<any>) => void
): (...args: FuncParams) => FuncResult | undefined {
    return (...args: FuncParams) => {
        try {
            return func(...args);
        } catch (error) {
            setErrors({
                errors: { error: error?.message || "An error occurred" },
                errorList: [],
            });
        }
    };
}

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
