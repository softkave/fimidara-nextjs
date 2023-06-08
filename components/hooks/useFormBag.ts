import { useFormik } from "formik";
import { set } from "lodash";
import React from "react";
import { AnyObject } from "yup/lib/types";
import { FormSaving, IFormBag, IFormBagHelpers } from "../utils/form/types";

export interface IUseFormBagProps<T extends AnyObject> {
  initialValues: T;
  validationSchema?: any;
  errors?: AnyObject;
  onSubmit: (values: T, helpers: IFormBagHelpers<T>) => void;
}

export function useFormBag<T extends AnyObject>(props: IUseFormBagProps<T>): { bag: IFormBag<T> } {
  const { initialValues, validationSchema, errors, onSubmit } = props;
  const [savingState, setSaving] = React.useState({} as FormSaving<T>);
  const handleSubmit = (values: T, helpers: IFormBagHelpers<T>) => {
    onSubmit(values, helpers);
  };

  const formik = useFormik<T>({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit as any,
  });
  const setErrors = formik.setErrors;
  React.useEffect(() => {
    if (errors) setErrors(errors);
  }, [errors, setErrors]);

  const setFieldSaving = (field: keyof T, saving: boolean | string) => {
    setSaving((state) => {
      const newState = { ...state };
      set(newState, field, saving);
      return newState;
    });
  };

  const bag: IFormBag<T> = {
    savingState,
    setFieldSaving,
    setErrors: formik.setErrors,
    setFieldError: formik.setFieldError as any,
    setTouched: formik.setTouched,
    setFieldTouched: formik.setFieldTouched as any,
    setValues: formik.setValues,
    setFieldValue: formik.setFieldValue as any,
    errors: formik.errors,
    touched: formik.touched,
    values: formik.values,
    isSubmitting: formik.isSubmitting,
    setSubmitting: formik.setSubmitting,
    handleSubmit: formik.handleSubmit,
  };

  return { bag };
}
