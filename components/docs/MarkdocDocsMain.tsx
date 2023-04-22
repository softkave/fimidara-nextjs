import { css } from "@emotion/css";
import { MarkdocNextJsPageProps } from "@markdoc/next.js";
import React from "react";
import DocsMain from "./DocsMain";

export interface IMarkdocDocsMainProps {
  pageProps: Required<MarkdocNextJsPageProps>;
  children: React.ReactNode;
}

const classes = {
  docsContent: css({
    "& tr": {
      borderTop: "1px solid #BBB",
      borderRight: "1px solid #BBB",
    },
    "& tr:last-of-type": {
      borderBottom: "1px solid #BBB",
    },
    "& tr th": {
      textAlign: "left",
      padding: "4px",
      borderLeft: "1px solid #BBB",
    },
    "& tr th:first-of-type": {
      borderRight: "none",
    },
    "& tr td": {
      textAlign: "left",
      padding: "4px",
      borderLeft: "1px solid #BBB",
    },
    "& tr td:first-of-type": {
      borderRight: "none",
    },
    "& p": {
      margin: "8px 0px",
    },
    "& h2": {
      fontSize: "16px",
    },
    "& h2:not(:first-of-type)": {
      marginTop: "48px",
    },
  }),
};

const MarkdocDocsMain: React.FC<IMarkdocDocsMainProps> = (props) => {
  const { pageProps, children } = props;
  const title = pageProps.markdoc.frontmatter.title;
  const description = pageProps.markdoc.frontmatter.description;

  return (
    <DocsMain
      pageTitle={title}
      pageDescription={description}
      contentClassName={classes.docsContent}
    >
      {children}
    </DocsMain>
  );
};

export default MarkdocDocsMain;
