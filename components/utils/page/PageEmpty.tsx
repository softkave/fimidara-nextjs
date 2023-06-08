import { css } from "@emotion/css";
import React from "react";
import PageMessage, { IPageMessageProps } from "./PageMessage";

export interface IPageEmptyProps extends IPageMessageProps {}

const classes = {
  root: css({
    backgroundColor: "#f0f0f0",
    borderRadius: "4px",
    padding: "32px",
  }),
};

const PageEmpty: React.FC<IPageEmptyProps> = (props) => {
  return <PageMessage {...props} />;
};

export default PageEmpty;
