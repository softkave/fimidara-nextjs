import React from "react";
import { ErrorLike } from "../../../lib/utils/errors";
import FormFieldMessage from "./FormFieldMessage";

export interface IFormFieldErrorProps {
  error?: ErrorLike;
  children?: React.ReactNode;
}

const FormFieldError: React.FC<IFormFieldErrorProps> = (props) => {
  return (
    <FormFieldMessage type="error" message={props.error}>
      {props.children}
    </FormFieldMessage>
  );
};

export default FormFieldError;
