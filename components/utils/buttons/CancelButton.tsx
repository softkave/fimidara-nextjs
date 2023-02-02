import React from "react";
import { FiX } from "react-icons/fi";
import CustomIcon from "./CustomIcon";
import IconButton, { IExtendsIconButtonProps } from "./IconButton";

const CancelButton: React.FC<IExtendsIconButtonProps> = (props) => {
  return <IconButton {...props} icon={<CustomIcon icon={<FiX />} />} />;
};

export default React.memo(CancelButton);
