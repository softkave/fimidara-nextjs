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
  appInternalPaths,
  appRootPaths,
  appUserPaths,
} from "../lib/definitions/system";
import { useUserLoggedIn } from "../lib/hooks/useUserLoggedIn";
import "../styles/globals.css";

function FilesApp({ Component, pageProps }: AppProps) {
  const { isLoggedIn } = useUserLoggedIn();
  const router = useRouter();

  const isInWebPath = isWebPath(router.asPath);
  const isInNoHeaderPath = isNoHeaderPath(router.asPath);
  const shouldRouteToApp = isLoggedIn && isRouteToAppOnInitPath(router.asPath);

  React.useEffect(() => {
    if (shouldRouteToApp) router.push(appUserPaths.workspaces);
  }, [shouldRouteToApp]);

  let node: React.ReactNode = null;
  let headerNode: React.ReactNode = null;

  if (!shouldRouteToApp && !isUndefined(isLoggedIn)) {
    node = <Component {...pageProps} />;

    if (isInWebPath) headerNode = <WebHeader />;
    else if (isInNoHeaderPath) headerNode = null;
    else if (isLoggedIn) headerNode = <AppHeader />;

    if (pageProps.markdoc) {
      node = <MarkdocDocsMain pageProps={pageProps}>{node}</MarkdocDocsMain>;
    }
  }

  const isPathDocs = router.asPath.startsWith("/docs");

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
            colorTextBase: "#262626",
          },
        }}
      >
        {headerNode}
        <div className={isPathDocs ? undefined : appClasses.main}>{node}</div>
      </ConfigProvider>
    </ErrorBoundary>
  );
}

export default FilesApp;

// Render WebHeader for these routes starting with these paths
const webRoutes = [
  appAccountPaths.signup,
  appAccountPaths.login,
  appAccountPaths.changePassword,
  appAccountPaths.forgotPassword,
  appAccountPaths.verifyEmail,
];
const noHeaderRoutes = [appInternalPaths.waitlist];
const routeToAppOnInitRoutes = [
  // appRootPaths.home,
  appAccountPaths.signup,
  appAccountPaths.login,
];

function isWebPath(pathname: string) {
  return webRoutes.some((r) => {
    return pathname.startsWith(r);
  });
}
function isNoHeaderPath(pathname: string) {
  return noHeaderRoutes.some((r) => {
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
