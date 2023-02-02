import ArrowLeftOutlined from "@ant-design/icons/lib/icons/ArrowLeftOutlined";
import React from "react";
import IconButton, { IExtendsIconButtonProps } from "./IconButton";

const BackButton: React.FC<IExtendsIconButtonProps> = (props) => {
  return <IconButton {...props} icon={<ArrowLeftOutlined />} />;
};

export default React.memo(BackButton);
