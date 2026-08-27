import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["pg", "pg-hstore", "sequelize", "bcryptjs"],
  outputFileTracingIncludes: {
    "/api/**": [
      "./node_modules/pg/**",
      "./node_modules/pg-hstore/**",
      "./node_modules/sequelize/**",
      "./node_modules/pg-connection-string/**",
      "./node_modules/pg-int8/**",
      "./node_modules/pg-protocol/**",
      "./node_modules/pg-types/**",
      "./node_modules/pgpass/**",
      "./node_modules/semver/**",
      "./node_modules/wkx/**",
      "./node_modules/retry-as-promised/**",
      "./node_modules/dottie/**",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imgur.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
