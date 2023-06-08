import { css, cx } from "@emotion/css";
import React from "react";

export interface IButtonGroupProps {
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
}

const classes = {
  root: css({
    "& .ant-btn": {
      borderRadius: "0px !important",
      borderLeft: 0,
    },
    "& .ant-btn:first-of-type": {
      borderTopLeftRadius: "4px !important",
      borderBottomLeftRadius: "4px !important",
    },
    "& .ant-btn:last-of-type": {
      borderTopRightRadius: "4px !important",
      borderBottomRightRadius: "4px !important",
    },
  }),
};

const ButtonGroup: React.FC<IButtonGroupProps> = (props) => {
  const { style, className, children } = props;
  return (
    <div className={cx(className, classes.root)} style={style}>
      {children}
    </div>
  );
};

export default React.memo(ButtonGroup);
