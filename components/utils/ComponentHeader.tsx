import { css } from "@emotion/css";
import { Typography } from "antd";
import React from "react";

export interface IComponentHeaderProps {
  title: string;
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
  const { title, children } = props;
  return (
    <div className={classes.root}>
      <Typography.Title level={5} className={classes.title}>
        {title}
      </Typography.Title>
      {children}
    </div>
  );
};

export default ComponentHeader;
