import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 requires custom quality values to be explicitly allowed;
    // CategoryCard and car photos request quality={90}/{100}.
    qualities: [75, 90, 100],
  },
};

export default nextConfig;
