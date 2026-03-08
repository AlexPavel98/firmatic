"use client";

import {
  BarChart3,
  Download,
  FileDown,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MOCK_MONITORED_COMPANIES,
  MOCK_ALERTS,
  getRiskLevelColor,
  getRiskLevelLabel,
  getAlertTypeLabel,
  type AlertType,
} from "@/lib/monitoring";

export default function RapoartePage() {
  const companies = MOCK_MONITORED_COMPANIES;
  const alerts = MOCK_ALERTS;

  // Portfolio stats
  const totalCompanies = companies.length;
  const avgRisk = Math.round(
    companies.reduce((sum, c) => sum + c.riskScore, 0) / totalCompanies
  );

  // Risk distribution
  const riskDistribution = {
    low: companies.filter((c) => c.riskLevel === "low").length,
    medium: companies.filter((c) => c.riskLevel === "medium").length,
    high: companies.filter((c) => c.riskLevel === "high").length,
    critical: companies.filter((c) => c.riskLevel === "critical").length,
  };

  const riskPercentages = {
    low: Math.round((riskDistribution.low / totalCompanies) * 100),
    medium: Math.round((riskDistribution.medium / totalCompanies) * 100),
    high: Math.round((riskDistribution.high / totalCompanies) * 100),
    critical: Math.round((riskDistribution.critical / totalCompanies) * 100),
  };

  // Alerts by type
  const alertsByType: Record<string, number> = {};
  alerts.forEach((a) => {
    alertsByType[a.type] = (alertsByType[a.type] || 0) + 1;
  });
  const alertTypeCounts = Object.entries(alertsByType).sort(
    ([, a], [, b]) => b - a
  );
  const maxAlertTypeCount = Math.max(...alertTypeCounts.map(([, c]) => c));

  // Alerts by severity
  const alertsBySeverity = {
    info: alerts.filter((a) => a.severity === "info").length,
    warning: alerts.filter((a) => a.severity === "warning").length,
    critical: alerts.filter((a) => a.severity === "critical").length,
  };
  const maxSeverityCount = Math.max(...Object.values(alertsBySeverity));

  // Top risky companies
  const topRisky = [...companies]
    .sort((a, b) => a.riskScore - b.riskScore)
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Rapoarte & Analytics
          </h1>
          <p className="mt-1 text-muted-foreground">
            Vizualizare de ansamblu asupra portofoliului tău de firme monitorizate.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="btn-hover gap-2 rounded-xl"
          >
            <FileDown className="h-4 w-4" />
            Descarcă PDF
          </Button>
          <Button
            variant="outline"
            className="btn-hover gap-2 rounded-xl"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total firme</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-foreground">
            {totalCompanies}
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Scor mediu risc
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-foreground">
            {avgRisk}
            <span className="ml-1 text-base font-normal text-muted-foreground">
              /100
            </span>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Total alerte
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/10">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-foreground">
            {alerts.length}
          </div>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-foreground">
          Distribuția riscului
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Procentul firmelor monitorizate pe nivel de risc
        </p>

        {/* Stacked bar */}
        <div className="mt-5 flex h-8 w-full overflow-hidden rounded-xl">
          {riskPercentages.low > 0 && (
            <div
              className="flex items-center justify-center bg-primary/80 text-xs font-medium text-primary-foreground transition-all"
              style={{ width: `${riskPercentages.low}%` }}
            >
              {riskPercentages.low}%
            </div>
          )}
          {riskPercentages.medium > 0 && (
            <div
              className="flex items-center justify-center bg-chart-4/80 text-xs font-medium text-foreground transition-all"
              style={{ width: `${riskPercentages.medium}%` }}
            >
              {riskPercentages.medium}%
            </div>
          )}
          {riskPercentages.high > 0 && (
            <div
              className="flex items-center justify-center bg-destructive/60 text-xs font-medium text-destructive transition-all"
              style={{ width: `${riskPercentages.high}%` }}
            >
              {riskPercentages.high}%
            </div>
          )}
          {riskPercentages.critical > 0 && (
            <div
              className="flex items-center justify-center bg-destructive text-xs font-medium text-primary-foreground transition-all"
              style={{ width: `${riskPercentages.critical}%` }}
            >
              {riskPercentages.critical}%
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4">
          {(["low", "medium", "high", "critical"] as const).map((level) => (
            <div key={level} className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-sm ${
                  level === "low"
                    ? "bg-primary/80"
                    : level === "medium"
                    ? "bg-chart-4/80"
                    : level === "high"
                    ? "bg-destructive/60"
                    : "bg-destructive"
                }`}
              />
              <span className="text-sm text-muted-foreground">
                {getRiskLevelLabel(level)} ({riskDistribution[level]})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Alerts by type */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Alerte pe tip
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Cele mai frecvente tipuri de alerte
          </p>
          <div className="mt-5 space-y-3">
            {alertTypeCounts.map(([type, count]) => (
              <div key={type} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">
                    {getAlertTypeLabel(type as AlertType)}
                  </span>
                  <span className="font-medium text-foreground">{count}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{
                      width: `${(count / maxAlertTypeCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts by severity */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Alerte pe severitate
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Distribuția alertelor pe nivel de gravitate
          </p>
          <div className="mt-5 space-y-4">
            {(
              [
                {
                  key: "critical" as const,
                  label: "Critice",
                  colorBar: "bg-destructive",
                  colorBadge: "bg-destructive/10 text-destructive",
                },
                {
                  key: "warning" as const,
                  label: "Avertizări",
                  colorBar: "bg-chart-4",
                  colorBadge: "bg-chart-4/10 text-chart-4",
                },
                {
                  key: "info" as const,
                  label: "Informative",
                  colorBar: "bg-primary",
                  colorBadge: "bg-primary/10 text-primary",
                },
              ] as const
            ).map((item) => (
              <div key={item.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${item.colorBadge}`}
                    >
                      {item.label}
                    </span>
                  </div>
                  <span className="font-medium text-foreground">
                    {alertsBySeverity[item.key]}
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${item.colorBar} transition-all`}
                    style={{
                      width: `${
                        maxSeverityCount > 0
                          ? (alertsBySeverity[item.key] / maxSeverityCount) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Donut-style summary */}
          <div className="mt-6 flex items-center justify-center gap-6 rounded-xl bg-muted/30 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">
                {alertsBySeverity.critical}
              </div>
              <div className="text-xs text-muted-foreground">Critice</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-4">
                {alertsBySeverity.warning}
              </div>
              <div className="text-xs text-muted-foreground">Avertizări</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {alertsBySeverity.info}
              </div>
              <div className="text-xs text-muted-foreground">Info</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Risky Companies */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-foreground">
          Top firme riscante
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Firmele cu cele mai mici scoruri de risc din portofoliu
        </p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 text-left text-sm text-muted-foreground">
                <th className="pb-3 font-medium">#</th>
                <th className="pb-3 font-medium">Firmă</th>
                <th className="pb-3 font-medium">CUI</th>
                <th className="pb-3 font-medium">Scor</th>
                <th className="pb-3 font-medium">Nivel risc</th>
                <th className="pb-3 font-medium">Alerte</th>
              </tr>
            </thead>
            <tbody>
              {topRisky.map((company, index) => (
                <tr
                  key={company.id}
                  className="border-b border-border/30 last:border-0"
                >
                  <td className="py-3 text-sm text-muted-foreground">
                    {index + 1}
                  </td>
                  <td className="py-3">
                    <span className="text-sm font-medium text-foreground">
                      {company.name}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">
                    {company.cui}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all ${
                            company.riskScore >= 70
                              ? "bg-primary"
                              : company.riskScore >= 40
                              ? "bg-chart-4"
                              : "bg-destructive"
                          }`}
                          style={{ width: `${company.riskScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {company.riskScore}
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${getRiskLevelColor(
                        company.riskLevel
                      )}`}
                    >
                      {getRiskLevelLabel(company.riskLevel)}
                    </span>
                  </td>
                  <td className="py-3">
                    {company.alertCount > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                        {company.alertCount}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">0</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
