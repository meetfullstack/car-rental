import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 requires custom quality values to be explicitly allowed;
    // CategoryCard requests quality={90}.
    qualities: [75, 90],
  },
};

export default nextConfig;
