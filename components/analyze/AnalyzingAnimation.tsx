"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const STEPS = [
  "Fetching page content…",
  "Extracting headings & meta tags…",
  "Parsing schema markup…",
  "Analyzing E-E-A-T signals…",
  "Running AI content analysis…",
  "Calculating GEO score…",
  "Generating recommendations…",
];

export function AnalyzingAnimation({ url }: { url: string }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <Loader2 className="h-10 w-10 animate-spin text-indigo-400" />
      <div className="text-center">
        <p className="font-medium text-lg">{STEPS[step]}</p>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm truncate">
          {url}
        </p>
      </div>
      <div className="flex gap-1.5">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1 w-6 rounded-full transition-all duration-500 ${
              i <= step ? "bg-indigo-500" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
