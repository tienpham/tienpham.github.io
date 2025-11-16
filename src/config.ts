export const SITE = {
  author: "Reflexify",
  website: "https://reflexify.me/", // replace this with your deployed domain
  profile: "https://reflexify.me/",
  desc: "Reflexify.Me là không gian Thiền đương đại, nơi tri thức (RAG), hành động (Agentic AI) và sự tỉnh thức hội tụ. Những câu chuyện, góc nhìn và thực hành giúp kết nối mindfulness với công nghệ, mở ra cách thấy mới trong kỷ nguyên AI.",
  title: "Reflexify",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/tienpham/tienpham.github.io/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "America/Los_Angeles", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
