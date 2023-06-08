import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import React from "react";
import IconButton, { IExtendsIconButtonProps } from "./IconButton";

const CancelButton: React.FC<IExtendsIconButtonProps> = (props) => {
  return <IconButton {...props} icon={<DeleteOutlined />} />;
};

export default React.memo(CancelButton);
