import type { PageData } from "@/lib/types/report";

export function buildAnalysisPrompt(data: PageData): string {
  const headingsList = data.headings
    .slice(0, 30)
    .map((h) => `${h.tag.toUpperCase()}: ${h.text}`)
    .join("\n");

  // Limit extracted text to keep prompt manageable
  const truncatedText = data.extractedText.split(" ").slice(0, 3000).join(" ");

  return `You are a GEO (Generative Engine Optimization) and AEO (Answer Engine Optimization) expert. Analyze the following web page content and provide a structured evaluation.

Page URL: ${data.url}
Page Title: ${data.title}
Word Count: ${data.wordCount}
Has Schema Markup: ${data.hasSchemaMarkup}
Schema Types: ${data.schemas.map((s) => s.type).join(", ") || "none"}
Has Author Info: ${data.hasAuthor}
Has Date: ${data.hasDate}
Internal Links: ${data.internalLinks}
External Links: ${data.externalLinks}
Has Statistics/Data: ${data.hasStatistics}

Page Headings:
${headingsList || "No headings found"}

Page Content (excerpt):
${truncatedText}

Evaluate the content on these criteria and return a JSON response:

{
  "content_quality": {
    "score": <0-20 integer>,
    "value": <0-5 integer>,
    "clarity": <0-4 integer>,
    "flow": <0-3 integer>,
    "qa_format": <0-4 integer>,
    "originality": <0-4 integer>
  },
  "ai_search_optimization": {
    "score": <0-20 integer>,
    "snippable": <0-5 integer>,
    "faq_structure": <0-4 integer>,
    "definitions": <0-4 integer>,
    "list_format": <0-4 integer>,
    "topic_focus": <0-3 integer>
  },
  "recommendations": [
    {
      "category": "<content_structure|eeat|technical|content_quality|ai_optimization>",
      "severity": "<critical|warning|info>",
      "issue": "<brief issue description>",
      "suggestion": "<specific actionable suggestion>"
    }
  ]
}

Scoring guidelines:
- content_quality.value: 0=no value, 3=moderate value, 5=high genuine value
- content_quality.clarity: 0=very jargon-heavy/unclear, 2=moderate, 4=very clear
- content_quality.flow: 0=disjointed, 2=average, 3=excellent flow
- content_quality.qa_format: 0=no Q&A, 2=some Q&A, 4=well-structured Q&A throughout
- content_quality.originality: 0=generic filler, 2=some expertise, 4=deep expertise shown
- ai_search_optimization.snippable: 0=no quotable sentences, 3=some, 5=highly snippable
- ai_search_optimization.faq_structure: 0=no FAQ, 2=informal, 4=explicit FAQ blocks
- ai_search_optimization.definitions: 0=no definitions, 2=some, 4=clear "X is..." definitions
- ai_search_optimization.list_format: 0=no lists, 2=some, 4=excellent list/step usage
- ai_search_optimization.topic_focus: 0=scattered, 2=mostly focused, 3=single clear topic

Provide 3-6 recommendations. Respond ONLY with valid JSON. No markdown, no explanations outside the JSON.`;
}
