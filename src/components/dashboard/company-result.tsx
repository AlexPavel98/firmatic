"use client";

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Bell,
  Shield,
  Building2,
  Phone,
  MapPin,
  Hash,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Scale,
  Gavel,
  Receipt,
  Share2,
  Download,
  BarChart3,
  CircleDollarSign,
  Landmark,
  Activity,
  Eye,
  AlertCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ANAFCompany } from "@/lib/anaf";
import type { RiskScore, RiskIndicator, RiskCategory } from "@/lib/risk-score";
import type { ParsedFinancials, FinancialRatios } from "@/lib/anaf-bilant";
import type { CourtCaseSummary } from "@/lib/portal-just";

// ─── Props ──────────────────────────────────────────────────────────────────

interface CompanyResultProps {
  company: ANAFCompany;
  risk: RiskScore;
  financials?: ParsedFinancials[];
  ratios?: FinancialRatios;
  courtCases?: CourtCaseSummary;
}

// ─── Format Helpers ─────────────────────────────────────────────────────────

function formatRON(n: number): string {
  if (n === 0) return "0 lei";
  const formatted = Math.round(Math.abs(n))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${n < 0 ? "-" : ""}${formatted} lei`;
}

function formatCompactRON(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1_000_000)
    return `${sign}${(abs / 1_000_000).toFixed(1).replace(".", ",")} mil. lei`;
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(0)} mii lei`;
  return formatRON(n);
}

// ─── Tab Definitions ────────────────────────────────────────────────────────

type TabId = "sumar" | "indicatori" | "financiare" | "dosare" | "fiscal";

const TABS: { id: TabId; label: string }[] = [
  { id: "sumar", label: "Sumar" },
  { id: "indicatori", label: "Indicatori de risc" },
  { id: "financiare", label: "Date financiare" },
  { id: "dosare", label: "Dosare instanta" },
  { id: "fiscal", label: "Statut fiscal" },
];

const CATEGORY_LABELS: Record<RiskCategory, string> = {
  fiscal: "Fiscal",
  financial: "Financiar",
  legal: "Juridic",
  operational: "Operational",
  governance: "Guvernanta",
};

const CATEGORY_ICONS: Record<RiskCategory, typeof Shield> = {
  fiscal: Receipt,
  financial: BarChart3,
  legal: Gavel,
  operational: Activity,
  governance: Eye,
};

const RECOMMENDATION_LABELS: Record<RiskScore["recommendation"], string> = {
  safe: "Partener sigur",
  caution: "Precautie recomandata",
  risky: "Risc ridicat",
  avoid: "De evitat",
};

// ─── Risk Score Circle (SVG Gauge) ──────────────────────────────────────────

function RiskGauge({
  score,
  grade,
  level,
}: {
  score: number;
  grade: string;
  level: RiskScore["level"];
}) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  const strokeColor =
    level === "low"
      ? "oklch(0.55 0.17 175)"
      : level === "medium"
        ? "oklch(0.7 0.15 80)"
        : level === "high"
          ? "oklch(0.58 0.22 27)"
          : "oklch(0.5 0.25 27)";

  const bgStrokeColor =
    level === "low"
      ? "oklch(0.55 0.17 175 / 15%)"
      : level === "medium"
        ? "oklch(0.7 0.15 80 / 15%)"
        : "oklch(0.58 0.22 27 / 15%)";

  const textColorClass =
    level === "low"
      ? "text-primary"
      : level === "medium"
        ? "text-chart-4"
        : "text-destructive";

  const levelLabel =
    level === "low"
      ? "Risc scazut"
      : level === "medium"
        ? "Risc mediu"
        : level === "high"
          ? "Risc ridicat"
          : "Risc critic";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-36 w-36">
        <svg className="h-36 w-36 -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={bgStrokeColor}
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={strokeColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`text-4xl font-bold tracking-tight ${textColorClass}`}
          >
            {score}
          </span>
          <span className={`text-lg font-semibold ${textColorClass}`}>
            {grade}
          </span>
        </div>
      </div>
      <Badge
        variant={
          level === "low"
            ? "default"
            : level === "medium"
              ? "secondary"
              : "destructive"
        }
        className="text-xs"
      >
        {levelLabel}
      </Badge>
    </div>
  );
}

// ─── Category Progress Bar ──────────────────────────────────────────────────

