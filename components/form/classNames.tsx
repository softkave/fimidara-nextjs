import { css } from "@emotion/css";

export const formBodyClassName = css({
  padding: "16px 16px",
  width: "100%",
  display: "flex",
  flex: 1,
  flexDirection: "column",
  overflow: "auto",
});

export const formContentWrapperClassName = css({
  width: "100%",
  maxWidth: "520px",
  padding: "16px",
  overflowY: "auto",
  flexDirection: "column",
  margin: "auto",
});

export const formClasses = {
  formBodyClassName,
  formContentWrapperClassName,
};
