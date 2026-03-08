import { NextRequest, NextResponse } from "next/server";
import { type Invoice } from "@/lib/invoice";

/**
 * GET /api/facturi
 *
 * List all invoices. Returns empty array placeholder (Supabase integration later).
 */
export async function GET() {
  // TODO: Query invoices from Supabase
  const invoices: Invoice[] = [];
  return NextResponse.json({ invoices });
}

/**
 * POST /api/facturi
 *
 * Save a new invoice. For now returns the invoice with a generated ID.
 * Supabase persistence will be added later.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const invoice = body as Invoice;

    // Basic validation
    if (!invoice.series || !invoice.number) {
      return NextResponse.json(
        { error: "Seria si numarul facturii sunt obligatorii." },
        { status: 400 }
      );
    }

    if (!invoice.items || invoice.items.length === 0) {
      return NextResponse.json(
        { error: "Factura trebuie sa contina cel putin un produs/serviciu." },
        { status: 400 }
      );
    }

    if (!invoice.clientName || !invoice.clientCUI) {
      return NextResponse.json(
        { error: "Datele clientului sunt obligatorii (denumire si CUI)." },
        { status: 400 }
      );
    }

    // Generate a temporary ID (will be replaced by Supabase UUID)
    const id = `INV-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const savedInvoice: Invoice = {
      ...invoice,
      id,
      status: invoice.status || "draft",
    };

    // TODO: Insert into Supabase
    // const supabase = await createClient();
    // const { data, error } = await supabase.from('invoices').insert(savedInvoice);

    return NextResponse.json({ invoice: savedInvoice }, { status: 201 });
  } catch (error) {
    console.error("[/api/facturi] Error:", error);
    return NextResponse.json(
      { error: "Eroare interna a serverului." },
      { status: 500 }
    );
  }
}
