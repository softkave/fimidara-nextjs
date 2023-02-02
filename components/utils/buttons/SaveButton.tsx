import React from "react";
import { FiCheck } from "react-icons/fi";
import CustomIcon from "./CustomIcon";
import IconButton, { IExtendsIconButtonProps } from "./IconButton";

const SaveButton: React.FC<IExtendsIconButtonProps> = (props) => {
  return <IconButton {...props} icon={<CustomIcon icon={<FiCheck />} />} />;
};

export default React.memo(SaveButton);
