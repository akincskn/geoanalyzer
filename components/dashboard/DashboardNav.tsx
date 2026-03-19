"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Search, LogOut } from "lucide-react";

interface Props {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function DashboardNav({ user }: Props) {
  const pathname = usePathname();

  const links = [
    { href: "/analyze", label: "Analyze", icon: Search },
    { href: "/dashboard", label: "History", icon: LayoutDashboard },
  ];

  return (
    <header className="border-b border-border/60 px-4 py-3">
      <div className="mx-auto max-w-5xl flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="text-indigo-400">◆</span>
            GEO Analyzer
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
                  pathname === href
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name ?? "User"}
              className="h-7 w-7 rounded-full"
            />
          )}
          <span className="hidden sm:block text-sm text-muted-foreground">
            {user.name ?? user.email}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
