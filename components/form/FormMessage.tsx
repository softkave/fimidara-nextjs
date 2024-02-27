import { css, cx } from "@emotion/css";
import { compact, isObject, isString } from "lodash";
import React from "react";
import { AppError } from "../../lib/utils/errors";

type FormMessageType = "error" | "message";
type MessageWithVisible = { message: string; visible?: boolean };
type SimpleMessageType =
  | string
  | Error
  | AppError
  | MessageWithVisible
  | React.ReactElement;
type SimpleMessageTypeWithFalsyValues = SimpleMessageType | null | undefined;
type StackedMessageType =
  | SimpleMessageTypeWithFalsyValues
  | Array<SimpleMessageTypeWithFalsyValues>;

export interface IFormMessageProps {
  className?: string;
  style?: React.CSSProperties;
  message?: StackedMessageType;
  type?: FormMessageType;
  visible?: boolean;
}

const FormMessage: React.FC<IFormMessageProps> = (props) => {
  const { children, message, type, className, style, visible } = props;

  if (!visible) {
    return null;
  }

  const messages: Array<SimpleMessageType> = Array.isArray(message)
    ? compact(message)
    : message
    ? [message]
    : [];

  const renderedMessages: React.ReactNode[] = [];
  messages.forEach((message) => {
    if (isString(message)) {
      renderedMessages.push(message);
    } else if (React.isValidElement(message)) {
      renderedMessages.push(message);
    } else if (
      isObject(message) &&
      (message as Error).message &&
      (message as MessageWithVisible).visible !== false
    ) {
      renderedMessages.push((message as Error).message);
    }
  });

  if (renderedMessages.length === 0) {
    return null;
  }

  return (
    <div
      style={style}
      className={cx(
        className,
        css({
          color: getFontColor(type as FormMessageType),
          lineHeight: "24px",
        })
      )}
    >
      {children}
      {renderedMessages.length === 1 && renderedMessages[0]}
      {renderedMessages.length > 1 && (
        <ul>
          {renderedMessages.map((nextMessage, i) => {
            return <li key={i}>{nextMessage}</li>;
          })}
        </ul>
      )}
    </div>
  );
};

FormMessage.defaultProps = {
  message: [],
  visible: true,
};

function getFontColor(type: FormMessageType) {
  switch (type) {
    case "error":
      return "red";
    case "message":
      return "green";
    default:
      return "black";
  }
}

export function getVisibleMessages(
  messages: { message?: string; visible?: boolean }[]
): MessageWithVisible[] {
  return messages.filter((message) => {
    return message.message && message.visible;
  }) as MessageWithVisible[];
}

export default FormMessage;
