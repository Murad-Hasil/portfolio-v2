import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://murad-hasil-portfolio-v2-xi.vercel.app";

const projectSlugs = [
  "crm-digital-fte",
  "todo-cloud-ai",
  "personal-ai-employee",
  "physical-ai-textbook",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const projectUrls = projectSlugs.map((slug) => ({
    url: `${siteUrl}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...projectUrls,
  ];
}
