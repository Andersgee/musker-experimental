// @ts-check
import withBundleAnalyzer from "@next/bundle-analyzer";
//import { withSuperjson } from "next-superjson";
import "./src/env/server.mjs";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
//!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  experimental: {
    appDir: true,
    newNextLinkBehavior: true,
  },
};

//export default withSuperjson()(config);
export default bundleAnalyzer(config);
