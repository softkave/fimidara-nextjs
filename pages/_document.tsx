import { Html, Head, Main, NextScript } from "next/document";
import getAppFonts from "../components/utils/appFonts";

export default function Document() {
  return (
    <Html>
      <Head>
        <title>Files by Softkave</title>
        {getAppFonts()}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
