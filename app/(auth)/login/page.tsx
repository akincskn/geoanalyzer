import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/analyze");

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-2xl text-indigo-400">◆</span>
            <span className="text-xl font-bold">GEO Analyzer</span>
          </div>
          <h1 className="text-2xl font-bold">Sign in to analyze</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Get 3 free GEO/AEO analyses — no credit card required.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
