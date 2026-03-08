import { NextRequest, NextResponse } from "next/server";
import { getCompaniesByCUI, normalizeCUI } from "@/lib/anaf";
import { calculateRiskScore } from "@/lib/risk-score";

/**
 * POST /api/verificare/bulk
 *
 * Verifies multiple companies by CUI using the ANAF public API.
 * ANAF allows max 500 CUIs per request.
 *
 * Body: { "cuiList": ["12345678", "RO87654321", ...] }
 * Returns: { results: Array<{ company, risk }>, notFound: Array<{ cui, data }> }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cuiList } = body;

    if (!Array.isArray(cuiList) || cuiList.length === 0) {
      return NextResponse.json(
        { error: "cuiList trebuie sa fie un array non-gol de CUI-uri." },
        { status: 400 }
      );
    }

    if (cuiList.length > 500) {
      return NextResponse.json(
        {
          error: `ANAF permite maxim 500 de CUI-uri per request. Ai trimis ${cuiList.length}.`,
        },
        { status: 400 }
      );
    }

    // Validate each CUI
    const invalid: string[] = [];
    for (const cui of cuiList) {
      if (typeof cui !== "string") {
        invalid.push(String(cui));
        continue;
      }
      const cleaned = cui.trim().toUpperCase().replace(/^RO/, "");
      if (!/^\d{1,10}$/.test(cleaned)) {
        invalid.push(cui);
      }
    }

    if (invalid.length > 0) {
      return NextResponse.json(
        {
          error: `CUI-uri invalide: ${invalid.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate normalization
    try {
      cuiList.forEach((cui: string) => normalizeCUI(cui));
    } catch (err) {
      return NextResponse.json(
        {
          error:
            err instanceof Error ? err.message : "CUI-uri invalide.",
        },
        { status: 400 }
      );
    }

    const response = await getCompaniesByCUI(cuiList);

    const results = (response.found || []).map((company) => ({
      company,
      risk: calculateRiskScore(company),
    }));

    return NextResponse.json({
      results,
      notFound: response.notFound || [],
    });
  } catch (error) {
    console.error("[/api/verificare/bulk] Error:", error);

    const message =
      error instanceof Error ? error.message : "Eroare necunoscuta.";

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
