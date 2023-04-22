import { css, cx } from "@emotion/css";
import { Alert, AlertProps } from "antd";
import React from "react";
import { IAppError, isError } from "../../../lib/utils/errors";
import { IStyleableComponent } from "../styling/types";

export interface IAlertGroupProps
  extends Pick<AlertProps, "closable" | "type">,
    IStyleableComponent {
  messages: string[] | IAppError[];
}

const classes = {
  root: css({
    "& .ant-alert": {
      borderRadius: "0px !important",
      textAlign: "left",
    },
    "& .ant-alert:not(:first-type)": {
      borderTop: 0,
    },
    "& .ant-alert:first-of-type": {
      borderTopLeftRadius: "4px !important",
      borderTopRightRadius: "4px !important",
    },
    "& .ant-alert:last-of-type": {
      borderBottomLeftRadius: "4px !important",
      borderBottomRightRadius: "4px !important",
    },
  }),
};

export const AlertGroup: React.FC<IAlertGroupProps> = (props) => {
  const { type, closable, messages, className, style } = props;
  const nodes = messages.map((message, index) => (
    <Alert
      key={index}
      type={type}
      closable={closable}
      message={isError(message) ? message.message : message}
    />
  ));
  return (
    <div className={cx(className, classes.root)} style={style}>
      {nodes}
    </div>
  );
};
