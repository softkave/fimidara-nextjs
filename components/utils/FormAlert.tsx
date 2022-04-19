import { Alert, AlertProps } from "antd";
import React from "react";
import { enrichErrorMessage } from "./errorHandling";

export interface IFormAlertProps extends Omit<AlertProps, "message"> {
  error?: any;
}

export function FormAlert(props: IFormAlertProps) {
  const { error } = props;
  const errorMessage = enrichErrorMessage(error);
  return <Alert type="error" {...props} message={errorMessage} />;
}
