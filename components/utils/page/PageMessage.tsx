import { AppError } from "@/lib/utils/errors";
import { css, cx } from "@emotion/css";
import { Button, ButtonProps, Space, Typography } from "antd";
import { TextProps } from "antd/es/typography/Text";
import isString from "lodash/isString";
import React from "react";
import { StyleableComponentProps } from "../styling/types";
import EmptyMessage, { IEmptyMessageProps } from "./EmptyMessage";

export type IPageMessageAction = ButtonProps;

export interface IPageMessageProps
  extends IEmptyMessageProps,
    StyleableComponentProps {
  type?: TextProps["type"];
  message: Pick<AppError, "message"> | React.ReactNode;

  /** Don't wrap in EmptyMessage which renders a large icon and a message */
  showMessageOnly?: boolean;
  actions?: Array<IPageMessageAction | React.ReactElement>;
}

export interface PageMessageActionsProps extends StyleableComponentProps {
  actions: IPageMessageProps["actions"];
}

const classes = {
  root: css({
    backgroundColor: "#f0f0f0",
    borderRadius: "4px",
    padding: "32px",
  }),
  actions: css({
    marginTop: "32px",
  }),
};

const isPageAction = (
  action: Required<IPageMessageProps>["actions"][0]
): action is IPageMessageAction => {
  return !React.isValidElement(action);
};

export const PageMessageActions: React.FC<PageMessageActionsProps> = (
  props
) => {
  const { actions, style, className } = props;
  if (actions?.length === 0) return null;
  return (
    <Space style={style} className={className}>
      {actions?.map((action, i) => {
        if (isPageAction(action)) {
          return <Button key={i} {...action} />;
        } else {
          return action;
        }
      })}
    </Space>
  );
};

function isError(message: any): message is Pick<AppError, "message"> {
  if (message && (message as Pick<AppError, "message">).message) {
    return true;
  }
  return false;
}

const PageMessage: React.FC<IPageMessageProps> = (props) => {
  const {
    message,
    children,
    showMessageOnly,
    type,
    actions,
    style,
    className,
  } = props;

  let messageNode: React.ReactNode = null;

  if (isString(message)) {
    messageNode = message;
  } else if (isError(message)) {
    messageNode = message.message;
  } else {
    messageNode = message;
  }

  if (isString(messageNode)) {
    messageNode = (
      <Typography.Text type={type || "secondary"}>
        {messageNode}
      </Typography.Text>
    );
  }

  if (showMessageOnly) {
    return (
      <div style={style} className={cx(classes.root, className)}>
        {messageNode}
        <PageMessageActions actions={actions} className={classes.actions} />
        {children}
      </div>
    );
  }

  return (
    <EmptyMessage {...props} className={cx(classes.root, className)}>
      {messageNode}
      <PageMessageActions actions={actions} className={classes.actions} />
      {children}
    </EmptyMessage>
  );
};

export default PageMessage;
