"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { analyzeSchema } from "@/lib/validations/analyze";
import { Search, AlertCircle } from "lucide-react";
import { AnalyzingAnimation } from "./AnalyzingAnimation";

export function UrlForm({ credits }: { credits: number }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const parsed = analyzeSchema.safeParse({ url });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid URL");
      return;
    }

    if (credits <= 0) {
      setError("No credits remaining. More credits coming soon!");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = (await res.json()) as { reportId?: string; error?: string };

    if (!res.ok || !data.reportId) {
      setError(data.error ?? "Analysis failed. Please try again.");
      setLoading(false);
      return;
    }

    router.push(`/report/${data.reportId}`);
  };

  if (loading) {
    return <AnalyzingAnimation url={url} />;
  }

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          type="url"
          placeholder="https://example.com/your-blog-post"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 h-12 text-base"
          disabled={loading}
        />
        <Button
          type="submit"
          size="lg"
          className="gap-2 bg-indigo-600 hover:bg-indigo-500 h-12"
          disabled={loading || credits <= 0}
        >
          <Search className="h-4 w-4" />
          Analyze
        </Button>
      </form>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <p className="mt-3 text-sm text-muted-foreground text-center">
        {credits > 0
          ? `${credits} free ${credits === 1 ? "analysis" : "analyses"} remaining`
          : "No credits remaining — more coming soon!"}
      </p>
    </div>
  );
}
