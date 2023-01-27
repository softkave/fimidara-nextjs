import { MenuOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Tag } from "@markdoc/markdoc";
import { MarkdocNextJsPageProps } from "@markdoc/next.js";
import Button from "antd/lib/button";
import Head from "next/head";
import React, { useState } from "react";
import useAppResponsive from "../../lib/hooks/useAppResponsive";
import FimidaraHeader from "../FimidaraHeader";
import { SideNav } from "./SideNav";
import { TOCSection } from "./types";

export interface IDocsMainProps {
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
      // marginTop: "48px",
    },
    "& h2:not(:first-of-type)": {
      marginTop: "48px",
    },
  }),
};

// TODO: move header styles to headers
const DocsMain: React.FC<IDocsMainProps> = (props) => {
  const { pageProps, children } = props;
  const title = pageProps.markdoc.frontmatter.title;
  const description = pageProps.markdoc.frontmatter.description;
  const responsive = useAppResponsive();
  const [showMenu, setShowMenu] = useState(!!responsive?.lg);
  const toc = React.useMemo(
    () =>
      pageProps.markdoc?.content
        ? collectHeadings(pageProps.markdoc.content)
        : [],
    [pageProps.markdoc.content]
  );

  console.log({ toc, pageProps });

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="referrer" content="strict-origin" />
        <meta name="title" content={title} />
        <meta name="description" content={description} />
      </Head>
      <div className="page">
        <div className="header">
          <FimidaraHeader
            headerProps={{
              prefixBtn: (
                <Button
                  icon={<MenuOutlined />}
                  onClick={() => setShowMenu(!showMenu)}
                />
              ),
            }}
          />
        </div>
        <div className="page-without-header">
          {showMenu ? (
            <div className="side-nav">
              <SideNav onClose={() => setShowMenu(false)} />
            </div>
          ) : (
            <span />
          )}
          <main>
            <div className={classes.docsContent}>
              {/* <TableOfContents toc={toc} /> */}
              {children}
            </div>
          </main>
        </div>
      </div>
      <style jsx>
        {`
          .page {
            overflow: hidden;
            height: 100vh;
          }
          .header {
            position: fixed;
            width: 100%;
            background-color: white;
          }
          .page-without-header {
            display: grid;
            grid-template-columns: auto 1fr;
            padding-top: var(--top-nav-height);
            width: 100%;
            height: 100vh;
            overflow: hidden;
          }
          .side-nav {
            max-height: calc(100vh - var(--top-nav-height));
            overflow: hidden;
          }
          .side-nav ul {
            height: 100%;
          }
          main {
            width: 100%;
            overflow: auto;
          }
          main > div {
            padding: 1rem;
            max-width: 820px;
            margin: 0 auto;
          }
        `}
      </style>
    </>
  );
};

export default DocsMain;

function collectHeadings(node: unknown, sections: Array<TOCSection> = []) {
  if (Tag.isTag(node)) {
    if (node.name === "Heading") {
      const title = node.children[0];

      if (typeof title === "string") {
        sections.push({
          ...node.attributes,
          title,
        });
      }
    }

    if (node.children) {
      for (const child of node.children) {
        collectHeadings(child, sections);
      }
    }
  }

  return sections;
}
