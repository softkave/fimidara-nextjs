import { AppError, getBaseError } from "@/lib/utils/errors";
import { Space } from "antd";
import React from "react";
import { StyleableComponentProps } from "../styling/types";
import PageError from "./PageError";
import PageLoading from "./PageLoading";

export interface IPageContent02Props<T> extends StyleableComponentProps {
  isLoading?: boolean;
  defaultLoadingMessage?: string;
  error?: AppError[] | undefined;
  defaultErrorMessage?: string;
  data?: T;
  isDataFetched?: boolean;
  render(item: T): React.ReactNode;
}

function PageContent02<T>(props: IPageContent02Props<T>) {
  const {
    data,
    isDataFetched,
    defaultLoadingMessage,
    isLoading,
    error,
    defaultErrorMessage,
    render,
    className,
    style,
  } = props;

  let contentNode: React.ReactNode = null;

  if (error) {
    contentNode = (
      <PageError
        message={getBaseError(error) || defaultErrorMessage}
        showMessageOnly={isDataFetched}
      />
    );
  } else if (isLoading) {
    contentNode = (
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        {contentNode}
        <PageLoading
          message={defaultLoadingMessage}
          showMessageOnly={isDataFetched}
        />
      </Space>
    );
  } else if (data) {
    const dataNode = render(data);
    contentNode = (
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        {contentNode}
        {dataNode}
      </Space>
    );
  }

  return (
    <div className={className} style={style}>
      {contentNode}
    </div>
  );
}

export default PageContent02;
