import { css } from "@emotion/css";

export const formBodyClassname = css({
  padding: "16px 16px",
  width: "100%",
  display: "flex",
  flex: 1,
  flexDirection: "column",
  overflow: "auto",
});

export const formSectionClassname = css({
  maxWidth: "400px",
});

export const formClassname = css(`
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  flex-direction: column;
  
  & .ant-typography {
      margin-bottom: 0;
  }
  
  & .ant-typography-edit-content {
      left: 0px;
  }
`);

export const formContentWrapperStyle: React.CSSProperties = {
  width: "100%",
  padding: "16px ",
  overflowY: "auto",
  flexDirection: "column",
};

export const formInputContentWrapperStyle: React.CSSProperties = {
  width: "100%",
  flexDirection: "column",
};

export const formClasses = {
  form: formClassname,
  compactFormItem: css({
    "& .ant-form-item-control-input": {
      minHeight: "16px",
    },
  }),
  formContent: css(formContentWrapperStyle as any),
};
