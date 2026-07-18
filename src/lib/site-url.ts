const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl = (
  process.env.SITE_URL
  ?? (vercelProductionUrl ? `https://${vercelProductionUrl}` : process.env.NEXT_PUBLIC_SITE_URL)
  ?? "http://localhost:3000"
).replace(/\/$/, "");
