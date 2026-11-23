import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://thecasinova.com/",
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
