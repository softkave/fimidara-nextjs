import { css } from "@emotion/css";

export const formBodyClassName = css({
  width: "100%",
  display: "flex",
  flex: 1,
  flexDirection: "column",
  overflow: "auto",
});

export const formContentWrapperClassName = css({
  width: "100%",
  maxWidth: "520px",
  padding: "16px 0px",
  boxSizing: "content-box",
  overflowY: "auto",
  flexDirection: "column",
  margin: "auto",
});

export const formClasses = {
  formBodyClassName,
  formContentWrapperClassName,
};
