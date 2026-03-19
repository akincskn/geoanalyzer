import { CheckCircle, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { CategoryScore } from "@/lib/types/report";

interface Props {
  title: string;
  category: CategoryScore;
  icon: React.ReactNode;
}

export function CategoryCard({ title, category, icon }: Props) {
  const percentage = Math.round((category.score / category.maxScore) * 100);

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="text-indigo-400">{icon}</div>
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>
        <div className="text-right">
          <span className="font-bold">{category.score}</span>
          <span className="text-muted-foreground text-sm">/{category.maxScore}</span>
        </div>
      </div>

      <Progress value={percentage} className="h-1.5 mb-4" />

      <div className="space-y-2">
        {category.checks.map((check) => (
          <div key={check.label} className="flex items-start gap-2">
            {check.passed ? (
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium">{check.label}</span>
                <span className="text-xs text-muted-foreground">
                  ({check.score}/{check.maxScore})
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {check.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
