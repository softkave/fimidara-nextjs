const withPlugins = require("next-compose-plugins");
const withMarkdoc = require("@markdoc/next.js")();

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
