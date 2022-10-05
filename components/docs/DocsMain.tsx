import BarsOutlined from "@ant-design/icons/lib/icons/BarsOutlined";
import Button from "antd/lib/button";
import Dropdown from "antd/lib/dropdown";
import Menu from "antd/lib/menu";
import Head from "next/head";
import { useRouter } from "next/router";
import FimidaraHeader from "../FimidaraHeader";
import { docsNavItems } from "./navItems";

export interface IDocsMainProps {
  pageProps: any;
  children: React.ReactNode;
}

const DocsMain: React.FC<IDocsMainProps> = (props) => {
  const { pageProps, children } = props;
  const router = useRouter();
  const title = pageProps.markdoc.frontmatter.title;
  const description = pageProps.markdoc.frontmatter.description;
  const dropdownNode = (
    <Dropdown
      overlay={
        <Menu
          items={docsNavItems}
          defaultSelectedKeys={[router.pathname]}
          style={{ minWidth: "145px" }}
        />
      }
    >
      <Button icon={<BarsOutlined />} />
    </Dropdown>
  );

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="referrer" content="strict-origin" />
        <meta name="title" content={title} />
        <meta name="description" content={description} />
      </Head>
      <FimidaraHeader webHeaderProps={{ prefixBtn: dropdownNode }} />
      <div className="page">
        {/* <SideNav /> */}
        <main className="flex column">{children}</main>
      </div>
      <style jsx>
        {`
          .page {
            position: fixed;
            top: var(--top-nav-height);
            display: flex;
            width: 100vw;
            flex-grow: 1;
          }
          main {
            overflow: auto;
            height: calc(100vh - var(--top-nav-height));
            flex-grow: 1;
            font-size: 16px;
            padding: 0 1rem 1rem;
            max-width: 1020px;
            margin: 0 auto;
          }
        `}
      </style>
    </>
  );
};

export default DocsMain;
