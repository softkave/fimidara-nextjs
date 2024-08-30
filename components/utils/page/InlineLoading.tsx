import { LoadingOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Alert } from "antd";
import React from "react";
import { StyleableComponentProps } from "../styling/types";

export interface IInlineLoadingProps extends StyleableComponentProps {
  messageText?: string;
}

const classes = {
  spinner: css({
    fontSize: "18px",
  }),
};

const InlineLoading: React.FC<IInlineLoadingProps> = (props) => {
  const { messageText, className, style } = props;
  return (
    <Alert
      type="warning"
      message={
        <div className="space-x-2">
          <LoadingOutlined className={classes.spinner} />{" "}
          {messageText || "Loading..."}
        </div>
      }
      className={className}
      style={style}
    />
  );
};

export default InlineLoading;
