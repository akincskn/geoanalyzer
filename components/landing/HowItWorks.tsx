const STEPS = [
  {
    number: "01",
    title: "Enter any URL",
    description:
      "Paste any public webpage URL — blog posts, landing pages, product pages, or documentation.",
  },
  {
    number: "02",
    title: "We scrape & analyze",
    description:
      "Our system fetches the page, extracts all signals, and runs AI analysis across 5 categories in ~15 seconds.",
  },
  {
    number: "03",
    title: "Get your GEO score",
    description:
      "Receive a 0-100 score with letter grade, category breakdown, and a prioritized list of improvements.",
  },
  {
    number: "04",
    title: "Take action",
    description:
      "Each issue comes with a specific, actionable suggestion so you know exactly what to fix and why.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-24 bg-muted/30">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl">How It Works</h2>
          <p className="mt-4 text-muted-foreground">
            From URL to actionable insights in under a minute.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {STEPS.map((step) => (
            <div key={step.number} className="flex gap-5">
              <div className="flex-shrink-0 text-3xl font-bold text-indigo-500/40 font-mono">
                {step.number}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
