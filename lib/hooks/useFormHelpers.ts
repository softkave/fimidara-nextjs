"use client";

import { FormikConfig, FormikProps, useFormik } from "formik";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { flattenErrorList, toAppErrorList } from "../utils/errors";

export interface IUseFormHelpersFormikProps<T> {
  formikProps: FormikConfig<T>;
  errors?: any;
}

export interface IUseFormHelpersResult<T extends object> {
  formik: FormikProps<T>;
}

const useFormHelpers = <T extends object>(
  props: IUseFormHelpersFormikProps<T>
): IUseFormHelpersResult<T> => {
  const formik = useFormik(props.formikProps);
  const lastErrorRef = React.useRef<any>();

  React.useEffect(() => {
    if (props.errors && props.errors !== lastErrorRef.current) {
      lastErrorRef.current = props.errors;
      const errorArr = toAppErrorList(props.errors);
      const fErrors = flattenErrorList(errorArr);
      formik.setErrors(fErrors);
    }
  }, [props.errors, formik]);

  return {
    formik,
  };
};

export const useNewForm = (
  form: UseFormReturn<any, any, any>,
  other: { errors?: unknown }
) => {
  const lastErrorRef = React.useRef<any>();

  React.useEffect(() => {
    if (other.errors && other.errors !== lastErrorRef.current) {
      lastErrorRef.current = other.errors;
      const errorArr = toAppErrorList(other.errors);
      errorArr.forEach((err) => {
        if (err.field) form.setError(err.field, err);
      });
    }
  }, [other.errors, form]);
};

export default useFormHelpers;
