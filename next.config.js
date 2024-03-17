// import markdocNextJs from "@markdoc/next.js";
// @ts-ignore
// import withPlugins from "next-compose-plugins";

const markdocNextJs = require("@markdoc/next.js");
const withPlugins = require("next-compose-plugins");

const withMarkdoc = markdocNextJs();

// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: process.env.ANALYZE === "true",
//   openAnalyzer: false,
// });

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  reactStrictMode: true,
  pageExtensions: ["md", "mdoc", "js", "jsx", "ts", "tsx"],
  redirects() {
    return [
      {
        source: "/docs",
        destination: "/docs/fimidara/introduction",
        permanent: false,
      },
      {
        source: "/docs/fimidara",
        destination: "/docs/fimidara/introduction",
        permanent: false,
      },
      {
        source: "/docs/fimidara-rest-api",
        destination: "/docs/fimidara-rest-api/v1/overview",
        permanent: false,
      },
      {
        source: "/docs/fimidara-rest-api/v1",
        destination: "/docs/fimidara-rest-api/v1/overview",
        permanent: false,
      },
      {
        source: "/docs/fimidara-js-sdk",
        destination: "/docs/fimidara-js-sdk/v1/overview",
        permanent: false,
      },
      {
        source: "/docs/fimidara-js-sdk/v1",
        destination: "/docs/fimidara-js-sdk/v1/overview",
        permanent: false,
      },
    ];
  },
  transpilePackages: [
    "antd",
    "@ant-design/icons",
    "rc-util",
    "rc-pagination",
    "rc-picker",
    "@ant-design/icons-svg",
    "rc-tree",
    "rc-table",
  ],
};

module.exports = withPlugins(
  [
    [withMarkdoc],
    // [withBundleAnalyzer],
    /* ...other plugins... */
  ],
  nextConfig
);
