import type { CheerioAPI } from "cheerio";
import type { HeadingInfo } from "@/lib/types/report";

export function extractHeadings(
  $: CheerioAPI
): {
  headings: HeadingInfo[];
  h1Count: number;
  h2Count: number;
  h3Count: number;
} {
  const headings: HeadingInfo[] = [];

  $("h1, h2, h3, h4, h5, h6").each((_, el) => {
    const tag = (el as { tagName: string }).tagName.toLowerCase();
    const text = $(el).text().trim();
    if (text) {
      headings.push({ tag, text });
    }
  });

  const h1Count = headings.filter((h) => h.tag === "h1").length;
  const h2Count = headings.filter((h) => h.tag === "h2").length;
  const h3Count = headings.filter((h) => h.tag === "h3").length;

  return { headings, h1Count, h2Count, h3Count };
}

export function hasQuestionBasedHeadings(headings: HeadingInfo[]): boolean {
  const questionPatterns = /^(what|how|why|when|where|who|which|can|does|is|are|will|should)/i;
  const h2Headings = headings.filter((h) => h.tag === "h2");
  if (h2Headings.length === 0) return false;
  const questionHeadings = h2Headings.filter((h) => questionPatterns.test(h.text));
  return questionHeadings.length / h2Headings.length >= 0.3;
}

export function hasProperHierarchy(headings: HeadingInfo[]): boolean {
  const relevantHeadings = headings.filter((h) =>
    ["h1", "h2", "h3"].includes(h.tag)
  );
  if (relevantHeadings.length < 2) return true;

  const levelOrder = { h1: 1, h2: 2, h3: 3 };
  let prevLevel = 0;

  for (const heading of relevantHeadings) {
    const currentLevel = levelOrder[heading.tag as keyof typeof levelOrder] ?? 0;
    if (currentLevel - prevLevel > 1 && prevLevel !== 0) {
      return false;
    }
    prevLevel = currentLevel;
  }
  return true;
}
