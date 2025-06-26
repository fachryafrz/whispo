export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Whispo",
  description:
    "A fast, secure, and intuitive chat application designed to enhance communication.",
  url:
    process.env.NODE_ENV === "production"
      ? "https://whispo.fachryafrz.com"
      : "http://192.168.100.92:3000",
};
