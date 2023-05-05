import { FormikConfig, FormikProps, useFormik } from "formik";
import React from "react";
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

  React.useEffect(() => {
    if (props.errors) {
      const errorArr = toAppErrorList(props.errors);
      const fErrors = flattenErrorList(errorArr);
      formik.setErrors(fErrors);
    }
  }, [props.errors, formik]);

  return {
    formik,
  };
};

export default useFormHelpers;
