import { RedoOutlined } from "@ant-design/icons";
import { Space, Typography } from "antd";
import React from "react";
import IconButton from "../buttons/IconButton";

export interface IInlineErrorProps {
  messageText?: string;
  reload?: () => void;
}

const InlineError: React.FC<IInlineErrorProps> = (props) => {
  const { messageText, reload } = props;
  return (
    <Space>
      <Typography.Text type="danger">
        {messageText || "An error occurred"}
      </Typography.Text>
      {reload && <IconButton icon={<RedoOutlined />} title="Reload" />}
    </Space>
  );
};

export default InlineError;
