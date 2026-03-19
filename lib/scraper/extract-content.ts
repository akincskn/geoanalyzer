import type { CheerioAPI } from "cheerio";

const MAX_WORDS_FOR_AI = 5000;

export function extractContent($: CheerioAPI): {
  extractedText: string;
  wordCount: number;
} {
  // Remove non-content elements
  $(
    "script, style, nav, footer, header, [role='navigation'], [role='banner'], [aria-hidden='true'], noscript, iframe"
  ).remove();

  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const words = bodyText.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;

  // Truncate for AI processing
  const truncated = words.slice(0, MAX_WORDS_FOR_AI).join(" ");

  return { extractedText: truncated, wordCount };
}
