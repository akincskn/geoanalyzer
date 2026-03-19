import type { CheerioAPI } from "cheerio";

const AUTHOR_SELECTORS = [
  '[rel="author"]',
  '[itemprop="author"]',
  ".author",
  ".byline",
  '[class*="author"]',
  '[class*="byline"]',
  'meta[name="author"]',
];

const DATE_SELECTORS = [
  "time[datetime]",
  '[itemprop="datePublished"]',
  '[itemprop="dateModified"]',
  '[class*="date"]',
  '[class*="published"]',
  '[class*="updated"]',
  'meta[property="article:published_time"]',
  'meta[property="article:modified_time"]',
];

const CONTACT_SELECTORS = [
  'a[href^="mailto:"]',
  'a[href*="contact"]',
  '[class*="contact"]',
];

const STAT_PATTERNS =
  /\b(\d+(?:\.\d+)?%|\d{4,}|\$\d+|\d+\s*(?:million|billion|thousand))/i;

export function extractEeat($: CheerioAPI): {
  hasAuthor: boolean;
  hasDate: boolean;
  hasContactInfo: boolean;
  externalReferences: number;
  hasStatistics: boolean;
} {
  const hasAuthor = AUTHOR_SELECTORS.some((sel) => $(sel).length > 0);
  const hasDate = DATE_SELECTORS.some((sel) => $(sel).length > 0);
  const hasContactInfo = CONTACT_SELECTORS.some((sel) => $(sel).length > 0);

  const bodyText = $("body").text();
  const hasStatistics = STAT_PATTERNS.test(bodyText);

  // Count external links in main content area (rough heuristic)
  let externalReferences = 0;
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") ?? "";
    if (href.startsWith("http://") || href.startsWith("https://")) {
      externalReferences++;
    }
  });

  return { hasAuthor, hasDate, hasContactInfo, externalReferences, hasStatistics };
}
