"use client";

import { Badge } from "@/components/ui/badge";
import {
  type Invoice,
  formatRON,
  formatInvoiceNumber,
  STATUS_LABELS,
  STATUS_VARIANTS,
} from "@/lib/invoice";

interface InvoicePreviewProps {
  invoice: Invoice;
}

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const hasItems = invoice.items.length > 0 && invoice.items.some((i) => i.description);

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">FACTURA</h2>
          <p className="mt-1 text-sm font-medium text-primary">
            {invoice.series && invoice.number
              ? formatInvoiceNumber(invoice.series, invoice.number)
              : "---"}
          </p>
        </div>
        <Badge variant={STATUS_VARIANTS[invoice.status]}>
          {STATUS_LABELS[invoice.status]}
        </Badge>
      </div>

      {/* Dates */}
      <div className="mt-4 flex gap-6 text-xs text-muted-foreground">
        <div>
          <span className="font-medium">Data emiterii:</span>{" "}
          {invoice.date
            ? new Date(invoice.date).toLocaleDateString("ro-RO")
            : "---"}
        </div>
        <div>
          <span className="font-medium">Scadenta:</span>{" "}
          {invoice.dueDate
            ? new Date(invoice.dueDate).toLocaleDateString("ro-RO")
            : "---"}
        </div>
      </div>

      {/* Divider */}
      <div className="my-5 h-px bg-border" />

      {/* Supplier & Client */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Supplier */}
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Furnizor
          </p>
          <p className="text-sm font-semibold text-foreground">
            {invoice.supplierName || "---"}
          </p>
          {invoice.supplierCUI && (
            <p className="text-xs text-muted-foreground">
              CUI: {invoice.supplierCUI}
            </p>
          )}
          {invoice.supplierRegCom && (
            <p className="text-xs text-muted-foreground">
              Reg. Com.: {invoice.supplierRegCom}
            </p>
          )}
          {invoice.supplierAddress && (
            <p className="mt-1 text-xs text-muted-foreground">
              {invoice.supplierAddress}
            </p>
          )}
          {invoice.supplierBank && (
            <p className="text-xs text-muted-foreground">
              Banca: {invoice.supplierBank}
            </p>
          )}
          {invoice.supplierIBAN && (
            <p className="text-xs font-mono text-muted-foreground">
              IBAN: {invoice.supplierIBAN}
            </p>
          )}
        </div>

        {/* Client */}
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Client
          </p>
          <p className="text-sm font-semibold text-foreground">
            {invoice.clientName || "---"}
          </p>
          {invoice.clientCUI && (
            <p className="text-xs text-muted-foreground">
              CUI: {invoice.clientCUI}
            </p>
          )}
          {invoice.clientRegCom && (
            <p className="text-xs text-muted-foreground">
              Reg. Com.: {invoice.clientRegCom}
            </p>
          )}
          {invoice.clientAddress && (
            <p className="mt-1 text-xs text-muted-foreground">
              {invoice.clientAddress}
            </p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="my-5 h-px bg-border" />

      {/* Items Table */}
      {hasItems ? (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="pb-2 pr-4">Nr.</th>
                <th className="pb-2 pr-4">Descriere</th>
                <th className="pb-2 pr-4 text-right">Cant.</th>
                <th className="pb-2 pr-4 text-right">Pret unit.</th>
                <th className="pb-2 pr-4 text-right">TVA</th>
                <th className="pb-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => {
                if (!item.description) return null;
                const lineTotal = item.quantity * item.unitPrice;
                return (
                  <tr
                    key={i}
                    className="border-b border-border/50 text-foreground"
                  >
                    <td className="py-2 pr-4 text-muted-foreground">
                      {i + 1}
                    </td>
                    <td className="py-2 pr-4 font-medium">
                      {item.description}
                    </td>
                    <td className="py-2 pr-4 text-right">{item.quantity}</td>
                    <td className="py-2 pr-4 text-right">
                      {formatRON(item.unitPrice, invoice.currency)}
                    </td>
                    <td className="py-2 pr-4 text-right">{item.vatRate}%</td>
                    <td className="py-2 text-right font-medium">
                      {formatRON(lineTotal, invoice.currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-border">
          <p className="text-xs text-muted-foreground">
            Adaugati produse sau servicii...
          </p>
        </div>
      )}

      {/* Totals */}
      <div className="mt-5 flex justify-end">
        <div className="w-full max-w-xs space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Subtotal:</span>
            <span>{formatRON(invoice.subtotal, invoice.currency)}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>TVA:</span>
            <span>{formatRON(invoice.totalVAT, invoice.currency)}</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex justify-between text-sm font-bold text-foreground">
            <span>TOTAL:</span>
            <span className="text-primary">
              {formatRON(invoice.total, invoice.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <>
          <div className="my-5 h-px bg-border" />
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Observatii
            </p>
            <p className="text-xs text-muted-foreground whitespace-pre-wrap">
              {invoice.notes}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
