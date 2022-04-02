import { css, cx } from "@emotion/css";
import { Typography } from "antd";
import React from "react";

export interface IComponentHeaderProps {
  title: string;
  copyable?: boolean;
  className?: string;
}

const classes = {
  title: css({
    flex: 1,
    marginRight: "16px",
  }),
  root: css({
    display: "flex",
  }),
};

const ComponentHeader: React.FC<IComponentHeaderProps> = (props) => {
  const { title, copyable, className, children } = props;
  return (
    <div className={cx(classes.root, className)}>
      <Typography.Title copyable={copyable} level={4} className={classes.title}>
        {title}
      </Typography.Title>
      {children}
    </div>
  );
};

export default ComponentHeader;
