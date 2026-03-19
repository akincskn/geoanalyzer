import type {
  PageData,
  CategoryScore,
  CheckResult,
  Issue,
  ReportData,
  AiAnalysisResult,
} from "@/lib/types/report";
import {
  hasQuestionBasedHeadings,
  hasProperHierarchy,
} from "@/lib/scraper/extract-headings";
import { generateGrade } from "./generate-grade";

function check(
  label: string,
  passed: boolean,
  score: number,
  maxScore: number,
  detail: string
): CheckResult {
  return { label, passed, score: passed ? score : 0, maxScore, detail };
}

export function scoreContentStructure(data: PageData): CategoryScore {
  const checks: CheckResult[] = [
    check(
      "Single H1 tag",
      data.h1Count === 1,
      5,
      5,
      data.h1Count === 0
        ? "No H1 found"
        : data.h1Count > 1
        ? `Found ${data.h1Count} H1 tags`
        : "Correct — 1 H1 found"
    ),
    check(
      "Question-based H2 headings",
      hasQuestionBasedHeadings(data.headings),
      5,
      5,
      data.h2Count === 0
        ? "No H2 headings found"
        : "At least 30% of H2s should start with question words"
    ),
    check(
      "Proper heading hierarchy",
      hasProperHierarchy(data.headings),
      3,
      3,
      "H1 → H2 → H3 order without skipping levels"
    ),
    check(
      "Internal links present",
      data.internalLinks >= 3,
      4,
      4,
      `Found ${data.internalLinks} internal links (min 3 recommended)`
    ),
    check(
      "Sufficient content length",
      data.wordCount >= 300,
      3,
      3,
      `${data.wordCount} words (min 300 recommended)`
    ),
  ];

  const score = checks.reduce((sum, c) => sum + c.score, 0);
  return { score, maxScore: 20, checks };
}

export function scoreEeat(data: PageData): CategoryScore {
  const checks: CheckResult[] = [
    check(
      "Author information",
      data.hasAuthor,
      5,
      5,
      "Author name, bio, or credentials detected"
    ),
    check(
      "Publication/update date",
      data.hasDate,
      3,
      3,
      "Date metadata or visible date detected"
    ),
    check(
      "External references/citations",
      data.externalReferences >= 2,
      4,
      4,
      `Found ${data.externalReferences} external links (min 2 recommended)`
    ),
    check(
      "Statistics or data usage",
      data.hasStatistics,
      4,
      4,
      "Numerical data, percentages, or research stats detected"
    ),
    check(
      "HTTPS & contact info",
      data.isHttps && data.hasContactInfo,
      4,
      4,
      `HTTPS: ${data.isHttps}, Contact info: ${data.hasContactInfo}`
    ),
  ];

  const score = checks.reduce((sum, c) => sum + c.score, 0);
  return { score, maxScore: 20, checks };
}

export function scoreTechnical(data: PageData): CategoryScore {
  const titleLength = data.title.length;
  const descLength = data.metaDescription.length;

  const checks: CheckResult[] = [
    check(
      "Meta title",
      titleLength >= 30 && titleLength <= 70,
      3,
      3,
      `Title: "${data.title.slice(0, 60)}${data.title.length > 60 ? "…" : ""}" (${titleLength} chars, ideal 30-70)`
    ),
    check(
      "Meta description",
      descLength >= 50 && descLength <= 165,
      3,
      3,
      `${descLength} chars (ideal 50-165)`
    ),
    check(
      "Schema markup (JSON-LD)",
      data.hasSchemaMarkup,
      5,
      5,
      data.hasSchemaMarkup
        ? `Found: ${data.schemas.map((s) => s.type).join(", ")}`
        : "No JSON-LD schema detected"
    ),
    check(
      "Open Graph tags",
      Boolean(data.ogTitle && data.ogDescription && data.ogImage),
      3,
      3,
      `og:title: ${Boolean(data.ogTitle)}, og:description: ${Boolean(data.ogDescription)}, og:image: ${Boolean(data.ogImage)}`
    ),
    check(
      "Canonical URL",
      Boolean(data.canonicalUrl),
      2,
      2,
      data.canonicalUrl ? `Found: ${data.canonicalUrl}` : "No canonical URL found"
    ),
    check(
      "AI crawlers not blocked",
      !data.robotsMeta.toLowerCase().includes("noai") &&
        !data.robotsMeta.toLowerCase().includes("noimageai"),
      2,
      2,
      data.robotsMeta ? `robots meta: "${data.robotsMeta}"` : "No robots meta found"
    ),
    check(
      "Server-rendered content",
      data.isServerRendered,
      2,
      2,
      "Page has meaningful HTML content (not fully client-side rendered)"
    ),
  ];

  const score = checks.reduce((sum, c) => sum + c.score, 0);
  return { score, maxScore: 20, checks };
}

