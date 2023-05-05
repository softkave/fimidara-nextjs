import { cx } from "@emotion/css";
import Head from "next/head";
import React, { useState } from "react";
import useAppResponsive from "../../lib/hooks/useAppResponsive";
import { DocsSideNav } from "./DocsSideNav";

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
      <div className={cx("page", className)}>
        <div className="page-without-header">
          {showMenu ? (
            <div className="side-nav">
              <DocsSideNav onClose={() => setShowMenu(false)} />
            </div>
          ) : (
            <span />
          )}
          <main>
            <div className={contentClassName}>{children}</div>
          </main>
        </div>
      </div>
      <style jsx>
        {`
          .page {
            overflow: hidden;
            height: 100vh;
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
            overflow-y: scroll;
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
