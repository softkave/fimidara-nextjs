import { css } from "@emotion/css";
import React from "react";
import { ErrorLike } from "../../../lib/utils/errors";

type FormMessageType = "error" | "message";

export interface IFormFieldMessageProps {
  message?: ErrorLike;
  type?: FormMessageType;
  children?: React.ReactNode;
}

const FormFieldMessage: React.FC<IFormFieldMessageProps> = (props) => {
  const { children, message, type } = props;
  const messages = Array.isArray(message) ? message : message ? [message] : [];
  const isVisible = React.Children.count(children) > 0 || messages.length > 0;
  const renderMessage = (msg: string | Error) => {
    if (msg) {
      if (typeof msg === "string") return msg;
      else if (msg.message) return msg.message;
    }
    return null;
  };

  if (!isVisible) return null;
  return (
    <div
      className={css({
        color: getFontColor(type as FormMessageType),
        lineHeight: "16px",
      })}
    >
      {children}
      {messages.length === 1 && renderMessage(messages[0])}
      {messages.length > 1 && (
        <ul>
          {messages.map((nextMessage) => {
            return <li>{renderMessage(nextMessage)}</li>;
          })}
        </ul>
      )}
    </div>
  );
};

FormFieldMessage.defaultProps = {
  message: [],
};

export default FormFieldMessage;

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
