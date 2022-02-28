import "../styles/globals.css";
import "../styles/antd.less";
import "intl-tel-input/build/css/intlTelInput.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "../lib/store/store";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
