/**
 * Invoice types and utilities for e-Factura (ANAF) integration.
 *
 * Generates UBL 2.1 XML compatible with the Romanian e-Factura system.
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number; // 19, 9, 5, or 0
  total: number;
}

export interface Invoice {
  id?: string;
  series: string; // e.g. "FRM"
  number: number;
  date: string; // ISO date
  dueDate: string;
  // Supplier (our user's company)
  supplierName: string;
  supplierCUI: string;
  supplierRegCom: string;
  supplierAddress: string;
  supplierBank: string;
  supplierIBAN: string;
  // Client
  clientName: string;
  clientCUI: string;
  clientRegCom: string;
  clientAddress: string;
  // Items
  items: InvoiceItem[];
  // Totals (calculated)
  subtotal: number;
  totalVAT: number;
  total: number;
  // Meta
  currency: "RON" | "EUR";
  notes: string;
  status:
    | "draft"
    | "sent"
    | "paid"
    | "cancelled"
    | "anaf_sent"
    | "anaf_ok"
    | "anaf_error";
}

// ─── Status Labels ──────────────────────────────────────────────────────────

export const STATUS_LABELS: Record<Invoice["status"], string> = {
  draft: "Ciornă",
  sent: "Trimisă",
  paid: "Plătită",
  cancelled: "Anulată",
  anaf_sent: "Trimisă ANAF",
  anaf_ok: "Acceptată ANAF",
  anaf_error: "Eroare ANAF",
};

export const STATUS_VARIANTS: Record<
  Invoice["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  draft: "secondary",
  sent: "outline",
  paid: "default",
  cancelled: "destructive",
  anaf_sent: "outline",
  anaf_ok: "default",
  anaf_error: "destructive",
};

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Calculate invoice totals from a list of items.
 */
export function calculateInvoiceTotals(items: InvoiceItem[]): {
  subtotal: number;
  totalVAT: number;
  total: number;
} {
  const subtotal = items.reduce((sum, item) => {
    const lineTotal = item.quantity * item.unitPrice;
    return sum + lineTotal;
  }, 0);

  const totalVAT = items.reduce((sum, item) => {
    const lineTotal = item.quantity * item.unitPrice;
    const lineVAT = lineTotal * (item.vatRate / 100);
    return sum + lineVAT;
  }, 0);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    totalVAT: Math.round(totalVAT * 100) / 100,
    total: Math.round((subtotal + totalVAT) * 100) / 100,
  };
}

/**
 * Format a number as Romanian currency: "1.234,56 lei" or "1.234,56 EUR"
 */
