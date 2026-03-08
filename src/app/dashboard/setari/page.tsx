"use client";

import { useState } from "react";
import {
  Settings,
  Building2,
  Bell,
  CreditCard,
  Key,
  UserCog,
  Copy,
  RefreshCw,
  Trash2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ALERT_TYPE_META, type AlertType } from "@/lib/monitoring";

export default function SetariPage() {
  const [copied, setCopied] = useState(false);
  const [notifSettings, setNotifSettings] = useState<
    Record<AlertType, boolean>
  >({
    tva_status_change: true,
    fiscal_inactive: true,
    efactura_change: true,
    insolvency_filed: true,
    court_case_new: true,
    financial_decline: true,
    risk_score_change: false,
    address_change: false,
    admin_change: true,
    debt_increase: true,
  });

  function toggleNotif(type: AlertType) {
    setNotifSettings((prev) => ({ ...prev, [type]: !prev[type] }));
  }

  function handleCopyKey() {
    navigator.clipboard.writeText("frmtc_sk_xxxxxxxxxxxxxxxxxxxx");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Setări
        </h1>
        <p className="mt-1 text-muted-foreground">
          Configurează profilul firmei, notificările și contul tău.
        </p>
      </div>

      {/* Profil firmă */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Profil firmă</h2>
            <p className="text-sm text-muted-foreground">
              Datele firmei tale pentru auto-completare pe facturi
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Denumire firmă
            </label>
            <Input
              defaultValue="SC Exemplu Tech SRL"
              className="h-9 rounded-lg"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              CUI
            </label>
            <Input
              defaultValue="RO12345678"
              className="h-9 rounded-lg"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Nr. Reg. Comerț
            </label>
            <Input
              defaultValue="J40/1234/2020"
              className="h-9 rounded-lg"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Adresă sediu social
            </label>
            <Input
              defaultValue="Str. Exemplu 10, București"
              className="h-9 rounded-lg"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Banca
            </label>
            <Input
              defaultValue="Banca Transilvania"
              className="h-9 rounded-lg"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              IBAN
            </label>
            <Input
              defaultValue="RO49BTRLRONCRT0000000000"
              className="h-9 rounded-lg"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button className="btn-hover rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
            Salvează
          </Button>
        </div>
      </div>

      {/* Preferințe notificări */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">
              Preferințe notificări
            </h2>
            <p className="text-sm text-muted-foreground">
              Alege ce tipuri de alerte vrei să primești
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {(Object.keys(ALERT_TYPE_META) as AlertType[]).map((type) => (
            <div
              key={type}
              className="flex items-center justify-between rounded-xl px-3 py-2 transition-colors hover:bg-muted/30"
            >
              <span className="text-sm text-foreground">
                {ALERT_TYPE_META[type].label}
              </span>
              <button
                onClick={() => toggleNotif(type)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  notifSettings[type] ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background shadow-sm transition-transform ${
                    notifSettings[type] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Abonament */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Abonament</h2>
            <p className="text-sm text-muted-foreground">
              Planul tău actual și utilizarea
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-border/50 bg-muted/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-semibold text-foreground">
                Plan Gratuit
              </span>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Funcționalități de bază pentru verificare și monitorizare
              </p>
            </div>
            <Button className="btn-hover rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
              Upgrade
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Verificări luna aceasta
                </span>
                <span className="font-medium text-foreground">12 / 50</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: "24%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Firme monitorizate
                </span>
                <span className="font-medium text-foreground">6 / 10</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: "60%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Facturi emise luna aceasta
                </span>
                <span className="font-medium text-foreground">0 / 5</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: "0%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Access */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Key className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Acces API</h2>
            <p className="text-sm text-muted-foreground">
              Cheia ta API pentru integrări externe
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <Input
            readOnly
            value="frmtc_sk_xxxxxxxxxxxxxxxxxxxx"
            className="h-9 flex-1 rounded-lg font-mono text-sm"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyKey}
            className="h-9 gap-1.5 rounded-lg"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copiat
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copiază
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 rounded-lg"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Regenerează
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Nu partaja cheia API cu nimeni. Regenerarea invalidează cheia anterioară.
        </p>
      </div>

      {/* Cont */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <UserCog className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Cont</h2>
            <p className="text-sm text-muted-foreground">
              Gestionează contul tău Firmatic
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              defaultValue="exemplu@firma.ro"
              className="h-9 max-w-sm rounded-lg"
              readOnly
            />
          </div>

          <Button
            variant="outline"
            className="btn-hover rounded-xl"
          >
            Schimbă parola
          </Button>
        </div>

        {/* Danger zone */}
        <div className="mt-6 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <h3 className="text-sm font-semibold text-destructive">
            Zonă periculoasă
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Ștergerea contului este permanentă și nu poate fi anulată. Toate
            datele, facturile și istoricul vor fi pierdute.
          </p>
          <Button
            variant="outline"
            className="btn-hover mt-3 gap-1.5 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Șterge contul
          </Button>
        </div>
      </div>
    </div>
  );
}
