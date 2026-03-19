"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

export function Hero() {
  const router = useRouter();

  return (
    <section className="relative flex flex-col items-center text-center px-4 pt-24 pb-20 overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 70%)",
        }}
      />

      <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-400 mb-6">
        <Zap className="h-3.5 w-3.5" />
        Free GEO/AEO Analysis — 3 analyses included
      </div>

      <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
        Is Your Content{" "}
        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Visible to AI
        </span>{" "}
        Search Engines?
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
        Analyze any URL and get a detailed GEO/AEO score with actionable
        recommendations. Find out if ChatGPT, Perplexity, and Google AI
        Overviews can find and cite your content.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Button
          size="lg"
          className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8"
          onClick={() => router.push("/analyze")}
        >
          Analyze Your URL <ArrowRight className="h-4 w-4" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() =>
            document
              .getElementById("how-it-works")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          How it works
        </Button>
      </div>

      <div className="mt-16 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
        {["ChatGPT", "Perplexity", "Google AI Overviews", "Claude"].map(
          (engine) => (
            <span
              key={engine}
              className="flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              {engine}
            </span>
          )
        )}
      </div>
    </section>
  );
}
