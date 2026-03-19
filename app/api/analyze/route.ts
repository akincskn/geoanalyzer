import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { analyzeSchema } from "@/lib/validations/analyze";
import { fetchPage } from "@/lib/scraper/fetch-page";
import { extractHeadings } from "@/lib/scraper/extract-headings";
import { extractMeta } from "@/lib/scraper/extract-meta";
import { extractSchemas } from "@/lib/scraper/extract-schema";
import { extractLinks } from "@/lib/scraper/extract-links";
import { extractContent } from "@/lib/scraper/extract-content";
import { extractEeat } from "@/lib/scraper/extract-eeat";
import { analyzeContent } from "@/lib/ai/analyze-content";
import { buildReport } from "@/lib/scoring/calculate-scores";
import type { PageData } from "@/lib/types/report";

// Prevent long cold starts from timing out Vercel
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: unknown = await req.json();
    const parsed = analyzeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { url } = parsed.data;

    // Check credits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });

    if (!user || user.credits <= 0) {
      return NextResponse.json(
        { error: "No credits remaining. More credits coming soon!" },
        { status: 402 }
      );
    }

    // Fetch and parse the page
    const { $, html, isHttps, finalUrl } = await fetchPage(url);

    const { headings, h1Count, h2Count, h3Count } = extractHeadings($);
    const meta = extractMeta($, html);
    const { schemas, hasSchemaMarkup } = extractSchemas($);
    const { internalLinks, externalLinks } = extractLinks($, finalUrl);
    const { extractedText, wordCount } = extractContent($);
    const { hasAuthor, hasDate, hasContactInfo, externalReferences, hasStatistics } =
      extractEeat($);

    const pageData: PageData = {
      url: finalUrl,
      title: meta.title,
      metaDescription: meta.metaDescription,
      ogTitle: meta.ogTitle,
      ogDescription: meta.ogDescription,
      ogImage: meta.ogImage,
      canonicalUrl: meta.canonicalUrl,
      robotsMeta: meta.robotsMeta,
      isHttps,
      headings,
      h1Count,
      h2Count,
      h3Count,
      wordCount,
      internalLinks,
      externalLinks,
      hasAuthor,
      hasDate,
      hasContactInfo,
      externalReferences,
      hasStatistics,
      schemas,
      hasSchemaMarkup,
      extractedText,
      isServerRendered: meta.isServerRendered,
    };

    // AI analysis
    const aiResult = await analyzeContent(pageData);

    // Build full report
    const report = buildReport(pageData, aiResult);

    // Deduct credit & save report in a transaction
    const [savedReport] = await prisma.$transaction([
      prisma.geoReport.create({
        data: {
          userId: session.user.id,
          url: report.url,
          domain: report.domain,
          overallScore: report.overallScore,
          grade: report.grade,
          contentStructure: report.contentStructure as object,
          eeatSignals: report.eeatSignals as object,
          technicalReadiness: report.technicalReadiness as object,
          contentQuality: report.contentQuality as object,
          aiSearchOptimization: report.aiSearchOptimization as object,
          issues: report.issues as object,
          recommendations: report.recommendations as object,
        },
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: { credits: { decrement: 1 } },
      }),
    ]);

    return NextResponse.json({ reportId: savedReport.id });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Analysis failed";
    console.error("[analyze]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
