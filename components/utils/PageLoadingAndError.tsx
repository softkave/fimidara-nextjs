import React from "react";
import PageError from "./PageError";
import PageLoading from "./PageLoading";
import { appClasses } from "./theme";

export interface IPageLoadingAndErrorProps {
  isLoading?: boolean;
  error?: Error;
  loadingText?: string;
  errorText?: string;
}

const PageLoadingAndError: React.FC<IPageLoadingAndErrorProps> = (props) => {
  const { isLoading, error, loadingText, errorText } = props;
  if (error) {
    return (
      <PageError
        className={appClasses.main}
        messageText={error?.message || errorText || "Error loading data"}
      />
    );
  }
  if (isLoading) {
    return <PageLoading messageText={loadingText || "Loading..."} />;
  }

  return null;
};

export default PageLoadingAndError;
