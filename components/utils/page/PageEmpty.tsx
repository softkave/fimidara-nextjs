import React from "react";
import PageMessage, { IPageMessageProps } from "./PageMessage";

export interface IPageEmptyProps extends IPageMessageProps {}

const PageEmpty: React.FC<IPageEmptyProps> = (props) => {
  return <PageMessage {...props} />;
};

export default PageEmpty;
