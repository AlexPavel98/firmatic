import { Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MonitorizarePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Monitorizare
          </h1>
          <p className="mt-1 text-muted-foreground">
            Primești alerte automate când se schimbă ceva la firmele monitorizate.
          </p>
        </div>
        <Button className="btn-hover rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Adaugă firmă
        </Button>
      </div>

      {/* Empty state */}
      <div className="glass-card flex flex-col items-center justify-center rounded-2xl py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <Bell className="h-7 w-7 text-muted-foreground" />
        </div>
        <p className="mt-5 text-lg font-medium text-foreground">
          Nu monitorizezi nicio firmă încă
        </p>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Adaugă firme pentru a primi notificări automate la schimbări de statut
          fiscal, insolvență, bilanț nou sau alte evenimente importante.
        </p>
        <Button className="btn-hover mt-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Adaugă prima firmă
        </Button>
      </div>
    </div>
  );
}
