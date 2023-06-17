import React from "react";
import PageMessage, { IPageMessageProps } from "./PageMessage";

export interface IPageNothingFoundProps extends IPageMessageProps {}

const PageNothingFound: React.FC<IPageNothingFoundProps> = (props) => {
  const { message } = props;
  return <PageMessage {...props} message={message || "Not found."} />;
};

export default PageNothingFound;
