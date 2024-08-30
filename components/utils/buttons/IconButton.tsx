import { Button } from "@/components/ui/button.tsx";
import { Omit1 } from "@/lib/utils/types";
import { Tooltip } from "antd";
import React, { ComponentProps } from "react";

export interface IIconButtonProps {
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
  title?: string;
  icon: React.ReactNode;
  onClick?: () => void;
  buttonProps?: Partial<ComponentProps<typeof Button>>;
}

export type IExtendsIconButtonProps = Omit1<IIconButtonProps, "icon">;

const IconButton: React.FC<IIconButtonProps> = (props) => {
  const { style, className, disabled, icon, title, onClick, buttonProps } =
    props;
  const btnNode = (
    <Button
      {...buttonProps}
      disabled={disabled}
      onClick={onClick}
      className={className}
      style={style}
      variant="outline"
      size="icon"
    >
      {icon}
    </Button>
  );

  return title ? <Tooltip title={title}>{btnNode}</Tooltip> : btnNode;
};

export default React.memo(IconButton);
