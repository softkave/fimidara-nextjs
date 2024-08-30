import { RedoOutlined } from "@ant-design/icons";
import Text from "antd/es/typography/Text";
import React from "react";
import IconButton from "../buttons/IconButton";

export interface IInlineErrorProps {
  messageText?: string;
  reload?: () => void;
}

const InlineError: React.FC<IInlineErrorProps> = (props) => {
  const { messageText, reload } = props;
  return (
    <div className="space-x-2">
      <Text type="danger">{messageText || "An error occurred"}</Text>
      {reload && <IconButton icon={<RedoOutlined />} title="Reload" />}
    </div>
  );
};

export default InlineError;
