import React from "react";
import { FiEdit3 } from "react-icons/fi";
import CustomIcon from "./CustomIcon";
import IconButton, { IExtendsIconButtonProps } from "./IconButton";

const EditButton: React.FC<IExtendsIconButtonProps> = (props) => {
  return <IconButton {...props} icon={<CustomIcon icon={<FiEdit3 />} />} />;
};

export default React.memo(EditButton);
