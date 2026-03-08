"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  Search,
  FileText,
  Bell,
  BarChart3,
  Bot,
  Settings,
  LogOut,
  ChevronRight,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
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

const breadcrumbMap: Record<string, string> = {
  dashboard: "Acasă",
  verificare: "Verificare firmă",
  facturi: "Facturi",
  monitorizare: "Monitorizare",
  rapoarte: "Rapoarte",
  asistent: "Asistent AI",
  setari: "Setări",
};

export function TopBar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);

  const segments = pathname.split("/").filter(Boolean);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="glass sticky top-0 z-30 flex h-16 items-center justify-between gap-4 px-4 md:px-6">
      {/* Left: mobile menu + breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 lg:hidden"
              />
            }
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Meniu navigare</SheetTitle>
            <div className="flex h-full flex-col">
              {/* Logo */}
              <div className="flex h-16 items-center px-6">
                <span className="text-xl font-bold tracking-tight">
                  <span className="gradient-text">Fir</span>
                  <span className="text-foreground">matic</span>
                </span>
              </div>

              {/* Nav */}
              <nav className="flex-1 space-y-1 px-3 py-4">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
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

              {/* User + Logout */}
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
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm">
          <Link
            href="/dashboard"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Home className="h-4 w-4" />
          </Link>
          {segments.slice(1).map((segment, i) => (
            <span key={segment} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
              <span
                className={
                  i === segments.length - 2
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }
              >
                {breadcrumbMap[segment] ?? segment}
              </span>
            </span>
          ))}
        </nav>
      </div>

      {/* Right: user avatar */}
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 sm:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {user.email?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <span className="hidden text-sm font-medium text-foreground md:inline">
            {user.email}
          </span>
        </div>
      </div>
    </header>
  );
}
