import { FormikConfig, FormikProps, useFormik } from "formik";
import React from "react";

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

  React.useEffect(() => {
    if (props.errors) {
      formik.setErrors(props.errors);
    }
  }, [props.errors, formik]);

  return {
    formik,
  };
};

export default useFormHelpers;
