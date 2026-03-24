/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://muradhasil.dev",
  generateRobotsTxt: true,
  additionalPaths: async () => {
    const projectSlugs = [
      "crm-digital-fte",
      "todo-cloud-ai",
      "personal-ai-employee",
      "ai-chatbot-demo",
    ];
    return projectSlugs.map((slug) => ({
      loc: `/projects/${slug}`,
      changefreq: "monthly",
      priority: 0.8,
    }));
  },
};
