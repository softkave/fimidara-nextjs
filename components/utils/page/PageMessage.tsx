import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/components/utils.ts";
import { AppError } from "@/lib/utils/errors";
import isString from "lodash-es/isString";
import React, { ComponentProps } from "react";
import { StyleableComponentProps } from "../styling/types";
import { ITextProps, Text } from "../text.tsx";
import EmptyMessage, { IEmptyMessageProps } from "./EmptyMessage";

export type IPageMessageAction = ComponentProps<typeof Button>;

export interface IPageMessageProps
  extends IEmptyMessageProps,
    StyleableComponentProps {
  type?: ITextProps["type"];
  message?: Pick<AppError, "message"> | React.ReactNode;
  actions?: Array<IPageMessageAction | React.ReactElement>;
  title?: React.ReactNode;
}

export interface PageMessageActionsProps extends StyleableComponentProps {
  actions: IPageMessageProps["actions"];
}

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
    <div style={style} className={cn("space-x-2", className)}>
      {actions?.map((action, i) => {
        if (isPageAction(action)) {
          return <Button key={i} {...action} type="button" />;
        } else {
          return action;
        }
      })}
    </div>
  );
};

function isError(message: any): message is Pick<AppError, "message"> {
  if (message && (message as Pick<AppError, "message">).message) {
    return true;
  }

  return false;
}

const PageMessage: React.FC<IPageMessageProps> = (props) => {
  const { message, children, type, actions, className } = props;

  let messageNode: React.ReactNode = null;

  if (isString(message)) {
    messageNode = message;
  } else if (isError(message)) {
    messageNode = message.message;
  } else {
    messageNode = message;
  }

  if (isString(messageNode)) {
    messageNode = <Text type={type}>{messageNode}</Text>;
  }

  return (
    <EmptyMessage
      {...props}
      className={cn(
        "space-y-4",
        "flex",
        "flex-col",
        "justify-center",
        "h-full",
        "py-8",
        className
      )}
    >
      {messageNode}
      <PageMessageActions actions={actions} />
      {children}
    </EmptyMessage>
  );
};

export default PageMessage;
