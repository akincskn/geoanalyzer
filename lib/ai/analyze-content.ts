import { callGroq } from "./groq";
import { callGemini } from "./gemini";
import { buildAnalysisPrompt } from "./prompts";
import type { PageData, AiAnalysisResult, Issue } from "@/lib/types/report";

function validateAiResult(parsed: unknown): AiAnalysisResult {
  if (!parsed || typeof parsed !== "object") {
    return getDefaultAiResult();
  }

  const obj = parsed as Record<string, unknown>;

  const clamp = (val: unknown, max: number): number => {
    const n = typeof val === "number" ? val : parseInt(String(val ?? 0), 10);
    return Math.max(0, Math.min(max, isNaN(n) ? 0 : n));
  };

  const cq = (typeof obj.content_quality === "object" && obj.content_quality
    ? obj.content_quality
    : {}) as Record<string, unknown>;
  const aso = (typeof obj.ai_search_optimization === "object" && obj.ai_search_optimization
    ? obj.ai_search_optimization
    : {}) as Record<string, unknown>;

  const value = clamp(cq.value, 5);
  const clarity = clamp(cq.clarity, 4);
  const flow = clamp(cq.flow, 3);
  const qa_format = clamp(cq.qa_format, 4);
  const originality = clamp(cq.originality, 4);
  const cqScore = value + clarity + flow + qa_format + originality;

  const snippable = clamp(aso.snippable, 5);
  const faq_structure = clamp(aso.faq_structure, 4);
  const definitions = clamp(aso.definitions, 4);
  const list_format = clamp(aso.list_format, 4);
  const topic_focus = clamp(aso.topic_focus, 3);
  const asoScore = snippable + faq_structure + definitions + list_format + topic_focus;

  const rawRecs = Array.isArray(obj.recommendations) ? obj.recommendations : [];
  const recommendations: Issue[] = rawRecs
    .slice(0, 8)
    .map((r: unknown) => {
      if (!r || typeof r !== "object") return null;
      const rec = r as Record<string, unknown>;
      const severity = ["critical", "warning", "info"].includes(String(rec.severity))
        ? (rec.severity as "critical" | "warning" | "info")
        : "info";
      return {
        category: String(rec.category ?? "general"),
        severity,
        issue: String(rec.issue ?? ""),
        suggestion: String(rec.suggestion ?? ""),
      };
    })
    .filter((r): r is Issue => r !== null && Boolean(r.issue) && Boolean(r.suggestion));

  return {
    content_quality: { score: cqScore, value, clarity, flow, qa_format, originality },
    ai_search_optimization: {
      score: asoScore,
      snippable,
      faq_structure,
      definitions,
      list_format,
      topic_focus,
    },
    recommendations,
  };
}

function getDefaultAiResult(): AiAnalysisResult {
  return {
    content_quality: { score: 10, value: 2, clarity: 2, flow: 2, qa_format: 2, originality: 2 },
    ai_search_optimization: { score: 10, snippable: 2, faq_structure: 2, definitions: 2, list_format: 2, topic_focus: 2 },
    recommendations: [],
  };
}

function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function analyzeContent(pageData: PageData): Promise<AiAnalysisResult> {
  const prompt = buildAnalysisPrompt(pageData);

  let rawResult: string | null = null;

  try {
    rawResult = await callGroq(prompt);
  } catch {
    // Groq failed, try Gemini
  }

  if (!rawResult) {
    try {
      rawResult = await callGemini(prompt);
    } catch {
      // Both failed, return defaults
      return getDefaultAiResult();
    }
  }

  const parsed = parseJson(rawResult);
  if (!parsed) {
    // Try Gemini as fallback if Groq returned invalid JSON
    try {
      const geminiRaw = await callGemini(prompt);
      const geminiParsed = parseJson(geminiRaw);
      return validateAiResult(geminiParsed);
    } catch {
      return getDefaultAiResult();
    }
  }

  return validateAiResult(parsed);
}
