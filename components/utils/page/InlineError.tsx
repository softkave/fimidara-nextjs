import { RedoOutlined } from "@ant-design/icons";
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
      <span className="text-red-600">{messageText || "An error occurred"}</span>
      {reload && <IconButton icon={<RedoOutlined />} title="Reload" />}
    </div>
  );
};

export default InlineError;
