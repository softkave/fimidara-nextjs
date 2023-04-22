import type { AppProps } from "next/app";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import { Provider } from "react-redux";
import MarkdocDocsMain from "../components/docs/MarkdocDocsMain";
import store from "../lib/store/store";
import "../styles/antd.less";
import "../styles/globals.css";

function FilesApp({ Component, pageProps }: AppProps) {
  let node: React.ReactNode = <Component {...pageProps} />;
  if (pageProps.markdoc) {
    node = <MarkdocDocsMain pageProps={pageProps}>{node}</MarkdocDocsMain>;
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
