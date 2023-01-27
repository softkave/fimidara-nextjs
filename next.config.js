const withPlugins = require("next-compose-plugins");
const withMarkdoc = require("@markdoc/next.js")();
const withLess = require("next-with-less")({
  lessLoaderOptions: {
    lessOptions: {
      modifyVars: {},
    },
  },
});

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
        destination: "/docs/fimidara-rest-api/workspaces/getWorkspace",
        permanent: false,
      },
    ];
  },
  // ...withLess,
};

module.exports = withPlugins(
  [
    [withLess],
    [withMarkdoc],
    // [withBundleAnalyzer],
    /* ...other plugins... */
  ],
  nextConfig
);
