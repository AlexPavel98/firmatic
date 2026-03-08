"use client";

import { useState, useCallback } from "react";
import {
  Plus,
  Trash2,
  Save,
  Send,
  Download,
  Search,
  Loader2,
  FileText,
  Building2,
  Users,
  ShoppingCart,
  StickyNote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { InvoicePreview } from "@/components/dashboard/invoice-preview";
import {
  type Invoice,
  type InvoiceItem,
  calculateInvoiceTotals,
  generateInvoiceXML,
} from "@/lib/invoice";

// ─── Default empty item ─────────────────────────────────────────────────────

function emptyItem(): InvoiceItem {
  return { description: "", quantity: 1, unitPrice: 0, vatRate: 19, total: 0 };
}

// ─── Default invoice ─────────────────────────────────────────────────────────

function defaultInvoice(): Invoice {
  const today = new Date().toISOString().split("T")[0];
  const due = new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];

  return {
    series: "FRM",
    number: 1,
    date: today,
    dueDate: due,
    supplierName: "",
    supplierCUI: "",
    supplierRegCom: "",
    supplierAddress: "",
    supplierBank: "",
    supplierIBAN: "",
    clientName: "",
    clientCUI: "",
    clientRegCom: "",
    clientAddress: "",
    items: [emptyItem()],
    subtotal: 0,
    totalVAT: 0,
    total: 0,
    currency: "RON",
    notes: "",
    status: "draft",
  };
}

// ─── VAT options ─────────────────────────────────────────────────────────────

const VAT_OPTIONS = [
  { value: 19, label: "19%" },
  { value: 9, label: "9%" },
  { value: 5, label: "5%" },
  { value: 0, label: "0%" },
];