export function formatRON(amount: number, currency: "RON" | "EUR" = "RON"): string {
  const formatted = new Intl.NumberFormat("ro-RO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return currency === "RON" ? `${formatted} lei` : `${formatted} EUR`;
}

/**
 * Generate an invoice number string: "FRM-00042"
 */
export function formatInvoiceNumber(series: string, number: number): string {
  return `${series}-${String(number).padStart(5, "0")}`;
}

// ─── UBL 2.1 XML Generation (e-Factura) ─────────────────────────────────────

/**
 * Escape XML special characters.
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Generate UBL 2.1 XML for ANAF e-Factura.
 *
 * This produces the basic structure expected by the Romanian e-Factura system.
 * Reference: https://mfinante.gov.ro/web/efactura
 */
export function generateInvoiceXML(invoice: Invoice): string {
  const invoiceId = formatInvoiceNumber(invoice.series, invoice.number);
  const currencyID = invoice.currency;

  // Build invoice lines
  const lines = invoice.items
    .map((item, index) => {
      const lineExtension = (item.quantity * item.unitPrice).toFixed(2);
      const taxAmount = (
        item.quantity *
        item.unitPrice *
        (item.vatRate / 100)
      ).toFixed(2);

      return `    <cac:InvoiceLine>
      <cbc:ID>${index + 1}</cbc:ID>
      <cbc:InvoicedQuantity unitCode="C62">${item.quantity}</cbc:InvoicedQuantity>
      <cbc:LineExtensionAmount currencyID="${currencyID}">${lineExtension}</cbc:LineExtensionAmount>
      <cac:Item>
        <cbc:Name>${escapeXml(item.description)}</cbc:Name>
        <cac:ClassifiedTaxCategory>
          <cbc:ID>S</cbc:ID>
          <cbc:Percent>${item.vatRate}</cbc:Percent>
          <cac:TaxScheme>
            <cbc:ID>VAT</cbc:ID>
          </cac:TaxScheme>
        </cac:ClassifiedTaxCategory>
      </cac:Item>
      <cac:Price>
        <cbc:PriceAmount currencyID="${currencyID}">${item.unitPrice.toFixed(2)}</cbc:PriceAmount>
      </cac:Price>
      <cac:TaxTotal>
        <cbc:TaxAmount currencyID="${currencyID}">${taxAmount}</cbc:TaxAmount>
      </cac:TaxTotal>
    </cac:InvoiceLine>`;
    })
    .join("\n");

  // Group VAT by rate for TaxTotal section
  const vatGroups: Record<number, { taxable: number; tax: number }> = {};
  for (const item of invoice.items) {
    const lineTotal = item.quantity * item.unitPrice;
    const lineTax = lineTotal * (item.vatRate / 100);
    if (!vatGroups[item.vatRate]) {
      vatGroups[item.vatRate] = { taxable: 0, tax: 0 };
    }
    vatGroups[item.vatRate].taxable += lineTotal;
    vatGroups[item.vatRate].tax += lineTax;
  }

  const taxSubtotals = Object.entries(vatGroups)
    .map(
      ([rate, { taxable, tax }]) => `      <cac:TaxSubtotal>
        <cbc:TaxableAmount currencyID="${currencyID}">${taxable.toFixed(2)}</cbc:TaxableAmount>
        <cbc:TaxAmount currencyID="${currencyID}">${tax.toFixed(2)}</cbc:TaxAmount>
        <cac:TaxCategory>
          <cbc:ID>S</cbc:ID>
          <cbc:Percent>${rate}</cbc:Percent>
          <cac:TaxScheme>
            <cbc:ID>VAT</cbc:ID>
          </cac:TaxScheme>
        </cac:TaxCategory>
      </cac:TaxSubtotal>`
    )
    .join("\n");

  // Supplier CUI — strip "RO" prefix for <cbc:CompanyID>, keep for <cbc:EndpointID>
  const supplierCUIClean = invoice.supplierCUI
    .trim()
    .toUpperCase()
    .replace(/^RO/, "");
  const clientCUIClean = invoice.clientCUI
    .trim()
    .toUpperCase()
    .replace(/^RO/, "");

  return `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:efactura.mfinante.ro:CIUS-RO:1.0.1</cbc:CustomizationID>
  <cbc:ID>${escapeXml(invoiceId)}</cbc:ID>
  <cbc:IssueDate>${invoice.date}</cbc:IssueDate>
  <cbc:DueDate>${invoice.dueDate}</cbc:DueDate>
  <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>
  <cbc:Note>${escapeXml(invoice.notes || "")}</cbc:Note>
  <cbc:DocumentCurrencyCode>${currencyID}</cbc:DocumentCurrencyCode>

  <!-- Furnizor -->
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cbc:EndpointID schemeID="0184">${supplierCUIClean}</cbc:EndpointID>
      <cac:PartyName>
        <cbc:Name>${escapeXml(invoice.supplierName)}</cbc:Name>
      </cac:PartyName>
      <cac:PostalAddress>
        <cbc:StreetName>${escapeXml(invoice.supplierAddress)}</cbc:StreetName>
        <cac:Country>
          <cbc:IdentificationCode>RO</cbc:IdentificationCode>
        </cac:Country>
      </cac:PostalAddress>
      <cac:PartyTaxScheme>
        <cbc:CompanyID>RO${supplierCUIClean}</cbc:CompanyID>
        <cac:TaxScheme>
          <cbc:ID>VAT</cbc:ID>
        </cac:TaxScheme>
      </cac:PartyTaxScheme>
      <cac:PartyLegalEntity>
        <cbc:RegistrationName>${escapeXml(invoice.supplierName)}</cbc:RegistrationName>
        <cbc:CompanyID>${escapeXml(invoice.supplierRegCom)}</cbc:CompanyID>
      </cac:PartyLegalEntity>
    </cac:Party>
  </cac:AccountingSupplierParty>

  <!-- Client -->
  <cac:AccountingCustomerParty>
    <cac:Party>
      <cbc:EndpointID schemeID="0184">${clientCUIClean}</cbc:EndpointID>
      <cac:PartyName>
        <cbc:Name>${escapeXml(invoice.clientName)}</cbc:Name>
      </cac:PartyName>
      <cac:PostalAddress>
        <cbc:StreetName>${escapeXml(invoice.clientAddress)}</cbc:StreetName>
        <cac:Country>
          <cbc:IdentificationCode>RO</cbc:IdentificationCode>
        </cac:Country>
      </cac:PostalAddress>
      <cac:PartyTaxScheme>
        <cbc:CompanyID>RO${clientCUIClean}</cbc:CompanyID>
        <cac:TaxScheme>
          <cbc:ID>VAT</cbc:ID>
        </cac:TaxScheme>
      </cac:PartyTaxScheme>
      <cac:PartyLegalEntity>
        <cbc:RegistrationName>${escapeXml(invoice.clientName)}</cbc:RegistrationName>
        <cbc:CompanyID>${escapeXml(invoice.clientRegCom)}</cbc:CompanyID>
      </cac:PartyLegalEntity>
    </cac:Party>
  </cac:AccountingCustomerParty>

  <!-- Modalitate de plata -->
  <cac:PaymentMeans>
    <cbc:PaymentMeansCode>30</cbc:PaymentMeansCode>
    <cac:PayeeFinancialAccount>
      <cbc:ID>${escapeXml(invoice.supplierIBAN)}</cbc:ID>
      <cbc:Name>${escapeXml(invoice.supplierBank)}</cbc:Name>
    </cac:PayeeFinancialAccount>
  </cac:PaymentMeans>

  <!-- Totaluri TVA -->
  <cac:TaxTotal>
    <cbc:TaxAmount currencyID="${currencyID}">${invoice.totalVAT.toFixed(2)}</cbc:TaxAmount>
${taxSubtotals}
  </cac:TaxTotal>

  <!-- Totaluri monetare -->
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="${currencyID}">${invoice.subtotal.toFixed(2)}</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="${currencyID}">${invoice.subtotal.toFixed(2)}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="${currencyID}">${invoice.total.toFixed(2)}</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount currencyID="${currencyID}">${invoice.total.toFixed(2)}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>

  <!-- Linii factura -->
${lines}
</Invoice>`;
}
