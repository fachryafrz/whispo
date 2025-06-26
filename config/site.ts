export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Whispo",
  description:
    "A fast, secure, and intuitive real-time chat application designed to enhance communication. With seamless authentication, real-time messaging, and an elegant UI, Whispo ensures a smooth chat experience for users.",
  url:
    process.env.NODE_ENV === "production"
      ? "https://whispo.fachryafrz.com"
      : "http://192.168.100.92:3000",
};
