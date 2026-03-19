export interface HeadingInfo {
  tag: string;
  text: string;
}

export interface SchemaInfo {
  type: string;
  raw: Record<string, unknown>;
}

export interface PageData {
  url: string;
  title: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  robotsMeta: string;
  isHttps: boolean;
  headings: HeadingInfo[];
  h1Count: number;
  h2Count: number;
  h3Count: number;
  wordCount: number;
  internalLinks: number;
  externalLinks: number;
  hasAuthor: boolean;
  hasDate: boolean;
  hasContactInfo: boolean;
  externalReferences: number;
  hasStatistics: boolean;
  schemas: SchemaInfo[];
  hasSchemaMarkup: boolean;
  extractedText: string;
  isServerRendered: boolean;
}

export interface CategoryScore {
  score: number;
  maxScore: number;
  checks: CheckResult[];
}

export interface CheckResult {
  label: string;
  passed: boolean;
  score: number;
  maxScore: number;
  detail: string;
}

export interface Issue {
  category: string;
  severity: "critical" | "warning" | "info";
  issue: string;
  suggestion: string;
}

export interface ReportData {
  url: string;
  domain: string;
  overallScore: number;
  grade: string;
  contentStructure: CategoryScore;
  eeatSignals: CategoryScore;
  technicalReadiness: CategoryScore;
  contentQuality: CategoryScore;
  aiSearchOptimization: CategoryScore;
  issues: Issue[];
  recommendations: Issue[];
}

export interface AiAnalysisResult {
  content_quality: {
    score: number;
    value: number;
    clarity: number;
    flow: number;
    qa_format: number;
    originality: number;
  };
  ai_search_optimization: {
    score: number;
    snippable: number;
    faq_structure: number;
    definitions: number;
    list_format: number;
    topic_focus: number;
  };
  recommendations: Issue[];
}
