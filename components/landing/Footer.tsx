export function Footer() {
  return (
    <footer className="border-t border-border/60 px-4 py-8">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <span className="text-indigo-400">◆</span>
          GEO Analyzer
        </div>
        <p>
          Helping content creators get found by AI search engines.
        </p>
        <p>© {new Date().getFullYear()} GEO Analyzer. Free to use.</p>
      </div>
    </footer>
  );
}
