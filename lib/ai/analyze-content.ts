import { callGroq } from "./groq";
import { callGemini } from "./gemini";
import { buildAnalysisPrompt } from "./prompts";
import type { PageData, AiAnalysisResult, Issue } from "@/lib/types/report";

function validateAiResult(parsed: unknown): AiAnalysisResult {
  const obj = parsed as Record<string, unknown>;

  const clamp = (val: unknown, max: number): number => {
    const n = typeof val === "number" ? val : parseInt(String(val ?? 0), 10);
    return Math.max(0, Math.min(max, isNaN(n) ? 0 : n));
  };

  const cq = (obj.content_quality ?? {}) as Record<string, unknown>;
  const aso = (obj.ai_search_optimization ?? {}) as Record<string, unknown>;

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
      const rec = r as Record<string, unknown>;
      return {
        category: String(rec.category ?? "general"),
        severity: (["critical", "warning", "info"].includes(String(rec.severity))
          ? rec.severity
          : "info") as "critical" | "warning" | "info",
        issue: String(rec.issue ?? ""),
        suggestion: String(rec.suggestion ?? ""),
      };
    })
    .filter((r) => r.issue && r.suggestion);

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

export async function analyzeContent(
  pageData: PageData
): Promise<AiAnalysisResult> {
  const prompt = buildAnalysisPrompt(pageData);

  let rawResult: string;

  try {
    rawResult = await callGroq(prompt);
  } catch (groqError) {
    console.warn("Groq failed, falling back to Gemini:", groqError);
    rawResult = await callGemini(prompt);
  }

  const parsed = JSON.parse(rawResult);
  return validateAiResult(parsed);
}
