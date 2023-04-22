import { Typography } from "antd";
import { TextProps } from "antd/es/typography/Text";
import isString from "lodash/isString";
import React from "react";
import { IAppError } from "../../../lib/utils/errors";
import EmptyMessage, { IEmptyMessageProps } from "./EmptyMessage";

export interface IPageMessageProps extends IEmptyMessageProps {
  type?: TextProps["type"];
  message: Error | Pick<IAppError, "message"> | string;

  /** Don't wrap in EmptyMessage which renders a large icon and a message */
  showMessageOnly?: boolean;
}

const PageMessage: React.FC<IPageMessageProps> = (props) => {
  const { message, children, showMessageOnly, type } = props;
  let messageContentNode: React.ReactNode = children;
  if (isString(message)) {
    messageContentNode = message;
  } else if (message?.message) {
    messageContentNode = message.message;
  }

  const messageNode = (
    <Typography.Text type={type || "secondary"}>
      {messageContentNode}
    </Typography.Text>
  );

  if (showMessageOnly) {
    return messageNode;
  }

  return <EmptyMessage {...props}>{messageNode}</EmptyMessage>;
};

export default PageMessage;
