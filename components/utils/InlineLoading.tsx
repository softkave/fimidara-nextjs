import { LoadingOutlined } from "@ant-design/icons";
import { Space } from "antd";
import React from "react";

export interface IInlineLoadingProps {
  messageText?: string;
}

const InlineLoading: React.FC<IInlineLoadingProps> = (props) => {
  const { messageText } = props;
  return (
    <Space>
      <LoadingOutlined /> {messageText || "Loading..."}
    </Space>
  );
};

export default InlineLoading;
