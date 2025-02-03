import { cn } from "@/lib/utils.ts";
import { AppError, getBaseError } from "@/lib/utils/errors";
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
      <PageError message={getBaseError(error) || defaultErrorMessage} />
    );
  } else if (isLoading) {
    contentNode = (
      <div className="space-y-4">
        {contentNode}
        <PageLoading message={defaultLoadingMessage} />
      </div>
    );
  } else if (data) {
    const dataNode = render(data);
    contentNode = (
      <div className="space-y-4 w-full">
        {contentNode}
        {dataNode}
      </div>
    );
  }

  return (
    <div className={cn(className, "w-full")} style={style}>
      {contentNode}
    </div>
  );
}

export default PageContent02;
