import { ConfigProvider } from "antd";
import { isUndefined } from "lodash";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import NextNProgress from "nextjs-progressbar";
import React from "react";
import AppHeader from "../components/app/AppHeader";
import MarkdocDocsMain from "../components/docs/MarkdocDocsMain";
import ErrorBoundary from "../components/utils/page/ErrorBoundary";
import { appClasses } from "../components/utils/theme";
import WebHeader from "../components/web/WebHeader";
import {
  appAccountPaths,
  appRootPaths,
  appUserPaths,
} from "../lib/definitions/system";
import { useUserLoggedIn } from "../lib/hooks/useUserLoggedIn";
import "../styles/globals.css";

function FilesApp({ Component, pageProps }: AppProps) {
  const { isLoggedIn } = useUserLoggedIn();
  const router = useRouter();

  const isOutsideApp = isOutsideAppPath(router.asPath);
  const shouldRouteToApp = isLoggedIn && isRouteToAppOnInitPath(router.asPath);

  React.useEffect(() => {
    if (shouldRouteToApp) router.push(appUserPaths.workspaces);
  }, [shouldRouteToApp]);

  let node: React.ReactNode = null;
  let headerNode: React.ReactNode = null;

  if (!shouldRouteToApp && !isUndefined(isLoggedIn)) {
    node = <Component {...pageProps} />;
    headerNode = isOutsideApp ? (
      <WebHeader />
    ) : isLoggedIn ? (
      <AppHeader />
    ) : (
      <WebHeader />
    );

    if (pageProps.markdoc) {
      node = <MarkdocDocsMain pageProps={pageProps}>{node}</MarkdocDocsMain>;
    }
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
            fontFamily: `-apple-system, BlinkMacSystemFont, "Work Sans", "Segoe UI",
            Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
            "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
            fontFamilyCode: `'Source Code Pro', monospace`,
          },
        }}
      >
        {headerNode}
        <div className={appClasses.main}>{node}</div>
      </ConfigProvider>
    </ErrorBoundary>
  );
}

export default FilesApp;

// Render WebHeader for these routes starting with these paths
const outsideAppRoutes = [
  appAccountPaths.signup,
  appAccountPaths.login,
  appAccountPaths.changePassword,
  appAccountPaths.forgotPassword,
  appAccountPaths.verifyEmail,
];

const routeToAppOnInitRoutes = [
  // appRootPaths.home,
  appAccountPaths.signup,
  appAccountPaths.login,
];

function isOutsideAppPath(pathname: string) {
  return outsideAppRoutes.some((r) => {
    return pathname.startsWith(r);
  });
}

function isRouteToAppOnInitPath(pathname: string) {
  return (
    pathname === appRootPaths.home ||
    routeToAppOnInitRoutes.some((r) => {
      return pathname.startsWith(r);
    })
  );
}
