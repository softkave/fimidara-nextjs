import { css, cx } from "@emotion/css";
import { Empty } from "antd";
import React from "react";
import { appClasses } from "../theme";

export interface IEmptyMessageProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  image?: React.ReactNode;
}

const classes = {
  root: css({
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  }),
};

const EmptyMessage: React.FC<IEmptyMessageProps> = (props) => {
  const { children, className, style, image } = props;
  return (
    <div className={cx(className, classes.root)} style={style}>
      <Empty description={children} className={appClasses.w100} image={image} />
    </div>
  );
};

export default EmptyMessage;
