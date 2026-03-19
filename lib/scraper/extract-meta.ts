import type { CheerioAPI } from "cheerio";

export interface MetaData {
  title: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  robotsMeta: string;
  isServerRendered: boolean;
}

export function extractMeta($: CheerioAPI, html: string): MetaData {
  const title = $("title").first().text().trim();
  const metaDescription =
    $('meta[name="description"]').attr("content")?.trim() ?? "";
  const ogTitle =
    $('meta[property="og:title"]').attr("content")?.trim() ?? "";
  const ogDescription =
    $('meta[property="og:description"]').attr("content")?.trim() ?? "";
  const ogImage =
    $('meta[property="og:image"]').attr("content")?.trim() ?? "";
  const canonicalUrl =
    $('link[rel="canonical"]').attr("href")?.trim() ?? "";
  const robotsMeta =
    $('meta[name="robots"]').attr("content")?.trim() ?? "";

  // Detect if the page is server-rendered by checking for non-empty body content
  // Client-side only pages often have a near-empty body in raw HTML
  const bodyText = $("body").text().trim();
  const isServerRendered = bodyText.length > 100;

  // Check for common CSR markers
  const hasCsrMarkers =
    html.includes("__NEXT_DATA__") ||
    html.includes("window.__nuxt__") ||
    html.includes("ng-version");

  return {
    title,
    metaDescription,
    ogTitle,
    ogDescription,
    ogImage,
    canonicalUrl,
    robotsMeta,
    isServerRendered: isServerRendered || hasCsrMarkers,
  };
}
