import React from "react";
import PageMessage, { IPageMessageProps } from "./PageMessage";

export interface IPageErrorProps extends IPageMessageProps {}

const PageError: React.FC<IPageErrorProps> = (props) => {
  const { message } = props;
  return (
    <PageMessage
      {...props}
      message={message || "An error occurred"}
      type="danger"
    />
  );
};

export default PageError;
