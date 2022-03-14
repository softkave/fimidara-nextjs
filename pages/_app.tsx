import "../styles/globals.css";
import "../styles/antd.less";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "../lib/store/store";

// TODO: auto route to app when logged in

function FilesApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default FilesApp;
