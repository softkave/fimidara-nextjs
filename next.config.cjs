import markdocNextJs from "@markdoc/next.js";
// @ts-ignore
import withPlugins from "next-compose-plugins";

const withMarkdoc = markdocNextJs();

// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: process.env.ANALYZE === "true",
//   openAnalyzer: false,
// });

/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

module.exports = withPlugins(
  [
    [withMarkdoc],
    // [withBundleAnalyzer],
    /* ...other plugins... */
  ],
  nextConfig
);
