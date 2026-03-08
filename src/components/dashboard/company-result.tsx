"use client";

import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Bell,
  ClipboardList,
  Shield,
  Building2,
  Phone,
  MapPin,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ANAFCompany } from "@/lib/anaf";
import type { RiskScore } from "@/lib/risk-score";

// ─── Props ──────────────────────────────────────────────────────────────────

interface CompanyResultProps {
  company: ANAFCompany;
  risk: RiskScore;
}

// ─── Risk Score Indicator ───────────────────────────────────────────────────

function RiskScoreCircle({ score, level }: { score: number; level: RiskScore["level"] }) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  const colorClass =
    level === "low"
      ? "text-primary"
      : level === "medium"
        ? "text-chart-4"
        : "text-destructive";

  const strokeColor =
    level === "low"
      ? "oklch(0.55 0.17 175)"
      : level === "medium"
        ? "oklch(0.7 0.15 80)"
        : "oklch(0.58 0.22 27)";

  const levelLabel =
    level === "low"
      ? "Risc scazut"
      : level === "medium"
        ? "Risc mediu"
        : "Risc ridicat";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-24 w-24">
        <svg className="h-24 w-24 -rotate-90" viewBox="0 0 96 96">
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            className="stroke-muted"
            strokeWidth="6"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke={strokeColor}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${colorClass}`}>{score}</span>
        </div>
      </div>
      <span className={`text-sm font-medium ${colorClass}`}>{levelLabel}</span>
    </div>
  );
}

// ─── Status Badge ───────────────────────────────────────────────────────────

function StatusBadge({
  active,
  activeLabel,
  inactiveLabel,
}: {
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
}) {
  return (
    <Badge variant={active ? "default" : "destructive"}>
      {active ? (
        <CheckCircle className="mr-1 size-3" data-icon="inline-start" />
      ) : (
        <XCircle className="mr-1 size-3" data-icon="inline-start" />
      )}
      {active ? activeLabel : inactiveLabel}
    </Badge>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function CompanyResult({ company, risk }: CompanyResultProps) {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-6">
      {/* Header: Company name + CUI */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="size-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">
              {company.denumire}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            CUI: {company.cui}
            {company.nrRegCom && ` | Reg. Com.: ${company.nrRegCom}`}
          </p>
        </div>

        {/* Risk score */}
        <RiskScoreCircle score={risk.score} level={risk.level} />
      </div>

      {/* Company details */}
      <div className="grid gap-3 sm:grid-cols-2">
        {company.adresa && (
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 size-4 text-muted-foreground shrink-0" />
            <span className="text-foreground">{company.adresa}</span>
          </div>
        )}
        {company.telefon && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="size-4 text-muted-foreground shrink-0" />
            <span className="text-foreground">{company.telefon}</span>
          </div>
        )}
        {company.codPostal && (
          <div className="flex items-center gap-2 text-sm">
            <Hash className="size-4 text-muted-foreground shrink-0" />
            <span className="text-foreground">
              Cod postal: {company.codPostal}
            </span>
          </div>
        )}
        {company.stare_inregistrare && (
          <div className="flex items-center gap-2 text-sm">
            <ClipboardList className="size-4 text-muted-foreground shrink-0" />
            <span className="text-foreground">
              {company.stare_inregistrare}
            </span>
          </div>
        )}
      </div>

      {/* Status badges */}
      <div className="flex flex-wrap gap-2">
        <StatusBadge
          active={company.scpTVA}
          activeLabel="Platitor TVA"
          inactiveLabel="Neplatitor TVA"
        />
        <StatusBadge
          active={company.statusRO_e_Factura}
          activeLabel="e-Factura activ"
          inactiveLabel="e-Factura inactiv"
        />
        {company.statusInactivi && (
          <Badge variant="destructive">
            <AlertTriangle
              className="mr-1 size-3"
              data-icon="inline-start"
            />
            Firma inactiva
          </Badge>
        )}
        {company.statusTvaIncasare && (
          <Badge variant="secondary">TVA la incasare</Badge>
        )}
      </div>

      {/* Risk factors */}
      {risk.factors.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">
              Factori de risc
            </h3>
          </div>
          <ul className="space-y-1">
            {risk.factors.map((factor, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="mt-1.5 size-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                {factor}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
        <Button variant="default" size="lg">
          <FileText className="mr-1.5 size-4" data-icon="inline-start" />
          Emite factura
        </Button>
        <Button variant="outline" size="lg">
          <Bell className="mr-1.5 size-4" data-icon="inline-start" />
          Monitorizeaza
        </Button>
        <Button variant="secondary" size="lg">
          <ClipboardList
            className="mr-1.5 size-4"
            data-icon="inline-start"
          />
          Raport complet
        </Button>
      </div>
    </div>
  );
}
