import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import type { Issue } from "@/lib/types/report";

const SEVERITY_CONFIG = {
  critical: {
    icon: AlertCircle,
    label: "Critical",
    className: "text-red-400",
    badgeVariant: "destructive" as const,
  },
  warning: {
    icon: AlertTriangle,
    label: "Warning",
    className: "text-yellow-400",
    badgeVariant: "outline" as const,
  },
  info: {
    icon: Info,
    label: "Info",
    className: "text-blue-400",
    badgeVariant: "secondary" as const,
  },
};

interface Props {
  issues: Issue[];
}

export function IssuesList({ issues }: Props) {
  if (issues.length === 0) {
    return (
      <div className="rounded-xl border border-border/60 bg-card p-8 text-center">
        <p className="text-green-500 font-medium">No issues found!</p>
        <p className="text-muted-foreground text-sm mt-1">
          Your page looks great across all analyzed criteria.
        </p>
      </div>
    );
  }

  const sorted = [...issues].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <div className="space-y-3">
      {sorted.map((issue, idx) => {
        const config = SEVERITY_CONFIG[issue.severity];
        const Icon = config.icon;
        return (
          <div
            key={idx}
            className="rounded-xl border border-border/60 bg-card p-4"
          >
            <div className="flex items-start gap-3">
              <Icon className={`h-4 w-4 flex-shrink-0 mt-0.5 ${config.className}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge variant={config.badgeVariant} className="text-xs">
                    {config.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground capitalize">
                    {issue.category.replace(/_/g, " ")}
                  </span>
                </div>
                <p className="text-sm font-medium">{issue.issue}</p>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {issue.suggestion}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
