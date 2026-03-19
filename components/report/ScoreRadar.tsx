"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { CategoryScore } from "@/lib/types/report";

interface Props {
  contentStructure: CategoryScore;
  eeatSignals: CategoryScore;
  technicalReadiness: CategoryScore;
  contentQuality: CategoryScore;
  aiSearchOptimization: CategoryScore;
}

export function ScoreRadar({
  contentStructure,
  eeatSignals,
  technicalReadiness,
  contentQuality,
  aiSearchOptimization,
}: Props) {
  const data = [
    {
      subject: "Content",
      score: Math.round((contentStructure.score / contentStructure.maxScore) * 100),
    },
    {
      subject: "E-E-A-T",
      score: Math.round((eeatSignals.score / eeatSignals.maxScore) * 100),
    },
    {
      subject: "Technical",
      score: Math.round((technicalReadiness.score / technicalReadiness.maxScore) * 100),
    },
    {
      subject: "Quality",
      score: Math.round((contentQuality.score / contentQuality.maxScore) * 100),
    },
    {
      subject: "AI Optim.",
      score: Math.round(
        (aiSearchOptimization.score / aiSearchOptimization.maxScore) * 100
      ),
    },
  ];

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <h3 className="font-semibold text-sm mb-4">Category Breakdown</h3>
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={data}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.25}
            strokeWidth={2}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, "Score"]}
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
