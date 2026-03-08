import { NextRequest, NextResponse } from "next/server";
import { getCompanyByCUI, normalizeCUI } from "@/lib/anaf";
import { calculateRiskScore } from "@/lib/risk-score";

/**
 * POST /api/verificare
 *
 * Verifies a single company by CUI using the ANAF public API.
 *
 * Body: { "cui": "12345678" }  — optionally prefixed with "RO"
 * Returns: { company: ANAFCompany, risk: RiskScore } or error
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cui } = body;

    if (!cui || typeof cui !== "string") {
      return NextResponse.json(
        { error: "CUI-ul este obligatoriu." },
        { status: 400 }
      );
    }

    // Strip RO prefix and validate
    const cleaned = cui.trim().toUpperCase().replace(/^RO/, "");

    // Must be numeric, 1-10 digits
    if (!/^\d{1,10}$/.test(cleaned)) {
      return NextResponse.json(
        {
          error:
            "CUI invalid. Trebuie sa fie numeric, intre 1 si 10 cifre (optional prefixat cu RO).",
        },
        { status: 400 }
      );
    }

    // Validate it parses correctly
    try {
      normalizeCUI(cui);
    } catch {
      return NextResponse.json(
        { error: "CUI invalid." },
        { status: 400 }
      );
    }

    const company = await getCompanyByCUI(cui);

    if (!company) {
      return NextResponse.json(
        { error: `CUI-ul ${cleaned} nu a fost gasit in baza de date ANAF.` },
        { status: 404 }
      );
    }

    const risk = calculateRiskScore(company);

    return NextResponse.json({ company, risk });
  } catch (error) {
    console.error("[/api/verificare] Error:", error);

    const message =
      error instanceof Error ? error.message : "Eroare necunoscuta.";

    // Detect ANAF being down
    if (message.includes("ANAF API error")) {
      return NextResponse.json(
        {
          error:
            "Serviciul ANAF nu este disponibil momentan. Incercati din nou mai tarziu.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: "Eroare interna a serverului." },
      { status: 500 }
    );
  }
}
