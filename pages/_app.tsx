import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "../lib/store/store";
import NextNProgress from "nextjs-progressbar";
import "../styles/globals.css";
import "../styles/antd.less";

function FilesApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <NextNProgress />
      <Component {...pageProps} />
    </Provider>
  );
}

export default FilesApp;