export function buildReport(
  data: PageData,
  aiResult: AiAnalysisResult
): ReportData {
  const contentStructure = scoreContentStructure(data);
  const eeatSignals = scoreEeat(data);
  const technicalReadiness = scoreTechnical(data);

  const contentQuality: CategoryScore = {
    score: aiResult.content_quality.score,
    maxScore: 20,
    checks: [
      {
        label: "Value & usefulness",
        passed: aiResult.content_quality.value >= 3,
        score: aiResult.content_quality.value,
        maxScore: 5,
        detail: "AI evaluation of genuine value provided",
      },
      {
        label: "Clarity & readability",
        passed: aiResult.content_quality.clarity >= 2,
        score: aiResult.content_quality.clarity,
        maxScore: 4,
        detail: "AI evaluation of jargon level and clarity",
      },
      {
        label: "Logical flow & transitions",
        passed: aiResult.content_quality.flow >= 2,
        score: aiResult.content_quality.flow,
        maxScore: 3,
        detail: "AI evaluation of paragraph structure and flow",
      },
      {
        label: "Question-answer format",
        passed: aiResult.content_quality.qa_format >= 2,
        score: aiResult.content_quality.qa_format,
        maxScore: 4,
        detail: "AI evaluation of Q&A format usage",
      },
      {
        label: "Originality & expertise",
        passed: aiResult.content_quality.originality >= 2,
        score: aiResult.content_quality.originality,
        maxScore: 4,
        detail: "AI evaluation of expertise vs. generic content",
      },
    ],
  };

  const aiSearchOptimization: CategoryScore = {
    score: aiResult.ai_search_optimization.score,
    maxScore: 20,
    checks: [
      {
        label: "Snippable content",
        passed: aiResult.ai_search_optimization.snippable >= 3,
        score: aiResult.ai_search_optimization.snippable,
        maxScore: 5,
        detail: "Short, citable sentences AI engines can quote",
      },
      {
        label: "FAQ structure",
        passed: aiResult.ai_search_optimization.faq_structure >= 2,
        score: aiResult.ai_search_optimization.faq_structure,
        maxScore: 4,
        detail: "Explicit question-answer blocks",
      },
      {
        label: "Clear definitions",
        passed: aiResult.ai_search_optimization.definitions >= 2,
        score: aiResult.ai_search_optimization.definitions,
        maxScore: 4,
        detail: '"X is..." style definition sentences',
      },
      {
        label: "Lists & step-by-step format",
        passed: aiResult.ai_search_optimization.list_format >= 2,
        score: aiResult.ai_search_optimization.list_format,
        maxScore: 4,
        detail: "Numbered lists, how-to steps, bullet points",
      },
      {
        label: "Topic focus",
        passed: aiResult.ai_search_optimization.topic_focus >= 2,
        score: aiResult.ai_search_optimization.topic_focus,
        maxScore: 3,
        detail: "Page focused on a single clear topic",
      },
    ],
  };

  // Collect all failed checks as issues
  const autoIssues: Issue[] = [];

  const allCategories = [
    { cat: "content_structure", data: contentStructure },
    { cat: "eeat", data: eeatSignals },
    { cat: "technical", data: technicalReadiness },
  ];

  for (const { cat, data: catData } of allCategories) {
    for (const c of catData.checks) {
      if (!c.passed) {
        autoIssues.push({
          category: cat,
          severity: c.maxScore >= 4 ? "critical" : "warning",
          issue: `${c.label}: ${c.detail}`,
          suggestion: getSuggestion(c.label),
        });
      }
    }
  }

  const allIssues = [...autoIssues, ...aiResult.recommendations];
  const overallScore =
    contentStructure.score +
    eeatSignals.score +
    technicalReadiness.score +
    contentQuality.score +
    aiSearchOptimization.score;

  let domain = "";
  try {
    domain = new URL(data.url).hostname;
  } catch {
    domain = data.url;
  }

  return {
    url: data.url,
    domain,
    overallScore,
    grade: generateGrade(overallScore),
    contentStructure,
    eeatSignals,
    technicalReadiness,
    contentQuality,
    aiSearchOptimization,
    issues: allIssues,
    recommendations: aiResult.recommendations,
  };
}

function getSuggestion(label: string): string {
  const suggestions: Record<string, string> = {
    "Single H1 tag": "Ensure every page has exactly one H1 tag that clearly describes the main topic.",
    "Question-based H2 headings": "Rewrite H2 headings to start with question words (What, How, Why, When) to match AI search query patterns.",
    "Proper heading hierarchy": "Fix heading order — never skip levels (e.g., H1 directly to H3). Keep H1 → H2 → H3 flow.",
    "Internal links present": "Add at least 3-5 internal links to related pages to help AI understand your site structure.",
    "Sufficient content length": "Expand your content to at least 300 words. Longer, detailed content performs better in AI search.",
    "Author information": "Add author name, bio, and credentials. AI search engines weight E-E-A-T signals heavily.",
    "Publication/update date": "Add a visible publication date and keep it updated. Shows content freshness.",
    "External references/citations": "Link to authoritative external sources to boost credibility and E-E-A-T signals.",
    "Statistics or data usage": "Include specific statistics, research data, or percentages to support your claims.",
    "HTTPS & contact info": "Ensure your site uses HTTPS and has a visible contact page or email address.",
    "Meta title": "Write a meta title between 30-70 characters that includes your primary keyword.",
    "Meta description": "Write a meta description between 50-165 characters that summarizes the page value.",
    "Schema markup (JSON-LD)": "Add JSON-LD schema markup (Article, FAQ, HowTo) to help AI engines understand your content.",
    "Open Graph tags": "Add og:title, og:description, and og:image tags for rich social/AI previews.",
    "Canonical URL": "Add a canonical URL tag to prevent duplicate content issues.",
    "AI crawlers not blocked": "Remove noai/noimageai directives from robots meta if you want AI indexing.",
    "Server-rendered content": "Ensure critical content is server-rendered (SSR/SSG) so AI crawlers can read it.",
  };
  return suggestions[label] ?? "Review and improve this aspect of your page.";
}
