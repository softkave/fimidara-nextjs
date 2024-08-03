import React from "react";
import { enrichErrorMessage } from "../errorHandling";
import FormMessage, { IFormMessageProps } from "./FormMessage";

export interface IFormErrorProps {
  className?: string;
  style?: React.CSSProperties;
  error?: IFormMessageProps["message"];
  visible?: boolean;
  enrich?: boolean;
  children?: React.ReactNode;
}

const FormError: React.FC<IFormErrorProps> = (props) => {
  const { className, style, visible, enrich, children } = props;
  const error = enrich
    ? enrichErrorMessage(props.error) ?? "An error occurred"
    : props.error;

  return (
    <FormMessage
      visible={visible}
      type="error"
      message={error}
      className={className}
      style={style}
    >
      {children}
    </FormMessage>
  );
};

export default FormError;
