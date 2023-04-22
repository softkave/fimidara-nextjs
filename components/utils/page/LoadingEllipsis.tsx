import { css } from "@emotion/css";
import React from "react";

const classes = {
  root: css({
    display: "flex",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
  }),
};

const LoadingEllipsis: React.FC<{}> = () => (
  <div className={classes.root}>...</div>
);

export default LoadingEllipsis;
