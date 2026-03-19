import * as cheerio from "cheerio";
import type { CheerioAPI } from "cheerio";

export interface FetchResult {
  $: CheerioAPI;
  html: string;
  isHttps: boolean;
  finalUrl: string;
}

export async function fetchPage(url: string): Promise<FetchResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; GeoAnalyzer/1.0; +https://geo-analyzer.vercel.app)",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const isHttps = url.startsWith("https://");
    const finalUrl = response.url || url;

    return { $, html, isHttps, finalUrl };
  } finally {
    clearTimeout(timeout);
  }
}
