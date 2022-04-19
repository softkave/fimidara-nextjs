import { RedoOutlined } from "@ant-design/icons";
import { Button, Space, Typography } from "antd";
import React from "react";
import { messages } from "../../lib/messages/messages";

export interface IInlineErrorProps {
  messageText?: string;
  reload?: () => void;
}

const InlineError: React.FC<IInlineErrorProps> = (props) => {
  const { messageText, reload } = props;
  return (
    <Space>
      <Typography.Text type="danger">
        {messageText || messages.errorOccurred}
      </Typography.Text>
      {reload && <Button icon={<RedoOutlined />}>Reload</Button>}
    </Space>
  );
};

export default InlineError;
