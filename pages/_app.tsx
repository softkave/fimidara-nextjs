import { ConfigProvider } from "antd";
import type { AppProps } from "next/app";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import { Provider } from "react-redux";
import MarkdocDocsMain from "../components/docs/MarkdocDocsMain";
import ErrorBoundary from "../components/utils/page/ErrorBoundary";
import store from "../lib/store/store";
import "../styles/globals.css";

function FilesApp({ Component, pageProps }: AppProps) {
  let node: React.ReactNode = <Component {...pageProps} />;
  if (pageProps.markdoc) {
    node = <MarkdocDocsMain pageProps={pageProps}>{node}</MarkdocDocsMain>;
  }

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <Head>
          {/* <link rel="shortcut icon" href="/fimidara.svg" /> */}
          <title>fimidara</title>
        </Head>
        <NextNProgress options={{ showSpinner: false }} />
        <ConfigProvider
          theme={{
            token: {
              fontFamily: `-apple-system, BlinkMacSystemFont, "Work Sans", "Segoe UI",
            Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
            "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
              fontFamilyCode: `'Source Code Pro', monospace`,
            },
          }}
        >
          {node}
        </ConfigProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default FilesApp;
