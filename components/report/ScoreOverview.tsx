import { Progress } from "@/components/ui/progress";
import { getGradeColor, getScoreColor } from "@/lib/scoring/generate-grade";

interface Props {
  score: number;
  grade: string;
  domain: string;
  url: string;
  analyzedAt: string;
}

export function ScoreOverview({ score, grade, domain, url, analyzedAt }: Props) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{domain}</p>
          <p className="text-xs text-muted-foreground/60 truncate max-w-xs">{url}</p>
          <p className="text-xs text-muted-foreground/40 mt-1">
            Analyzed {new Date(analyzedAt).toLocaleString()}
          </p>
        </div>

        <div className="flex items-end gap-6">
          <div className="text-center">
            <div className={`text-6xl font-bold font-mono ${getGradeColor(grade)}`}>
              {grade}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Grade</div>
          </div>
          <div className="text-center">
            <div className={`text-5xl font-bold ${getScoreColor(score)}`}>
              {score}
            </div>
            <div className="text-xs text-muted-foreground mt-1">/ 100</div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Progress
          value={score}
          className="h-3"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0</span>
          <span className="font-medium">
            {score >= 80
              ? "Excellent GEO visibility"
              : score >= 60
              ? "Good — room to improve"
              : score >= 40
              ? "Needs work"
              : "Poor AI visibility"}
          </span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
}