function CategoryBar({
  category,
  score,
  maxScore,
  percentage,
}: {
  category: RiskCategory;
  score: number;
  maxScore: number;
  percentage: number;
}) {
  const Icon = CATEGORY_ICONS[category];

  const barColor =
    percentage >= 70
      ? "bg-primary"
      : percentage >= 40
        ? "bg-chart-4"
        : "bg-destructive";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-muted-foreground" />
          <span className="font-medium text-foreground">
            {CATEGORY_LABELS[category]}
          </span>
        </div>
        <span className="text-muted-foreground">
          {Math.max(0, score)}/{maxScore} ({percentage}%)
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
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
        <CheckCircle className="mr-1 size-3" />
      ) : (
        <XCircle className="mr-1 size-3" />
      )}
      {active ? activeLabel : inactiveLabel}
    </Badge>
  );
}

// ─── Indicator Status Icon ──────────────────────────────────────────────────

function StatusIcon({ status }: { status: RiskIndicator["status"] }) {
  if (status === "pass")
    return <CheckCircle className="size-4 text-primary shrink-0" />;
  if (status === "warning")
    return <AlertTriangle className="size-4 text-chart-4 shrink-0" />;
  if (status === "fail")
    return <XCircle className="size-4 text-destructive shrink-0" />;
  return <Info className="size-4 text-muted-foreground shrink-0" />;
}

// ─── Simple Bar Chart (CSS-based) ───────────────────────────────────────────

