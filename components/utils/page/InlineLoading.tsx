import { LoadingOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Alert, Space } from "antd";
import React from "react";
import { IStyleableComponent } from "../styling/types";

export interface IInlineLoadingProps extends IStyleableComponent {
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
        <Space>
          <LoadingOutlined className={classes.spinner} />{" "}
          {messageText || "Loading..."}
        </Space>
      }
      className={className}
      style={style}
    />
  );
};

export default InlineLoading;
