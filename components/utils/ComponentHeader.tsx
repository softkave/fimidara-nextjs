import { css, cx } from "@emotion/css";
import Title from "antd/es/typography/Title";
import React from "react";

export interface IComponentHeaderProps {
  title: string;
  copyable?: boolean;
  className?: string;
  prefixNode?: React.ReactNode;
  children?: React.ReactNode;
}

const classes = {
  title: css({
    flex: 1,
    marginRight: "16px",
  }),
  root: css({
    display: "flex",
  }),
  prefix: css({
    marginRight: "16px",
  }),
};

const ComponentHeader: React.FC<IComponentHeaderProps> = (props) => {
  const { title, copyable, className, prefixNode, children } = props;
  return (
    <div className={cx(classes.root, className)}>
      {prefixNode && <div className={classes.prefix}>{prefixNode}</div>}
      <Title copyable={copyable} level={4} className={classes.title}>
        {title}
      </Title>
      {children}
    </div>
  );
};

export default ComponentHeader;
