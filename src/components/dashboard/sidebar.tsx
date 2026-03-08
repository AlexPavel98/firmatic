"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  FileText,
  Bell,
  BarChart3,
  Bot,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const navItems = [
  { label: "Verificare firmă", icon: Search, href: "/dashboard/verificare" },
  { label: "Facturi", icon: FileText, href: "/dashboard/facturi" },
  { label: "Monitorizare", icon: Bell, href: "/dashboard/monitorizare" },
  { label: "Rapoarte", icon: BarChart3, href: "/dashboard/rapoarte" },
  { label: "Asistent AI", icon: Bot, href: "/dashboard/asistent" },
  { label: "Setări", icon: Settings, href: "/dashboard/setari" },
];

export function Sidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="glass-strong fixed inset-y-0 left-0 z-40 hidden w-64 flex-col lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <Link href="/dashboard" className="text-xl font-bold tracking-tight">
          <span className="gradient-text">Fir</span>
          <span className="text-foreground">matic</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon
                className={`h-5 w-5 ${isActive ? "text-primary" : ""}`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User section at bottom */}
      <div className="border-t border-border/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {user.email?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {user.email}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
            title="Deconectare"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
