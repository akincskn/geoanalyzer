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
import type { Prisma } from "@prisma/client";

// Safe cast for serializable objects to Prisma JSON fields
function toJson<T>(value: T): Prisma.InputJsonValue {
  return value as unknown as Prisma.InputJsonValue;
}

// Prevent long cold starts from timing out Vercel
export const maxDuration = 60;

const INSUFFICIENT_CREDITS = "INSUFFICIENT_CREDITS";

export async function POST(req: NextRequest): Promise<NextResponse> {
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

    // Atomically check credits > 0, decrement, and save report in one transaction
    const savedReport = await prisma.$transaction(async (tx) => {
      const updated = await tx.user.updateMany({
        where: { id: session.user.id, credits: { gt: 0 } },
        data: { credits: { decrement: 1 } },
      });

      if (updated.count === 0) {
        throw new Error(INSUFFICIENT_CREDITS);
      }

      return tx.geoReport.create({
        data: {
          userId: session.user.id,
          url: report.url,
          domain: report.domain,
          overallScore: report.overallScore,
          grade: report.grade,
          contentStructure: toJson(report.contentStructure),
          eeatSignals: toJson(report.eeatSignals),
          technicalReadiness: toJson(report.technicalReadiness),
          contentQuality: toJson(report.contentQuality),
          aiSearchOptimization: toJson(report.aiSearchOptimization),
          issues: toJson(report.issues),
          recommendations: toJson(report.recommendations),
        },
      });
    });

    return NextResponse.json({ reportId: savedReport.id });
  } catch (error) {
    console.error("[analyze]", error);

    if (error instanceof Error && error.message === INSUFFICIENT_CREDITS) {
      return NextResponse.json(
        { error: "No credits remaining. More credits coming soon!" },
        { status: 402 }
      );
    }

    if (error instanceof Error && error.message.startsWith("HTTP ")) {
      return NextResponse.json(
        { error: `Could not fetch the page: ${error.message}` },
        { status: 422 }
      );
    }

    if (error instanceof Error && error.message.includes("aborted")) {
      return NextResponse.json(
        { error: "The page took too long to respond. Please try again." },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
