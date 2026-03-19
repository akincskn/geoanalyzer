import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScoreOverview } from "@/components/report/ScoreOverview";
import { CategoryCard } from "@/components/report/CategoryCard";
import { IssuesList } from "@/components/report/IssuesList";
import { ScoreRadar } from "@/components/report/ScoreRadar";
import type { CategoryScore, Issue } from "@/lib/types/report";
import {
  FileText,
  Shield,
  Code2,
  Brain,
  Search,
  ArrowLeft,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [session, { id }] = await Promise.all([auth(), params]);
  if (!session?.user?.id) return null;

  const report = await prisma.geoReport.findUnique({ where: { id } });

  if (!report || report.userId !== session.user.id) {
    notFound();
  }

  const contentStructure = report.contentStructure as unknown as CategoryScore;
  const eeatSignals = report.eeatSignals as unknown as CategoryScore;
  const technicalReadiness = report.technicalReadiness as unknown as CategoryScore;
  const contentQuality = report.contentQuality as unknown as CategoryScore;
  const aiSearchOptimization =
    report.aiSearchOptimization as unknown as CategoryScore;
  const issues = report.issues as unknown as Issue[];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/dashboard" />}
          nativeButton={false}
          className="gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          History
        </Button>
      </div>

      <div className="space-y-6">
        <ScoreOverview
          score={report.overallScore}
          grade={report.grade}
          domain={report.domain}
          url={report.url}
          analyzedAt={report.createdAt.toISOString()}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="categories">
              <TabsList className="mb-4">
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="issues">
                  Issues ({issues.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="categories" className="space-y-4">
                <CategoryCard
                  title="Content Structure"
                  category={contentStructure}
                  icon={<FileText className="h-4 w-4" />}
                />
                <CategoryCard
                  title="E-E-A-T Signals"
                  category={eeatSignals}
                  icon={<Shield className="h-4 w-4" />}
                />
                <CategoryCard
                  title="Technical AI Readiness"
                  category={technicalReadiness}
                  icon={<Code2 className="h-4 w-4" />}
                />
                <CategoryCard
                  title="Content Quality (AI)"
                  category={contentQuality}
                  icon={<Brain className="h-4 w-4" />}
                />
                <CategoryCard
                  title="AI Search Optimization"
                  category={aiSearchOptimization}
                  icon={<Search className="h-4 w-4" />}
                />
              </TabsContent>

              <TabsContent value="issues">
                <IssuesList issues={issues} />
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <ScoreRadar
              contentStructure={contentStructure}
              eeatSignals={eeatSignals}
              technicalReadiness={technicalReadiness}
              contentQuality={contentQuality}
              aiSearchOptimization={aiSearchOptimization}
            />
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button
            render={<Link href="/analyze" />}
            nativeButton={false}
            className="bg-indigo-600 hover:bg-indigo-500 gap-2"
          >
            <Search className="h-4 w-4" />
            Analyze Another URL
          </Button>
        </div>
      </div>
    </div>
  );
}
