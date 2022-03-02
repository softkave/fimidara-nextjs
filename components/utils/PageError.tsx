import { Typography } from "antd";
import React from "react";
import PageNothingFound, { IPageNothingFoundProps } from "./PageNothingFound";

export interface IPageErrorProps extends IPageNothingFoundProps {}

const PageError: React.FC<IPageErrorProps> = (props) => {
  const { message, messageText } = props;
  return (
    <PageNothingFound
      {...props}
      message={
        message || (
          <Typography.Text strong>
            {messageText || "An error occurred"}
          </Typography.Text>
        )
      }
    />
  );
};

export default PageError;
