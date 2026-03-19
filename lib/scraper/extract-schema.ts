import type { CheerioAPI } from "cheerio";
import type { SchemaInfo } from "@/lib/types/report";

export function extractSchemas($: CheerioAPI): {
  schemas: SchemaInfo[];
  hasSchemaMarkup: boolean;
} {
  const schemas: SchemaInfo[] = [];

  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const content = $(el).html();
      if (!content) return;
      const parsed = JSON.parse(content) as Record<string, unknown>;
      const type =
        (parsed["@type"] as string) ||
        (parsed["@graph"] ? "Graph" : "Unknown");
      schemas.push({ type, raw: parsed });
    } catch {
      // Invalid JSON-LD — skip silently
    }
  });

  return { schemas, hasSchemaMarkup: schemas.length > 0 };
}
