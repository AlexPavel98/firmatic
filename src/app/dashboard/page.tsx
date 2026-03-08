import Link from "next/link";
import {
  Search,
  FileText,
  Bell,
  TrendingUp,
  ShieldCheck,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  {
    label: "Verificări azi",
    value: "0",
    icon: Search,
    change: null,
  },
  {
    label: "Facturi luna aceasta",
    value: "0",
    icon: FileText,
    change: null,
  },
  {
    label: "Firme monitorizate",
    value: "0",
    icon: Bell,
    change: null,
  },
  {
    label: "Scor mediu risc",
    value: "—",
    icon: ShieldCheck,
    change: null,
  },
];

const quickActions = [
  {
    label: "Verifică firmă",
    icon: Search,
    href: "/dashboard/verificare",
    description: "Caută după CUI sau denumire",
  },
  {
    label: "Emite factură",
    icon: FileText,
    href: "/dashboard/facturi",
    description: "Creează o factură nouă",
  },
  {
    label: "Adaugă monitorizare",
    icon: Plus,
    href: "/dashboard/monitorizare",
    description: "Monitorizează o firmă nouă",
  },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Bun venit în{" "}
          <span className="gradient-text">Firmatic</span>
        </h1>
        <p className="mt-1 text-muted-foreground">
          Verifică firme, emite facturi și monitorizează partenerii de afaceri.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {stat.label}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <stat.icon className="h-4.5 w-4.5 text-primary" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-bold text-foreground">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Acțiuni rapide
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <div className="glass-card group flex h-full cursor-pointer items-center gap-4 rounded-2xl p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <action.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      {action.label}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity placeholder */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Activitate recentă
        </h2>
        <div className="glass-card flex flex-col items-center justify-center rounded-2xl py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <TrendingUp className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="mt-4 font-medium text-foreground">
            Nicio activitate încă
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Verifică o firmă sau emite o factură pentru a începe.
          </p>
          <Link href="/dashboard/verificare">
            <Button
              className="btn-hover mt-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Search className="mr-2 h-4 w-4" />
              Verifică prima firmă
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
