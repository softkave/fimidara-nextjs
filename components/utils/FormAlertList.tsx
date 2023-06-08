import { AlertProps, Space } from "antd";
import { FormAlert } from "./FormAlert";

export interface FormAlertListProps extends Omit<AlertProps, "message"> {
  error: any[];
}

export function FormAlertList(props: FormAlertListProps) {
  const { error } = props;
  const errorNode = error.map((e) => <FormAlert error={e} />);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {errorNode}
    </Space>
  );
}
