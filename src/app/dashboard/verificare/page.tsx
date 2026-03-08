"use client";

import { useState } from "react";
import { Search, Building2, Loader2, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CompanyResult } from "@/components/dashboard/company-result";
import type { ANAFCompany } from "@/lib/anaf";
import type { RiskScore } from "@/lib/risk-score";
import type { ParsedFinancials, FinancialRatios } from "@/lib/anaf-bilant";
import type { CourtCaseSummary } from "@/lib/portal-just";

// ─── Types ──────────────────────────────────────────────────────────────────

interface VerificationResult {
  company: ANAFCompany;
  risk: RiskScore;
  financials?: ParsedFinancials[];
  ratios?: FinancialRatios;
  courtCases?: CourtCaseSummary;
}

interface SearchHistoryItem {
  cui: string;
  name: string;
  timestamp: number;
}

// ─── Loading Skeleton ───────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Header skeleton */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-muted" />
              <div className="space-y-2">
                <div className="h-6 w-64 rounded-lg bg-muted" />
                <div className="h-4 w-48 rounded-lg bg-muted" />
              </div>
            </div>
            <div className="h-4 w-96 rounded-lg bg-muted" />
            <div className="flex gap-2">
              <div className="h-6 w-24 rounded-full bg-muted" />
              <div className="h-6 w-28 rounded-full bg-muted" />
              <div className="h-6 w-20 rounded-full bg-muted" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="h-36 w-36 rounded-full bg-muted" />
            <div className="h-6 w-20 rounded-full bg-muted" />
          </div>
        </div>
      </div>

      {/* Tab bar skeleton */}
      <div className="glass rounded-xl p-1.5 flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-9 w-28 rounded-lg bg-muted" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="h-5 w-40 rounded-lg bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded-lg bg-muted" />
          <div className="h-4 w-3/4 rounded-lg bg-muted" />
        </div>
        <div className="grid gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between">
                <div className="h-4 w-24 rounded-lg bg-muted" />
                <div className="h-4 w-12 rounded-lg bg-muted" />
              </div>
              <div className="h-2 w-full rounded-full bg-muted" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="glass rounded-xl p-4 space-y-2">
              <div className="h-5 w-5 rounded bg-muted mx-auto" />
              <div className="h-3 w-16 rounded bg-muted mx-auto" />
              <div className="h-4 w-20 rounded bg-muted mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function VerificarePage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  function addToHistory(cui: string, name: string) {
    setHistory((prev) => {
      // Remove duplicate if exists
      const filtered = prev.filter(
        (item) => item.cui !== cui.replace(/^RO/i, "")
      );
      // Add to front, keep last 5
      return [
        { cui: cui.replace(/^RO/i, ""), name, timestamp: Date.now() },
        ...filtered,
      ].slice(0, 5);
    });
  }

  function removeFromHistory(cui: string) {
    setHistory((prev) => prev.filter((item) => item.cui !== cui));
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    await performSearch(trimmed);
  }

  async function performSearch(cui: string) {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/verificare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cui }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Eroare la verificare. Incearca din nou.");
        return;
      }

      setResult(data);
      addToHistory(cui, data.company.denumire);
    } catch {
      setError("Nu s-a putut contacta serverul. Verifica conexiunea.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Verificare firma
        </h1>
        <p className="mt-1 text-muted-foreground">
          Cauta orice firma din Romania dupa CUI — date ANAF, bilant, dosare
          instanta, scor de risc.
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
            {loading ? "Se cauta..." : "Cauta"}
          </Button>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Exemplu: RO12345678 sau 12345678
          </p>
          {loading && (
            <p className="text-xs text-muted-foreground animate-pulse">
              Se incarca date ANAF, bilant si dosare...
            </p>
          )}
        </div>

        {/* Search history chips */}
        {history.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Clock className="size-3.5 text-muted-foreground" />
            {history.map((item) => (
              <div key={item.cui} className="flex items-center gap-0.5">
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-accent transition-colors text-xs"
                  onClick={() => {
                    setQuery(item.cui);
                    performSearch(item.cui);
                  }}
                >
                  {item.cui} — {item.name.length > 20 ? item.name.slice(0, 20) + "..." : item.name}
                </Badge>
                <button
                  type="button"
                  onClick={() => removeFromHistory(item.cui)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </form>

      {error && (
        <div className="glass-card rounded-2xl border-destructive/20 bg-destructive/5 p-5 text-center">
          <p className="text-sm font-medium text-destructive">{error}</p>
        </div>
      )}

      {loading && <LoadingSkeleton />}

      {result && (
        <CompanyResult
          company={result.company}
          risk={result.risk}
          financials={result.financials}
          ratios={result.ratios}
          courtCases={result.courtCases}
        />
      )}

      {!result && !error && !loading && (
        <div className="glass-card flex flex-col items-center justify-center rounded-2xl py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Building2 className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="mt-5 text-lg font-medium text-foreground">
            Cauta o firma pentru a vedea detaliile
          </p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Vei primi instant: date ANAF, statut TVA, e-Factura, bilant
            financiar, dosare instanta, scor de risc complet si posibilitatea
            de a emite factura.
          </p>
        </div>
      )}
    </div>
  );
}
