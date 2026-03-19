import type { CheerioAPI } from "cheerio";

export function extractLinks(
  $: CheerioAPI,
  pageUrl: string
): { internalLinks: number; externalLinks: number } {
  let internalLinks = 0;
  let externalLinks = 0;

  let origin = "";
  try {
    origin = new URL(pageUrl).origin;
  } catch {
    origin = "";
  }

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") ?? "";
    if (!href || href.startsWith("#") || href.startsWith("mailto:")) return;

    if (href.startsWith("http://") || href.startsWith("https://")) {
      if (origin && href.startsWith(origin)) {
        internalLinks++;
      } else {
        externalLinks++;
      }
    } else if (href.startsWith("/")) {
      internalLinks++;
    }
  });

  return { internalLinks, externalLinks };
}
