import type { AppProps } from "next/app";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import { Provider } from "react-redux";
import DocsMain from "../components/docs/DocsMain";
import store from "../lib/store/store";
import "../styles/antd.less";
import "../styles/globals.css";

function FilesApp({ Component, pageProps }: AppProps) {
  let node: React.ReactNode = <Component {...pageProps} />;
  if (pageProps.markdoc) {
    node = <DocsMain pageProps={pageProps}>{node}</DocsMain>;
  }

  return (
    <Provider store={store}>
      <Head>
        {/* <link rel="shortcut icon" href="/fimidara.svg" /> */}
        <title>fimidara</title>
      </Head>
      <NextNProgress options={{ showSpinner: false }} />
      {node}
    </Provider>
  );
}

export default FilesApp;
