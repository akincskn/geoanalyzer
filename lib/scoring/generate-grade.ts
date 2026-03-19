export function generateGrade(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

export function getGradeColor(grade: string): string {
  if (grade.startsWith("A")) return "text-green-500";
  if (grade.startsWith("B")) return "text-blue-500";
  if (grade.startsWith("C")) return "text-yellow-500";
  if (grade.startsWith("D")) return "text-orange-500";
  return "text-red-500";
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-blue-500";
  if (score >= 40) return "text-yellow-500";
  if (score >= 20) return "text-orange-500";
  return "text-red-500";
}
