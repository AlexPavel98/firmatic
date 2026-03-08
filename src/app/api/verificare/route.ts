import { NextRequest, NextResponse } from "next/server";
import { getCompanyByCUI, normalizeCUI } from "@/lib/anaf";
import { calculateRiskScore } from "@/lib/risk-score";
import {
  getFinancialsHistory,
  calculateRatios,
  type ParsedFinancials,
  type FinancialRatios,
} from "@/lib/anaf-bilant";
import { searchCourtCases, type CourtCaseSummary } from "@/lib/portal-just";

/**
 * POST /api/verificare
 *
 * Verifies a single company by CUI using the ANAF public API,
 * enriched with financial history and court case data.
 *
 * Body: { "cui": "12345678" }  — optionally prefixed with "RO"
 * Returns: { company, risk, financials, courtCases, ratios } or error
 *
 * Financial data and court cases are fetched in parallel. If any
 * enrichment source fails, partial results are still returned.
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
    let numericCUI: number;
    try {
      numericCUI = normalizeCUI(cui);
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

    // Fetch financial history and court cases in parallel
    // Balance sheets are published with ~1 year delay, so fetch last 3 available years
    const currentYear = new Date().getFullYear();
    const fromYear = currentYear - 3;
    const toYear = currentYear - 1;

    let financials: ParsedFinancials[] = [];
    let courtCases: CourtCaseSummary | null = null;
    let ratios: FinancialRatios | null = null;

    const [financialsResult, courtCasesResult] = await Promise.allSettled([
      getFinancialsHistory(numericCUI, fromYear, toYear),
      searchCourtCases(company.denumire),
    ]);

    if (financialsResult.status === "fulfilled") {
      financials = financialsResult.value;
    } else {
      console.error(
        "[/api/verificare] Financial data fetch failed:",
        financialsResult.reason
      );
    }

    if (courtCasesResult.status === "fulfilled") {
      courtCases = courtCasesResult.value;
    } else {
      console.error(
        "[/api/verificare] Court cases fetch failed:",
        courtCasesResult.reason
      );
    }

    // Calculate ratios from the most recent year, with previous year for growth
    if (financials.length > 0) {
      // Sort descending by year so [0] is most recent
      const sorted = [...financials].sort((a, b) => b.year - a.year);
      const mostRecent = sorted[0];
      const previousYear = sorted.length > 1 ? sorted[1] : undefined;
      ratios = calculateRatios(mostRecent, previousYear);
    }

    // Calculate enhanced risk score with all data sources
    const risk = calculateRiskScore(
      company,
      financials.length > 0 ? financials : undefined,
      ratios ?? undefined,
      courtCases ?? undefined
    );

    return NextResponse.json({
      company,
      risk,
      financials: financials.length > 0 ? financials : undefined,
      courtCases: courtCases ?? undefined,
      ratios: ratios ?? undefined,
    });
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
