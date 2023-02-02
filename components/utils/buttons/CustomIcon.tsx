import Icon from "@ant-design/icons/lib/components/Icon";
import { css, cx } from "@emotion/css";
import { isFunction } from "lodash";
import React from "react";
import { IconType } from "react-icons/lib";
import { Omit1 } from "../../../lib/utils/types";

export interface ICustomIconProps {
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
  icon: React.ReactElement | IconType;
  onClick?: () => void;
}

export type IExtendsCustomIconProps = Omit1<ICustomIconProps, "icon">;

const classes = {
  root: css({
    "&": {
      fontSize: "16px !important",
    },
  }),
};

const CustomIcon: React.FC<ICustomIconProps> = (props) => {
  const { style, className, disabled, icon, onClick } = props;
  return (
    <Icon
      disabled={disabled}
      onClick={onClick}
      className={cx(classes.root, className)}
      style={style}
      component={isFunction(icon) ? icon : () => icon}
    >
      {/* {icon} */}
    </Icon>
  );
};

export default React.memo(CustomIcon);
