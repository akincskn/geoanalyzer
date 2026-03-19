import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UrlForm } from "@/components/analyze/UrlForm";

export default async function AnalyzePage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { credits: true },
  });

  return (
    <div className="flex flex-col items-center text-center pt-8">
      <h1 className="text-3xl font-bold mb-2">Analyze a URL</h1>
      <p className="text-muted-foreground mb-10 max-w-lg">
        Enter any public webpage and get a detailed GEO/AEO score with
        AI-powered recommendations in under 30 seconds.
      </p>
      <UrlForm credits={user?.credits ?? 0} />
    </div>
  );
}
