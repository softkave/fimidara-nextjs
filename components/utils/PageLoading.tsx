import React from "react";
import PageNothingFound, { IPageNothingFoundProps } from "./PageNothingFound";

export interface IPageLoadingProps extends IPageNothingFoundProps {}

const PageLoading: React.FC<IPageLoadingProps> = (props) => {
  const { messageText } = props;
  return (
    <PageNothingFound {...props} messageText={messageText || "Loading..."} />
  );
};

export default PageLoading;
