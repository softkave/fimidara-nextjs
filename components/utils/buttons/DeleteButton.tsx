import { Trash2 } from "lucide-react";
import React from "react";
import IconButton, { IExtendsIconButtonProps } from "./IconButton";

const CancelButton: React.FC<IExtendsIconButtonProps> = (props) => {
  return <IconButton {...props} icon={<Trash2 className="h-4 w-4" />} />;
};

export default React.memo(CancelButton);
