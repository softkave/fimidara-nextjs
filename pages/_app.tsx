import FimidaraHeader from "@/components/app/FimidaraHeader";
import { InitApp } from "@/components/utils/InitApp";
import { ConfigProvider } from "antd";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import NextNProgress from "nextjs-progressbar";
import React from "react";
import MarkdocDocsMain from "../components/docs/MarkdocDocsMain";
import ErrorBoundary from "../components/utils/page/ErrorBoundary";
import { appClasses } from "../components/utils/theme";
import "../styles/globals.css";

function FimidaraApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isPathDocs = router.asPath.startsWith("/docs");

  let node: React.ReactNode = <Component {...pageProps} />;
  if (pageProps.markdoc) {
    node = <MarkdocDocsMain pageProps={pageProps}>{node}</MarkdocDocsMain>;
  }

  return (
    <ErrorBoundary>
      <Head>
        <title>fimidara</title>
      </Head>
      <NextNProgress options={{ showSpinner: false }} />
      <ConfigProvider
        theme={{
          token: {
            fontFamily: `"Work Sans", "Segoe UI", -apple-system, BlinkMacSystemFont, 
            Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
            "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
            fontFamilyCode: `'Source Code Pro', monospace`,
            colorTextBase: "#262626",
          },
        }}
      >
        <InitApp />
        <FimidaraHeader />
        <div className={isPathDocs ? undefined : appClasses.main}>{node}</div>
      </ConfigProvider>
    </ErrorBoundary>
  );
}

export default FimidaraApp;
