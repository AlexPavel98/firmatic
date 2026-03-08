import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FacturiPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Facturi
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gestionează și emite facturi e-Factura.
          </p>
        </div>
        <Button className="btn-hover rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Emite factură
        </Button>
      </div>

      {/* Table placeholder */}
      <div className="glass-card overflow-hidden rounded-2xl">
        {/* Table header */}
        <div className="hidden border-b border-border/50 px-6 py-3 sm:grid sm:grid-cols-5 sm:gap-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Nr. factură
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Client
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sumă
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Data
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Status
          </span>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <FileText className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="mt-5 text-lg font-medium text-foreground">
            Nu ai facturi încă
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Emite prima factură pentru a începe.
          </p>
          <Button
            className="btn-hover mt-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Emite prima factură
          </Button>
        </div>
      </div>
    </div>
  );
}
