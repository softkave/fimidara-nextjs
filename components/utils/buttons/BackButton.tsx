import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import IconButton, { IExtendsIconButtonProps } from "./IconButton";

const BackButton: React.FC<IExtendsIconButtonProps> = (props) => {
  return <IconButton {...props} icon={<FiArrowLeft />} />;
};

export default React.memo(BackButton);
