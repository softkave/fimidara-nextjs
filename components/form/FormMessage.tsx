import { css, cx } from "@emotion/css";
import React from "react";
import { compact, isString } from "lodash";
import { IAppError } from "../../lib/definitions/system";

type FormMessageType = "error" | "message";
type MessageWithVisible = { message: string; visible?: boolean };
type SimpleMessageType = string | Error | IAppError | MessageWithVisible;
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

  let messages: Array<SimpleMessageType> = Array.isArray(message)
    ? compact(message)
    : message
    ? [message]
    : [];

  const renderedMessages: React.ReactNode[] = [];

  messages.forEach((message) => {
    if (isString(message)) {
      renderedMessages.push(message);
    } else if (
      message.message &&
      (message as MessageWithVisible).visible !== false
    ) {
      renderedMessages.push(message.message);
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
          padding: "4px 0",
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

export function filterMessagesWithVisible(
  messages: { message?: string; visible?: boolean }[]
): MessageWithVisible[] {
  return messages.filter((message) => {
    return message.message && message.visible;
  }) as MessageWithVisible[];
}

export default FormMessage;
