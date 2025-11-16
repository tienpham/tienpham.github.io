import IconBrandX from "@/assets/icons/IconBrandX.svg";
import IconFacebook from "@/assets/icons/IconFacebook.svg";
import IconGitHub from "@/assets/icons/IconGitHub.svg";
import IconLinkedin from "@/assets/icons/IconLinkedin.svg";
import IconMail from "@/assets/icons/IconMail.svg";
import IconPinterest from "@/assets/icons/IconPinterest.svg";
import IconTelegram from "@/assets/icons/IconTelegram.svg";
import IconWhatsapp from "@/assets/icons/IconWhatsapp.svg";
import { SITE } from "@/config";
import type { Props } from "astro";

interface Social {
  name: string;
  href: string;
  linkTitle: string;
  icon: (_props: Props) => Element;
}

export const SOCIALS: Social[] = [
  {
    name: "GitHub",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on GitHub`,
    icon: IconGitHub,
  },
  {
    name: "X",
    href: "https://x.com/username",
    linkTitle: `${SITE.title} on X`,
    icon: IconBrandX,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/username/",
    linkTitle: `${SITE.title} on LinkedIn`,
    icon: IconLinkedin,
  },
  {
    name: "Mail",
    href: "mailto:yourmail@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    icon: IconMail,
  },
] as const;

export const SHARE_LINKS: Social[] = [
  {
    name: "WhatsApp",
    href: "https://wa.me/?text=",
    linkTitle: `Share this post via WhatsApp`,
    icon: IconWhatsapp,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/sharer.php?u=",
    linkTitle: `Share this post on Facebook`,
    icon: IconFacebook,
  },
  {
    name: "X",
    href: "https://x.com/intent/post?url=",
    linkTitle: `Share this post on X`,
    icon: IconBrandX,
  },
  {
    name: "Telegram",
    href: "https://t.me/share/url?url=",
    linkTitle: `Share this post via Telegram`,
    icon: IconTelegram,
  },
  {
    name: "Pinterest",
    href: "https://pinterest.com/pin/create/button/?url=",
    linkTitle: `Share this post on Pinterest`,
    icon: IconPinterest,
  },
  {
    name: "Mail",
    href: "mailto:?subject=See%20this%20post&body=",
    linkTitle: `Share this post via email`,
    icon: IconMail,
  },
] as const;

export interface GiscusProps {
  repo: `${string}/${string}`;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: "url" | "title" | "og:title" | "specific" | "number" | "pathname";
  reactionsEnabled: "0" | "1";
  emitMetadata: "0" | "1";
  inputPosition: "top" | "bottom";
  lang: string;
  loading: "lazy" | "eager";
}

export const GISCUS: GiscusProps = {
  repo: "tienpham/tienpham.github.io",
  repoId: "MDEwOlJlcG9zaXRvcnkxMjAxNDY5NjE=", // Get this from https://giscus.app/
  category: "General", // Discussion category name
  categoryId: "DIC_kwDOBylMEc4Cx25R", // Get this from https://giscus.app/
  mapping: "pathname",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "bottom",
  lang: "en",
  loading: "lazy",
};
