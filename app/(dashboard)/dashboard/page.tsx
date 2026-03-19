import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getGradeColor } from "@/lib/scoring/generate-grade";
import { ExternalLink, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [reports, user] = await Promise.all([
    prisma.geoReport.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        url: true,
        domain: true,
        overallScore: true,
        grade: true,
        createdAt: true,
      },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    }),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Analysis History</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {user?.credits ?? 0} credit{user?.credits !== 1 ? "s" : ""}{" "}
            remaining
          </p>
        </div>
        <Button
          render={<Link href="/analyze" />}
          nativeButton={false}
          className="gap-2 bg-indigo-600 hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" />
          New Analysis
        </Button>
      </div>

      {reports.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/60 p-16 text-center">
          <p className="text-muted-foreground mb-4">No analyses yet.</p>
          <Button render={<Link href="/analyze" />} nativeButton={false} variant="outline">
            Analyze your first URL
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report: { id: string; grade: string; domain: string; url: string; overallScore: number; createdAt: Date }) => (
            <Link
              key={report.id}
              href={`/report/${report.id}`}
              className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4 hover:border-indigo-500/40 transition-colors"
            >
              <div
                className={`text-2xl font-bold font-mono w-12 text-center ${getGradeColor(report.grade)}`}
              >
                {report.grade}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{report.domain}</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {report.url}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-bold">{report.overallScore}/100</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(report.createdAt).toLocaleDateString()}
                </div>
              </div>
              <Badge variant="outline" className="hidden sm:flex">
                View
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
