import { cn } from "@/components/utils.ts";
import { AppError } from "@/lib/utils/errors";
import { css } from "@emotion/css";
import { isBoolean, isNumber, merge } from "lodash-es";
import isString from "lodash-es/isString";
import React from "react";
import { StyleableComponentProps } from "../styling/types";
import { appClasses } from "../theme";
import { AlertGroup } from "./AlertGroup";
import EmptyMessage from "./EmptyMessage";

export interface IMessageListProps extends StyleableComponentProps {
  messages: string | AppError | Array<string | AppError> | null;
  shouldFillParent?: boolean;
  shouldPad?: boolean;
  type?: "destructive";
  showMessageOnly?: boolean;
  useAlertGroup?: boolean;
  useEmptyMessage?: boolean;
  maxWidth?: boolean | number;
}

const classes = {
  fillParent: css({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    padding: "0 16px",
    height: "100%",
    margin: "auto",
  }),
};

const MessageList: React.FC<IMessageListProps> = (props) => {
  const {
    messages,
    shouldFillParent,
    type,
    shouldPad,
    className,
    style,
    maxWidth,
    useEmptyMessage,
  } = props;

  // TODO: should we show a generic error instead of []
  let errorList: AppError[] = [];
  if (messages) {
    if (Array.isArray(messages)) {
      errorList = messages.map((error) =>
        isString(error) ? new Error(error) : error
      );
    } else if (isString(messages)) {
      errorList = [new Error(messages)];
    } else if ((messages as any).errors) {
      errorList = (messages as any).errors;
    } else if ((messages as Error).message) {
      errorList = [messages];
    }
  }

  let contentNode = <AlertGroup type={type} messages={errorList} />;

  if (useEmptyMessage) {
    contentNode = <EmptyMessage>{contentNode}</EmptyMessage>;
  }

  // TODO: implement a better key for the items
  return (
    <div
      style={merge(
        {
          maxWidth: isNumber(maxWidth)
            ? maxWidth
            : isBoolean(maxWidth)
            ? "700px"
            : undefined,
        },
        style
      )}
      className={cn(
        className,
        appClasses.w100,
        shouldFillParent && classes.fillParent,
        shouldPad && appClasses.p16
      )}
    >
      {contentNode}
    </div>
  );
};

export default MessageList;
