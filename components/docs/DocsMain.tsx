import { MenuOutlined } from "@ant-design/icons";
import Button from "antd/lib/button";
import Head from "next/head";
import { useState } from "react";
import useAppResponsive from "../../lib/hooks/useAppResponsive";
import FimidaraHeader from "../FimidaraHeader";
import { SideNav } from "./SideNav";

export interface IDocsMainProps {
  pageProps: any;
  children: React.ReactNode;
}

// TODO: move header styles to headers
const DocsMain: React.FC<IDocsMainProps> = (props) => {
  const { pageProps, children } = props;
  const title = pageProps.markdoc.frontmatter.title;
  const description = pageProps.markdoc.frontmatter.description;
  const responsive = useAppResponsive();
  const [showMenu, setShowMenu] = useState(!!responsive?.lg);

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
            <div>{children}</div>
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
            max-width: 720px;
            margin: 0 auto;
          }
        `}
      </style>
    </>
  );
};

export default DocsMain;
