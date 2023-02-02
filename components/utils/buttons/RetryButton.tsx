import ReloadOutlined from "@ant-design/icons/lib/icons/ReloadOutlined";
import React from "react";
import IconButton, { IExtendsIconButtonProps } from "./IconButton";

const RetryButton: React.FC<IExtendsIconButtonProps> = (props) => {
  return <IconButton {...props} icon={<ReloadOutlined />} />;
};

export default React.memo(RetryButton);
