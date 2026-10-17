import type { NextConfig } from "next";

const config: NextConfig = {
  turbopack: { root: process.cwd() },
  serverExternalPackages: ["@mikro-orm/core", "@mikro-orm/postgresql", "@mikro-orm/migrations"],
};

export default config;
