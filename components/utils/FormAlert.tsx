import { Alert, AlertProps, Form } from "antd";
import React from "react";
import { enrichErrorMessage } from "./errorHandling";

export interface IFormAlertProps extends Omit<AlertProps, "message"> {
  error: any;
}

export function FormAlert(props: IFormAlertProps) {
  const { error } = props;
  const errorMessage = enrichErrorMessage(error);
  return errorMessage ? (
    <Form.Item>
      <Alert type="error" {...props} message={errorMessage} />
    </Form.Item>
  ) : null;
}
