"use client";

import { cx } from "@emotion/css";
import Head from "next/head";
import React, { useState } from "react";
import useAppResponsive from "../../lib/hooks/useAppResponsive";

export interface IDocsMainProps {
  pageTitle: string;
  pageDescription?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

// TODO: move header styles to headers
const DocsMain: React.FC<IDocsMainProps> = (props) => {
  const { pageTitle, pageDescription, className, contentClassName, children } =
    props;
  const responsive = useAppResponsive();
  const [showMenu, setShowMenu] = useState(!!responsive?.lg);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="referrer" content="strict-origin" />
        <meta name="title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
      </Head>
      <div className={cx("docsMain", className)}>
        <div className="docsMainInner">
          <main>
            <div className={contentClassName}>{children}</div>
          </main>
        </div>
      </div>
      <style jsx>
        {`
          .docsMain {
            height: 100vh;
            max-width: 1020px;
            margin: 0px auto;
          }
          .docsMainInner {
            display: grid;
            grid-template-columns: 1fr;
            width: 100%
            height: 100vh;
            overflow: hidden;
          }
          .docsSideNav {
            max-height: calc(100vh - var(--top-nav-height));
            overflow: hidden;
          }
          .docsSideNav ul {
            height: 100%;
          }
          main {
            overflow-y: scroll;
          }
          main > div {
            padding: 1rem;
            max-width: 820px;
            margin: 0 auto;
          }
          main * {
            font-size: 14px;
            color: rgba(38, 38, 38, 0.88);
          }
        `}
      </style>
    </>
  );
};

export default DocsMain;