function SimpleBarChart({
  data,
  valueKey,
  label,
  colorPositive,
  colorNegative,
}: {
  data: ParsedFinancials[];
  valueKey: "turnover" | "netProfit";
  label: string;
  colorPositive: string;
  colorNegative?: string;
}) {
  if (data.length === 0) return null;

  const values = data.map((d) => {
    if (valueKey === "netProfit") return d.netProfit - d.netLoss;
    return d[valueKey];
  });
  const maxVal = Math.max(...values.map(Math.abs), 1);

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-foreground">{label}</h4>
      <div className="space-y-2">
        {data.map((d, i) => {
          const val = values[i];
          const pct = (Math.abs(val) / maxVal) * 100;
          const isNeg = val < 0;

          return (
            <div key={d.year} className="flex items-center gap-3">
              <span className="w-12 text-xs text-muted-foreground font-medium">
                {d.year}
              </span>
              <div className="flex-1 h-6 bg-muted rounded-md overflow-hidden relative">
                <div
                  className={`h-full rounded-md transition-all duration-700 ease-out ${
                    isNeg ? colorNegative || "bg-destructive" : colorPositive
                  }`}
                  style={{ width: `${Math.max(pct, 2)}%` }}
                />
              </div>
              <span
                className={`w-28 text-right text-xs font-medium ${
                  isNeg ? "text-destructive" : "text-foreground"
                }`}
              >
                {formatCompactRON(val)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Ratio Display ──────────────────────────────────────────────────────────

function RatioCard({
  label,
  value,
  suffix,
  isGood,
}: {
  label: string;
  value: number | null;
  suffix?: string;
  isGood?: boolean;
}) {
  if (value === null || value === undefined) return null;

  return (
    <div className="glass rounded-xl p-4 space-y-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={`text-xl font-bold ${
          isGood === undefined
            ? "text-foreground"
            : isGood
              ? "text-primary"
              : "text-destructive"
        }`}
      >
        {value.toFixed(2).replace(".", ",")}
        {suffix && (
          <span className="text-sm font-normal text-muted-foreground ml-1">
            {suffix}
          </span>
        )}
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function CompanyResult({
  company,
  risk,
  financials,
  ratios,
  courtCases,
}: CompanyResultProps) {
  const [activeTab, setActiveTab] = useState<TabId>("sumar");

  // Determine company age
  let companyAge: number | null = null;
  if (company.nrRegCom) {
    const yearMatch = company.nrRegCom.match(/\/(\d{4})$/);
    if (yearMatch) {
      companyAge = new Date().getFullYear() - parseInt(yearMatch[1], 10);
    }
  }

  const latestFinancials =
    financials && financials.length > 0
      ? financials[financials.length - 1]
      : null;

  return (
    <div className="space-y-4">
      {/* ── Company Header ─────────────────────────────────────────────── */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Building2 className="size-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {company.denumire}
                </h2>
                <p className="text-sm text-muted-foreground">
                  CUI: {company.cui}
                  {company.nrRegCom && ` | Reg. Com.: ${company.nrRegCom}`}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {company.adresa && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 shrink-0" />
                  {company.adresa}
                </span>
              )}
              {company.telefon && (
                <span className="flex items-center gap-1.5">
                  <Phone className="size-3.5 shrink-0" />
                  {company.telefon}
                </span>
              )}
              {company.codPostal && (
                <span className="flex items-center gap-1.5">
                  <Hash className="size-3.5 shrink-0" />
                  {company.codPostal}
                </span>
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
                  <AlertTriangle className="mr-1 size-3" />
                  Firma inactiva
                </Badge>
              )}
              {company.statusTvaIncasare && (
                <Badge variant="secondary">TVA la incasare</Badge>
              )}
            </div>
          </div>

          {/* Risk gauge */}
          <RiskGauge
            score={risk.score}
            grade={risk.grade}
            level={risk.level}
          />
        </div>
      </div>

      {/* ── Tab Navigation ─────────────────────────────────────────────── */}
      <div className="glass rounded-xl p-1.5 flex gap-1 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.id
                ? "glass-strong text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ────────────────────────────────────────────────── */}
      <div className="glass-card rounded-2xl p-6">
        {/* TAB: Sumar */}
        {activeTab === "sumar" && (
          <div className="space-y-6">
            {/* Risk summary */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="size-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  Evaluare risc
                </h3>
                <Badge variant="outline" className="ml-auto text-xs">
                  {RECOMMENDATION_LABELS[risk.recommendation]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {risk.summary}
              </p>
            </div>

            {/* Category breakdown */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">
                Scor pe categorii
              </h4>
              <div className="grid gap-3">
                {(Object.keys(risk.categories) as RiskCategory[]).map(
                  (cat) => (
                    <CategoryBar
                      key={cat}
                      category={cat}
                      score={risk.categories[cat].score}
                      maxScore={risk.categories[cat].maxScore}
                      percentage={risk.categories[cat].percentage}
                    />
                  )
                )}
              </div>
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <div className="glass rounded-xl p-4 text-center space-y-1">
                <CircleDollarSign className="size-5 text-primary mx-auto" />
                <p className="text-xs text-muted-foreground">
                  Cifra de afaceri
                </p>
                <p className="text-sm font-bold text-foreground">
                  {latestFinancials
                    ? formatCompactRON(latestFinancials.turnover)
                    : "N/A"}
                </p>
              </div>
              <div className="glass rounded-xl p-4 text-center space-y-1">
                {latestFinancials &&
                latestFinancials.netProfit - latestFinancials.netLoss >= 0 ? (
                  <TrendingUp className="size-5 text-primary mx-auto" />
                ) : (
                  <TrendingDown className="size-5 text-destructive mx-auto" />
                )}
                <p className="text-xs text-muted-foreground">Profit net</p>
                <p className="text-sm font-bold text-foreground">
                  {latestFinancials
                    ? formatCompactRON(
                        latestFinancials.netProfit - latestFinancials.netLoss
                      )
                    : "N/A"}
                </p>
              </div>
              <div className="glass rounded-xl p-4 text-center space-y-1">
                <Users className="size-5 text-primary mx-auto" />
                <p className="text-xs text-muted-foreground">Angajati</p>
                <p className="text-sm font-bold text-foreground">
                  {latestFinancials ? latestFinancials.employees : "N/A"}
                </p>
              </div>
              <div className="glass rounded-xl p-4 text-center space-y-1">
                <Calendar className="size-5 text-primary mx-auto" />
                <p className="text-xs text-muted-foreground">Vechime</p>
                <p className="text-sm font-bold text-foreground">
                  {companyAge !== null
                    ? `${companyAge} ${companyAge === 1 ? "an" : "ani"}`
                    : "N/A"}
                </p>
              </div>
              <div className="glass rounded-xl p-4 text-center space-y-1">
                <Gavel className="size-5 text-primary mx-auto" />
                <p className="text-xs text-muted-foreground">
                  Dosare instanta
                </p>
                <p className="text-sm font-bold text-foreground">
                  {courtCases ? courtCases.total : "N/A"}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
              <Button variant="default" size="lg" className="btn-hover">
                <FileText className="mr-1.5 size-4" />
                Emite factura
              </Button>
              <Button variant="outline" size="lg" className="btn-hover">
                <Bell className="mr-1.5 size-4" />
                Monitorizeaza
              </Button>
              <Button variant="secondary" size="lg" className="btn-hover">
                <Download className="mr-1.5 size-4" />
                Raport PDF
              </Button>
              <Button variant="secondary" size="lg" className="btn-hover">
                <Share2 className="mr-1.5 size-4" />
                Partajeaza
              </Button>
            </div>
          </div>
        )}

        {/* TAB: Indicatori de risc */}
        {activeTab === "indicatori" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="size-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                Indicatori de risc ({risk.indicators.length})
              </h3>
            </div>

            {(Object.keys(risk.categories) as RiskCategory[]).map(
              (category) => {
                const catIndicators = risk.indicators.filter(
                  (ind) => ind.category === category
                );
                if (catIndicators.length === 0) return null;

                const catData = risk.categories[category];
                const Icon = CATEGORY_ICONS[category];

                return (
                  <div key={category} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="size-4 text-muted-foreground" />
                        <h4 className="text-sm font-semibold text-foreground">
                          {CATEGORY_LABELS[category]}
                        </h4>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {Math.max(0, catData.score)}/{catData.maxScore} puncte (
                        {catData.percentage}%)
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      {catIndicators.map((ind, i) => (
                        <div
                          key={i}
                          className="glass rounded-xl p-3 flex items-start gap-3"
                        >
                          <StatusIcon status={ind.status} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium text-foreground">
                                {ind.name}
                              </p>
                              <span
                                className={`text-xs whitespace-nowrap font-medium ${
                                  ind.score < 0
                                    ? "text-destructive"
                                    : ind.score > 0
                                      ? "text-primary"
                                      : "text-muted-foreground"
                                }`}
                              >
                                {ind.score > 0 ? "+" : ""}
                                {ind.score}/{ind.maxScore}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {ind.detail}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}

        {/* TAB: Date financiare */}
        {activeTab === "financiare" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                Date financiare
              </h3>
            </div>

            {financials && financials.length > 0 ? (
              <>
                {/* Revenue chart */}
                <SimpleBarChart
                  data={financials}
                  valueKey="turnover"
                  label="Cifra de afaceri"
                  colorPositive="bg-primary"
                />

                {/* Profit chart */}
                <SimpleBarChart
                  data={financials}
                  valueKey="netProfit"
                  label="Profit / Pierdere neta"
                  colorPositive="bg-primary"
                  colorNegative="bg-destructive"
                />

                {/* Key metrics table */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">
                    Indicatori cheie
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="py-2 pr-4 text-left text-xs font-medium text-muted-foreground">
                            Indicator
                          </th>
                          {financials.map((f) => (
                            <th
                              key={f.year}
                              className="py-2 px-3 text-right text-xs font-medium text-muted-foreground"
                            >
                              {f.year}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {(
                          [
                            {
                              label: "Cifra de afaceri",
                              key: "turnover" as const,
                            },
                            {
                              label: "Venituri totale",
                              key: "totalRevenue" as const,
                            },
                            {
                              label: "Cheltuieli totale",
                              key: "totalExpenses" as const,
                            },
                            {
                              label: "Profit brut",
                              key: "grossProfit" as const,
                            },
                            {
                              label: "Profit net",
                              key: "netProfit" as const,
                            },
                            {
                              label: "Pierdere neta",
                              key: "netLoss" as const,
                            },
                            {
                              label: "Angajati",
                              key: "employees" as const,
                            },
                            {
                              label: "Active fixe",
                              key: "fixedAssets" as const,
                            },
                            {
                              label: "Active circulante",
                              key: "currentAssets" as const,
                            },
                            {
                              label: "Capitaluri proprii",
                              key: "equity" as const,
                            },
                            {
                              label: "Datorii totale",
                              key: "totalLiabilities" as const,
                            },
                          ] as const
                        ).map((row) => (
                          <tr key={row.key}>
                            <td className="py-2 pr-4 text-foreground font-medium">
                              {row.label}
                            </td>
                            {financials.map((f) => (
                              <td
                                key={f.year}
                                className={`py-2 px-3 text-right whitespace-nowrap ${
                                  row.key === "netLoss" && f[row.key] > 0
                                    ? "text-destructive"
                                    : "text-foreground"
                                }`}
                              >
                                {row.key === "employees"
                                  ? f[row.key]
                                  : formatRON(f[row.key])}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Financial ratios */}
                {ratios && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-foreground">
                      Indicatori financiari
                    </h4>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      <RatioCard
                        label="Marja de profit"
                        value={ratios.profitMargin}
                        suffix="%"
                        isGood={ratios.profitMargin > 0}
                      />
                      <RatioCard
                        label="Lichiditate curenta"
                        value={ratios.currentRatio}
                        isGood={ratios.currentRatio >= 1}
                      />
                      <RatioCard
                        label="Datorii / Capitaluri"
                        value={ratios.debtToEquity}
                        isGood={
                          ratios.debtToEquity >= 0 && ratios.debtToEquity < 3
                        }
                      />
                      <RatioCard
                        label="Rentabilitate cap. proprii (ROE)"
                        value={ratios.returnOnEquity}
                        suffix="%"
                        isGood={ratios.returnOnEquity > 0}
                      />
                      {ratios.revenueGrowth !== null && (
                        <RatioCard
                          label="Crestere venituri"
                          value={ratios.revenueGrowth}
                          suffix="%"
                          isGood={ratios.revenueGrowth > 0}
                        />
                      )}
                      {ratios.profitGrowth !== null && (
                        <RatioCard
                          label="Crestere profit"
                          value={ratios.profitGrowth}
                          suffix="%"
                          isGood={ratios.profitGrowth > 0}
                        />
                      )}
                      <RatioCard
                        label="Productivitate / angajat"
                        value={ratios.employeeProductivity}
                        suffix=" lei"
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
                  <BarChart3 className="size-6 text-muted-foreground" />
                </div>
                <p className="mt-4 text-sm font-medium text-foreground">
                  Nu sunt disponibile date financiare
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Datele financiare ANAF nu sunt disponibile pentru aceasta
                  firma sau anul solicitat.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB: Dosare instanta */}
        {activeTab === "dosare" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Gavel className="size-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                Dosare instanta
              </h3>
            </div>

            {courtCases && courtCases.total > 0 ? (
              <>
                {/* Summary badges */}
                <div className="flex flex-wrap gap-3">
                  <div className="glass rounded-xl px-4 py-3 text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {courtCases.total}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total dosare
                    </p>
                  </div>
                  <div className="glass rounded-xl px-4 py-3 text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {courtCases.asReclamant}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Ca reclamant
                    </p>
                  </div>
                  <div className="glass rounded-xl px-4 py-3 text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {courtCases.asParat}
                    </p>
                    <p className="text-xs text-muted-foreground">Ca parat</p>
                  </div>
                  {courtCases.insolventa > 0 && (
                    <div className="glass rounded-xl px-4 py-3 text-center border border-destructive/20">
                      <p className="text-2xl font-bold text-destructive">
                        {courtCases.insolventa}
                      </p>
                      <p className="text-xs text-destructive">Insolventa</p>
                    </div>
                  )}
                  <div className="glass rounded-xl px-4 py-3 text-center">
                    <p className="text-2xl font-bold text-chart-4">
                      {courtCases.active}
                    </p>
                    <p className="text-xs text-muted-foreground">Active</p>
                  </div>
                </div>

                {/* Cases list */}
                <div className="space-y-2">
                  {courtCases.cases.map((caseItem, i) => {
                    const isInsolvency = caseItem.obiect
                      .toLowerCase()
                      .match(
                        /insolven|faliment|reorganizare|lichidare|dizolvare/
                      );

                    return (
                      <div
                        key={i}
                        className={`glass rounded-xl p-4 space-y-2 ${
                          isInsolvency ? "border border-destructive/20" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {isInsolvency ? (
                              <AlertCircle className="size-4 text-destructive shrink-0" />
                            ) : (
                              <Scale className="size-4 text-muted-foreground shrink-0" />
                            )}
                            <span className="text-sm font-semibold text-foreground">
                              {caseItem.numarDosar}
                            </span>
                          </div>
                          {caseItem.stadiu && (
                            <Badge
                              variant={
                                caseItem.stadiu
                                  .toLowerCase()
                                  .includes("solutionat") ||
                                caseItem.stadiu
                                  .toLowerCase()
                                  .includes("finalizat")
                                  ? "secondary"
                                  : "outline"
                              }
                              className="text-xs shrink-0"
                            >
                              {caseItem.stadiu}
                            </Badge>
                          )}
                        </div>

                        {caseItem.institutie && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Landmark className="size-3 shrink-0" />
                            {caseItem.institutie}
                          </p>
                        )}

                        {caseItem.obiect && (
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Obiect:</span>{" "}
                            {caseItem.obiect}
                          </p>
                        )}

                        {caseItem.categorie && (
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Categorie:</span>{" "}
                            {caseItem.categorie}
                          </p>
                        )}

                        {caseItem.parti && caseItem.parti.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {caseItem.parti.map((parte, j) => (
                              <Badge
                                key={j}
                                variant="secondary"
                                className="text-xs"
                              >
                                {parte}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <CheckCircle className="size-6 text-primary" />
                </div>
                <p className="mt-4 text-sm font-medium text-foreground">
                  Nu au fost gasite dosare
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {courtCases
                    ? "Aceasta firma nu are dosare inregistrate in portal.just.ro."
                    : "Serviciul portal.just.ro nu a putut fi contactat. Incercati din nou mai tarziu."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB: Statut fiscal */}
        {activeTab === "fiscal" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Receipt className="size-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                Statut fiscal detaliat
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* TVA */}
              <div className="glass rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <StatusBadge
                    active={company.scpTVA}
                    activeLabel="Platitor TVA"
                    inactiveLabel="Neplatitor TVA"
                  />
                </div>
                {company.data_inceput_ScpTVA && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Inceput TVA:</span>{" "}
                    {company.data_inceput_ScpTVA}
                  </p>
                )}
                {company.data_sfarsit_ScpTVA && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Sfarsit TVA:</span>{" "}
                    {company.data_sfarsit_ScpTVA}
                  </p>
                )}
                {company.mesaj_ScpTVA && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Mesaj:</span>{" "}
                    {company.mesaj_ScpTVA}
                  </p>
                )}
              </div>

              {/* e-Factura */}
              <div className="glass rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <StatusBadge
                    active={company.statusRO_e_Factura}
                    activeLabel="e-Factura activ"
                    inactiveLabel="e-Factura inactiv"
                  />
                </div>
                {company.dataActiveRO_e_Factura && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Activat la:</span>{" "}
                    {company.dataActiveRO_e_Factura}
                  </p>
                )}
              </div>

              {/* TVA la incasare */}
              <div className="glass rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      company.statusTvaIncasare ? "secondary" : "outline"
                    }
                  >
                    {company.statusTvaIncasare
                      ? "TVA la incasare — activ"
                      : "TVA la incasare — inactiv"}
                  </Badge>
                </div>
                {company.dataInceputTvaInc && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">De la:</span>{" "}
                    {company.dataInceputTvaInc}
                  </p>
                )}
                {company.dataSfarsitTvaInc && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Pana la:</span>{" "}
                    {company.dataSfarsitTvaInc}
                  </p>
                )}
                {company.tipActTvaInc && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Tip act:</span>{" "}
                    {company.tipActTvaInc}
                  </p>
                )}
              </div>

              {/* Inactive / Radiere */}
              <div className="glass rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  {company.statusInactivi ? (
                    <Badge variant="destructive">
                      <AlertTriangle className="mr-1 size-3" />
                      Firma inactiva
                    </Badge>
                  ) : (
                    <Badge variant="default">
                      <CheckCircle className="mr-1 size-3" />
                      Firma activa
                    </Badge>
                  )}
                </div>
                {company.dataInactivworking && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Data inactivare:</span>{" "}
                    {company.dataInactivworking}
                  </p>
                )}
                {company.dataReworking && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Data reactivare:</span>{" "}
                    {company.dataReworking}
                  </p>
                )}
                {company.dataRadiere && (
                  <p className="text-xs text-destructive">
                    <span className="font-medium">Data radiere:</span>{" "}
                    {company.dataRadiere}
                  </p>
                )}
              </div>
            </div>

            {/* Registration status */}
            <div className="glass rounded-xl p-4 space-y-2">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <ClipboardList className="size-4 text-muted-foreground" />
                Stare inregistrare
              </h4>
              {company.stare_inregistrare && (
                <p className="text-sm text-foreground">
                  {company.stare_inregistrare}
                </p>
              )}
              {company.act && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Act constitutiv:</span>{" "}
                  {company.act}
                </p>
              )}
            </div>

            {/* Full address */}
            {company.adresa && (
              <div className="glass rounded-xl p-4 space-y-2">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="size-4 text-muted-foreground" />
                  Adresa completa
                </h4>
                <p className="text-sm text-foreground">{company.adresa}</p>
                {company.codPostal && (
                  <p className="text-xs text-muted-foreground">
                    Cod postal: {company.codPostal}
                  </p>
                )}
              </div>
            )}

            {/* Last updated */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Info className="size-3" />
              Date actualizate la:{" "}
              {risk.lastUpdated
                ? new Date(risk.lastUpdated).toLocaleDateString("ro-RO", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
