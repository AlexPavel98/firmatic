"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Bell,
  ShieldCheck,
  AlertTriangle,
  Eye,
  FileText,
  Trash2,
  Pause,
  Play,
  X,
  CheckCircle,
  Info,
  Clock,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MOCK_MONITORED_COMPANIES,
  MOCK_ALERTS,
  getRiskLevelColor,
  getRiskLevelLabel,
  getAlertSeverityColor,
  getAlertTypeLabel,
  formatTimeAgo,
  type MonitoredCompany,
  type Alert,
} from "@/lib/monitoring";

type RiskFilter = "all" | "low" | "medium" | "high" | "critical";

export default function MonitorizarePage() {
  const [companies, setCompanies] = useState<MonitoredCompany[]>(
    MOCK_MONITORED_COMPANIES
  );
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [filter, setFilter] = useState<RiskFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addCUI, setAddCUI] = useState("");

  const filteredCompanies = companies.filter((c) => {
    const matchesFilter = filter === "all" || c.riskLevel === filter;
    const matchesSearch =
      searchQuery === "" ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.cui.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const unreadAlerts = alerts.filter((a) => !a.read).length;
  const avgRisk = Math.round(
    companies.reduce((sum, c) => sum + c.riskScore, 0) / companies.length
  );
  const highRiskCount = companies.filter(
    (c) => c.riskLevel === "high" || c.riskLevel === "critical"
  ).length;

  function toggleStatus(id: string) {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "active" ? "paused" : "active" }
          : c
      )
    );
  }

  function removeCompany(id: string) {
    setCompanies((prev) => prev.filter((c) => c.id !== id));
  }

  function markAlertRead(id: string) {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  }

  function getSeverityIcon(severity: Alert["severity"]) {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4" />;
      case "warning":
        return <Bell className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
    }
  }

  const filters: { key: RiskFilter; label: string }[] = [
    { key: "all", label: "Toate" },
    { key: "low", label: "Risc scăzut" },
    { key: "medium", label: "Risc mediu" },
    { key: "high", label: "Risc ridicat" },
    { key: "critical", label: "Critic" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Monitorizare firme
          </h1>
          <p className="mt-1 text-muted-foreground">
            Primești alerte automate când se schimbă ceva la firmele
            monitorizate.
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="btn-hover rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Adaugă firmă
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Firme monitorizate
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-foreground">
            {companies.length}
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Alerte noi</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/10">
              <Bell className="h-4 w-4 text-destructive" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-foreground">
            {unreadAlerts}
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
              Firme risc ridicat
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/10">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-foreground">
            {highRiskCount}
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                filter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Caută firmă sau CUI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 rounded-lg pl-9"
          />
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left: Company cards */}
        <div className="space-y-4">
          {filteredCompanies.length === 0 ? (
            <div className="glass-card flex flex-col items-center justify-center rounded-2xl py-16 text-center">
              <Search className="h-8 w-8 text-muted-foreground" />
              <p className="mt-4 font-medium text-foreground">
                Nicio firmă găsită
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Încearcă să schimbi filtrele sau termenul de căutare.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  className="glass-card rounded-2xl p-5"
                >
                  {/* Top row: name + status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold text-foreground">
                        {company.name}
                      </h3>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        CUI: {company.cui}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleStatus(company.id)}
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        company.status === "active"
                          ? "bg-primary/10 text-primary hover:bg-primary/20"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                      title={
                        company.status === "active"
                          ? "Pauză monitorizare"
                          : "Reia monitorizarea"
                      }
                    >
                      {company.status === "active" ? (
                        <Pause className="h-3.5 w-3.5" />
                      ) : (
                        <Play className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Risk score row */}
                  <div className="mt-4 flex items-center gap-3">
                    <div
                      className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-sm font-semibold ${getRiskLevelColor(
                        company.riskLevel
                      )}`}
                    >
                      {company.riskScore}/100
                    </div>
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold ${getRiskLevelColor(
                        company.riskLevel
                      )}`}
                    >
                      {company.riskGrade}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {getRiskLevelLabel(company.riskLevel)}
                    </span>
                    {company.alertCount > 0 && (
                      <span className="ml-auto flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                        <Bell className="h-3 w-3" />
                        {company.alertCount}
                      </span>
                    )}
                  </div>

                  {/* Last checked */}
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Verificat: {formatTimeAgo(company.lastChecked)}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2 border-t border-border/50 pt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 flex-1 gap-1.5 rounded-lg text-xs"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Verifică
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 flex-1 gap-1.5 rounded-lg text-xs"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Facturi
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCompany(company.id)}
                      className="h-8 gap-1.5 rounded-lg text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Alerts feed */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Alerte recente</h2>
            {unreadAlerts > 0 && (
              <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                {unreadAlerts} noi
              </span>
            )}
          </div>

          <div className="mt-4 max-h-[600px] space-y-3 overflow-y-auto pr-1">
            {alerts.map((alert) => (
              <button
                key={alert.id}
                onClick={() => markAlertRead(alert.id)}
                className={`group w-full rounded-xl p-3 text-left transition-all ${
                  alert.read
                    ? "bg-transparent hover:bg-muted/50"
                    : "bg-muted/50 hover:bg-muted/80"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${getAlertSeverityColor(
                      alert.severity
                    )}`}
                  >
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        {alert.companyName}
                      </span>
                      {!alert.read && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {alert.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatTimeAgo(alert.createdAt)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add company modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="glass-card mx-4 w-full max-w-md rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Adaugă firmă la monitorizare
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Introdu CUI-ul firmei pe care vrei să o monitorizezi.
            </p>

            <div className="mt-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Introdu CUI (ex: 14399840)"
                  value={addCUI}
                  onChange={(e) => setAddCUI(e.target.value)}
                  className="h-10 rounded-xl pl-9"
                />
              </div>

              {/* Mini preview when CUI is entered */}
              {addCUI.length >= 6 && (
                <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        SC Exemplu Business SRL
                      </p>
                      <p className="text-sm text-muted-foreground">
                        CUI: {addCUI} &middot; J40/1234/2018
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-primary" />
                      Platitor TVA
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-primary" />
                      Activ fiscal
                    </span>
                  </div>
                </div>
              )}

              <Button
                disabled={addCUI.length < 6}
                onClick={() => {
                  setShowAddModal(false);
                  setAddCUI("");
                }}
                className="btn-hover w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adaugă la monitorizare
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
