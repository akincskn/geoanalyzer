import {
  BarChart3,
  Brain,
  CheckCircle,
  FileText,
  Search,
  Shield,
} from "lucide-react";

const FEATURES = [
  {
    icon: FileText,
    title: "Content Structure Analysis",
    description:
      "Checks H1/H2 hierarchy, question-based headings, internal links, and content depth — the foundations AI engines rely on.",
  },
  {
    icon: Shield,
    title: "E-E-A-T Signals",
    description:
      "Evaluates author credentials, publication dates, external citations, and trust signals that boost AI ranking.",
  },
  {
    icon: Search,
    title: "Technical AI Readiness",
    description:
      "Audits schema markup, meta tags, Open Graph, canonical URLs, and whether AI crawlers can access your content.",
  },
  {
    icon: Brain,
    title: "AI-Powered Content Quality",
    description:
      "Uses Llama 3.3 70B to evaluate clarity, originality, logical flow, and genuine expertise shown in your content.",
  },
  {
    icon: CheckCircle,
    title: "AI Search Optimization",
    description:
      "Detects snippable content, FAQ blocks, clear definitions, and list formats that AI engines love to cite.",
  },
  {
    icon: BarChart3,
    title: "Priority Action Plan",
    description:
      "Ranked list of exactly what to fix first — critical issues, warnings, and quick wins with specific suggestions.",
  },
];

export function Features() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl">
            5-Category Analysis, 100-Point Score
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Every analysis covers the five dimensions that matter most for
            visibility in AI-powered search results.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border/60 bg-card p-6 hover:border-indigo-500/40 transition-colors"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                <feature.icon className="h-5 w-5 text-indigo-400" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
