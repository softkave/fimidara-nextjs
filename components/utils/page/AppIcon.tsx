import { css, cx } from "@emotion/css";
import React from "react";
import { StyleableComponentProps } from "../styling/types";

export interface AppIconProps extends StyleableComponentProps {
  icon: React.ReactNode;
}

const classes = {
  root: css({
    display: "inline-flex",
    alignItems: "center",
  }),
};

const AppTabText: React.FC<AppIconProps> = (props) => {
  const { icon: node, className, style } = props;
  return (
    <span className={cx(classes.root, className)} style={style}>
      {node}
    </span>
  );
};

export default React.memo(AppTabText);
