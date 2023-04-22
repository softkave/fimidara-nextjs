import { RedoOutlined } from "@ant-design/icons";
import { Button, Space, Typography } from "antd";
import React from "react";

export interface IInlineErrorProps {
  messageText?: string;
  reload?: () => void;
}

const InlineError: React.FC<IInlineErrorProps> = (props) => {
  const { messageText, reload } = props;
  return (
    <Space>
      <Typography.Text type="danger">{messageText || "An error occurred"}</Typography.Text>
      {reload && <Button icon={<RedoOutlined />}>Reload</Button>}
    </Space>
  );
};

export default InlineError;
