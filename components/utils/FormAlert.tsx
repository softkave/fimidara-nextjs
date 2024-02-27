import { Alert, AlertProps, Form } from "antd";
import { enrichErrorMessage } from "./errorHandling";

export interface IFormAlertProps extends Omit<AlertProps, "message"> {
  error: any;
}

export function FormAlert(props: IFormAlertProps) {
  const { error } = props;
  const errorMessage = enrichErrorMessage(error) ?? "An error occurred";
  return errorMessage ? (
    <Form.Item>
      <Alert type="error" {...props} message={errorMessage} />
    </Form.Item>
  ) : null;
}
