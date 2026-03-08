"use client";

import { useState } from "react";
import { Search, Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CompanyResult } from "@/components/dashboard/company-result";
import type { ANAFCompany } from "@/lib/anaf";
import type { RiskScore } from "@/lib/risk-score";

export default function VerificarePage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ company: ANAFCompany; risk: RiskScore } | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/verificare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cui: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Eroare la verificare. Încearcă din nou.");
        return;
      }

      setResult(data);
    } catch {
      setError("Nu s-a putut contacta serverul. Verifică conexiunea.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Verificare firmă
        </h1>
        <p className="mt-1 text-muted-foreground">
          Caută orice firmă din România după CUI.
        </p>
      </div>

      <form onSubmit={handleSearch} className="glass-card rounded-2xl p-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Introdu CUI (ex: RO12345678)..."
              className="h-12 rounded-xl border-border/50 bg-background/50 pl-12 text-base placeholder:text-muted-foreground"
            />
          </div>
          <Button
            type="submit"
            disabled={loading || !query.trim()}
            className="btn-hover h-12 rounded-xl bg-primary px-8 text-primary-foreground hover:bg-primary/90"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            {loading ? "Se caută..." : "Caută"}
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Exemplu: RO12345678 sau 12345678
        </p>
      </form>

      {error && (
        <div className="glass-card rounded-2xl border-destructive/20 bg-destructive/5 p-5 text-center">
          <p className="text-sm font-medium text-destructive">{error}</p>
        </div>
      )}

      {result && (
        <CompanyResult company={result.company} risk={result.risk} />
      )}

      {!result && !error && !loading && (
        <div className="glass-card flex flex-col items-center justify-center rounded-2xl py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Building2 className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="mt-5 text-lg font-medium text-foreground">
            Caută o firmă pentru a vedea detaliile
          </p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Vei primi instant: date ANAF, statut TVA, e-Factura, scor de risc AI
            și posibilitatea de a emite factură.
          </p>
        </div>
      )}
    </div>
  );
}
