import type { AppProps } from "next/app";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import { Provider } from "react-redux";
import store from "../lib/store/store";
import "../styles/antd.less";
import "../styles/globals.css";

function FilesApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap"
          rel="stylesheet"
        />
        {/* <link rel="shortcut icon" href="/fimidara.svg" /> */}
        <title>fimidara</title>
      </Head>
      <NextNProgress options={{ showSpinner: false }} />
      <Component {...pageProps} />
    </Provider>
  );
}

export default FilesApp;
