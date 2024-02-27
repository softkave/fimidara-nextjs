import React from "react";
import PageMessage, { IPageMessageProps } from "./PageMessage";

export interface IPageLoadingProps extends IPageMessageProps {}

const PageLoading: React.FC<IPageLoadingProps> = (props) => {
  const { message } = props;
  return <PageMessage {...props} message={message || "Loading..."} />;
};

export default PageLoading;
