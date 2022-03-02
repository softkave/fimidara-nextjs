import "../styles/globals.css";
import "../styles/antd.less";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "../lib/store/store";
import useLoggedInStatus from "../lib/hooks/useLoggedInStatus";

function FilesApp({ Component, pageProps }: AppProps) {
  useLoggedInStatus();
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default FilesApp;