// ─── Section wrapper ────────────────────────────────────────────────────────

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ─── Field row helper ────────────────────────────────────────────────────────

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function NouFacturaPage() {
  const [invoice, setInvoice] = useState<Invoice>(defaultInvoice);
  const [cuiLoading, setCuiLoading] = useState(false);
  const [cuiError, setCuiError] = useState("");
  const [saving, setSaving] = useState(false);

  // ── Update helpers ──

  const update = useCallback(
    (partial: Partial<Invoice>) => {
      setInvoice((prev) => {
        const next = { ...prev, ...partial };
        // Recalculate totals whenever items or anything changes
        const totals = calculateInvoiceTotals(next.items);
        return { ...next, ...totals };
      });
    },
    []
  );

  const updateItem = useCallback(
    (index: number, partial: Partial<InvoiceItem>) => {
      setInvoice((prev) => {
        const items = prev.items.map((item, i) =>
          i === index ? { ...item, ...partial } : item
        );
        // Recalculate each line total
        const updatedItems = items.map((item) => ({
          ...item,
          total: item.quantity * item.unitPrice,
        }));
        const totals = calculateInvoiceTotals(updatedItems);
        return { ...prev, items: updatedItems, ...totals };
      });
    },
    []
  );

  const addItem = useCallback(() => {
    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, emptyItem()],
    }));
  }, []);

  const removeItem = useCallback(
    (index: number) => {
      setInvoice((prev) => {
        const items = prev.items.filter((_, i) => i !== index);
        if (items.length === 0) items.push(emptyItem());
        const totals = calculateInvoiceTotals(items);
        return { ...prev, items, ...totals };
      });
    },
    []
  );

  // ── CUI verification ──

  async function handleVerificaCUI() {
    const cui = invoice.clientCUI.trim();
    if (!cui) {
      setCuiError("Introduceti CUI-ul clientului.");
      return;
    }

    setCuiLoading(true);
    setCuiError("");

    try {
      const res = await fetch("/api/verificare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cui }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCuiError(data.error || "Eroare la verificare.");
        return;
      }

      if (data.company) {
        update({
          clientName: data.company.denumire || "",
          clientCUI: String(data.company.cui),
          clientRegCom: data.company.nrRegCom || "",
          clientAddress: data.company.adresa || "",
        });
      }
    } catch {
      setCuiError("Eroare de retea. Incercati din nou.");
    } finally {
      setCuiLoading(false);
    }
  }

  // ── Save draft ──

  async function handleSaveDraft() {
    setSaving(true);
    try {
      const res = await fetch("/api/facturi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...invoice, status: "draft" }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Eroare la salvare.");
        return;
      }

      update({ id: data.invoice.id, status: "draft" });
      alert("Factura a fost salvata ca ciorna.");
    } catch {
      alert("Eroare de retea.");
    } finally {
      setSaving(false);
    }
  }

  // ── Download XML ──

  function handleDownloadXML() {
    try {
      const xml = generateInvoiceXML(invoice);
      const blob = new Blob([xml], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${invoice.series}-${String(invoice.number).padStart(5, "0")}.xml`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Eroare la generarea XML.");
    }
  }

  // ── Send to ANAF (placeholder) ──

  function handleSendANAF() {
    alert(
      "Trimiterea catre ANAF e-Factura va fi disponibila dupa integrarea cu API-ul ANAF SPV."
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Factura noua
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Completeaza datele si previzualizeaza factura in timp real
          </p>
        </div>
        <Badge variant="secondary" className="w-fit">
          {invoice.currency}
        </Badge>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">
        {/* ─── LEFT: Form ──────────────────────────────── */}
        <div className="space-y-5">
          {/* ── Detalii factura ── */}
          <Section title="Detalii factura" icon={FileText}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Field label="Serie">
                <Input
                  value={invoice.series}
                  onChange={(e) => update({ series: e.target.value })}
                  placeholder="FRM"
                />
              </Field>
              <Field label="Numar">
                <Input
                  type="number"
                  value={invoice.number}
                  onChange={(e) =>
                    update({ number: parseInt(e.target.value) || 0 })
                  }
                  min={1}
                />
              </Field>
              <Field label="Data emiterii">
                <Input
                  type="date"
                  value={invoice.date}
                  onChange={(e) => update({ date: e.target.value })}
                />
              </Field>
              <Field label="Scadenta">
                <Input
                  type="date"
                  value={invoice.dueDate}
                  onChange={(e) => update({ dueDate: e.target.value })}
                />
              </Field>
            </div>
            <div className="mt-3">
              <Field label="Moneda">
                <div className="flex gap-2">
                  {(["RON", "EUR"] as const).map((c) => (
                    <Button
                      key={c}
                      variant={invoice.currency === c ? "default" : "outline"}
                      size="sm"
                      onClick={() => update({ currency: c })}
                    >
                      {c}
                    </Button>
                  ))}
                </div>
              </Field>
            </div>
          </Section>

          {/* ── Date furnizor ── */}
          <Section title="Date furnizor" icon={Building2}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Denumire firma">
                <Input
                  value={invoice.supplierName}
                  onChange={(e) => update({ supplierName: e.target.value })}
                  placeholder="SC Firma Mea SRL"
                />
              </Field>
              <Field label="CUI">
                <Input
                  value={invoice.supplierCUI}
                  onChange={(e) => update({ supplierCUI: e.target.value })}
                  placeholder="RO12345678"
                />
              </Field>
              <Field label="Nr. Reg. Com.">
                <Input
                  value={invoice.supplierRegCom}
                  onChange={(e) => update({ supplierRegCom: e.target.value })}
                  placeholder="J40/1234/2020"
                />
              </Field>
              <Field label="Adresa">
                <Input
                  value={invoice.supplierAddress}
                  onChange={(e) => update({ supplierAddress: e.target.value })}
                  placeholder="Str. Exemplu nr. 1, Bucuresti"
                />
              </Field>
              <Field label="Banca">
                <Input
                  value={invoice.supplierBank}
                  onChange={(e) => update({ supplierBank: e.target.value })}
                  placeholder="Banca Transilvania"
                />
              </Field>
              <Field label="IBAN">
                <Input
                  value={invoice.supplierIBAN}
                  onChange={(e) => update({ supplierIBAN: e.target.value })}
                  placeholder="RO49AAAA1B31007593840000"
                />
              </Field>
            </div>
          </Section>

          {/* ── Date client ── */}
          <Section title="Date client" icon={Users}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="CUI client" className="sm:col-span-2">
                <div className="flex gap-2">
                  <Input
                    value={invoice.clientCUI}
                    onChange={(e) => {
                      update({ clientCUI: e.target.value });
                      setCuiError("");
                    }}
                    placeholder="12345678 sau RO12345678"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="default"
                    onClick={handleVerificaCUI}
                    disabled={cuiLoading}
                  >
                    {cuiLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    <span className="ml-1.5 hidden sm:inline">Verifica</span>
                  </Button>
                </div>
                {cuiError && (
                  <p className="mt-1 text-xs text-destructive">{cuiError}</p>
                )}
              </Field>
              <Field label="Denumire client">
                <Input
                  value={invoice.clientName}
                  onChange={(e) => update({ clientName: e.target.value })}
                  placeholder="SC Client SRL"
                />
              </Field>
              <Field label="Nr. Reg. Com.">
                <Input
                  value={invoice.clientRegCom}
                  onChange={(e) => update({ clientRegCom: e.target.value })}
                  placeholder="J40/5678/2021"
                />
              </Field>
              <Field label="Adresa" className="sm:col-span-2">
                <Input
                  value={invoice.clientAddress}
                  onChange={(e) => update({ clientAddress: e.target.value })}
                  placeholder="Adresa clientului"
                />
              </Field>
            </div>
          </Section>

          {/* ── Produse / Servicii ── */}
          <Section title="Produse / Servicii" icon={ShoppingCart}>
            <div className="space-y-3">
              {/* Table header — desktop */}
              <div className="hidden grid-cols-[1fr_80px_100px_90px_100px_36px] items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:grid">
                <span>Descriere</span>
                <span className="text-right">Cantitate</span>
                <span className="text-right">Pret unitar</span>
                <span className="text-right">TVA</span>
                <span className="text-right">Total linie</span>
                <span />
              </div>

              {invoice.items.map((item, i) => {
                const lineTotal = item.quantity * item.unitPrice;
                return (
                  <div
                    key={i}
                    className="grid grid-cols-2 gap-2 rounded-lg border border-border/50 bg-background/50 p-3 sm:grid-cols-[1fr_80px_100px_90px_100px_36px] sm:items-center sm:border-0 sm:bg-transparent sm:p-0"
                  >
                    <div className="col-span-2 sm:col-span-1">
                      <label className="mb-1 block text-[10px] text-muted-foreground sm:hidden">
                        Descriere
                      </label>
                      <Input
                        value={item.description}
                        onChange={(e) =>
                          updateItem(i, { description: e.target.value })
                        }
                        placeholder="Denumire produs/serviciu"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] text-muted-foreground sm:hidden">
                        Cant.
                      </label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(i, {
                            quantity: parseFloat(e.target.value) || 0,
                          })
                        }
                        min={0}
                        step="0.01"
                        className="text-right"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] text-muted-foreground sm:hidden">
                        Pret unitar
                      </label>
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(i, {
                            unitPrice: parseFloat(e.target.value) || 0,
                          })
                        }
                        min={0}
                        step="0.01"
                        className="text-right"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] text-muted-foreground sm:hidden">
                        TVA
                      </label>
                      <select
                        value={item.vatRate}
                        onChange={(e) =>
                          updateItem(i, {
                            vatRate: parseInt(e.target.value),
                          })
                        }
                        className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        {VAT_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center justify-end">
                      <span className="text-sm font-medium text-foreground">
                        {lineTotal.toLocaleString("ro-RO", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeItem(i)}
                        className="text-muted-foreground hover:text-destructive"
                        title="Sterge randul"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={addItem}
                className="mt-2 w-full"
              >
                <Plus className="h-4 w-4" />
                Adauga produs/serviciu
              </Button>
            </div>
          </Section>

          {/* ── Observatii ── */}
          <Section title="Observatii" icon={StickyNote}>
            <textarea
              value={invoice.notes}
              onChange={(e) => update({ notes: e.target.value })}
              placeholder="Observatii suplimentare (optional)..."
              rows={3}
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </Section>

          {/* ── Action buttons ── */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              size="lg"
              onClick={handleSaveDraft}
              disabled={saving}
              className="flex-1"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Salveaza ciorna
            </Button>
            <Button
              variant="default"
              size="lg"
              onClick={handleSendANAF}
              className="flex-1"
            >
              <Send className="h-4 w-4" />
              Trimite la ANAF (e-Factura)
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleDownloadXML}
              className="flex-1"
            >
              <Download className="h-4 w-4" />
              Descarca XML
            </Button>
          </div>
        </div>

        {/* ─── RIGHT: Live preview ──────────────────── */}
        <div className="xl:sticky xl:top-6 xl:self-start">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Previzualizare
          </p>
          <InvoicePreview invoice={invoice} />
        </div>
      </div>
    </div>
  );
}
