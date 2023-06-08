import React from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import IconButton, { IExtendsIconButtonProps } from "./IconButton";

const MenuButton: React.FC<IExtendsIconButtonProps> = (props) => {
  return <IconButton {...props} icon={<FiMoreHorizontal />} />;
};

export default React.memo(MenuButton);
