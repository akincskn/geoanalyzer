import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { user } = session;

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNav
        user={{
          name: user.name ?? null,
          email: user.email ?? null,
          image: user.image ?? null,
        }}
      />
      <main className="flex-1 px-4 py-8 max-w-5xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
