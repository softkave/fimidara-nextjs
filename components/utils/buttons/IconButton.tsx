import { Omit1 } from "@/lib/utils/types";
import { cx } from "@emotion/css";
import { Button, ButtonProps, Tooltip } from "antd";
import React from "react";

export interface IIconButtonProps {
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
  title?: string;
  icon: React.ReactNode;
  onClick?: () => void;
  buttonProps?: Partial<ButtonProps>;
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
      className={cx("icon-btn", className)}
      style={style}
    >
      {icon}
    </Button>
  );

  return title ? <Tooltip title={title}>{btnNode}</Tooltip> : btnNode;
};

export default React.memo(IconButton);
