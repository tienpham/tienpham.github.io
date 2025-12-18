import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";

/**
 * Rehype plugin to add trailing slashes to internal links.
 * This ensures consistency with Astro's trailingSlash: "always" config.
 */
export default function rehypeTrailingSlash() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName === "a" && node.properties?.href) {
        const href = String(node.properties.href);

        // Only process internal links (starting with /)
        // Skip anchors, external links, and links that already have trailing slash
        if (
          href.startsWith("/") &&
          !href.startsWith("//") &&
          !href.includes("#") &&
          !href.endsWith("/") &&
          !href.match(/\.[a-zA-Z0-9]+$/) // Skip file extensions like .pdf, .xml
        ) {
          node.properties.href = href + "/";
        }
      }
    });
  };
}
