/**
 * ANAF API Client
 *
 * Integrates with the Romanian National Agency for Fiscal Administration (ANAF)
 * public API for company verification (TVA status, e-Factura, inactive status, etc.)
 *
 * API docs: https://static.anaf.ro/static/10/Anaf/Informatii_R/API/
 */

const ANAF_API_URL =
  "https://webservicesp.anaf.ro/PlatitorTvaRest/api/v8/ws/tva";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ANAFCompany {
  cui: number;
  data: string;
  denumire: string;
  adresa: string;
  nrRegCom: string;
  telefon: string;
  codPostal: string;
  act: string;
  stare_inregistrare: string;
  scpTVA: boolean;
  data_inceput_ScpTVA: string;
  data_sfarsit_ScpTVA: string;
  data_anul_imp_ScpTVA: string;
  mesaj_ScpTVA: string;
  dataInceputTvaInc: string;
  dataSfarsitTvaInc: string;
  dataActualizareTvaInc: string;
  tipActTvaInc: string;
  statusTvaIncasare: boolean;
  dataInactivworking: string;
  dataReworking: string;
  statusInactivi: boolean;
  dataRadiere: string;
  statusRO_e_Factura: boolean;
  dataActiveRO_e_Factura: string;
}

export interface ANAFResponse {
  cod: number;
  message: string;
  found: ANAFCompany[];
  notFound: Array<{ cui: number; data: string }>;
}

export interface ANAFError {
  error: true;
  message: string;
  statusCode?: number;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Strips the "RO" prefix from a CUI and returns the numeric part.
 */
export function normalizeCUI(cui: string): number {
  const cleaned = cui.trim().toUpperCase().replace(/^RO/, "");
  const numeric = parseInt(cleaned, 10);
  if (isNaN(numeric) || numeric <= 0) {
    throw new Error(`CUI invalid: "${cui}"`);
  }
  return numeric;
}

/**
 * Returns today's date formatted as YYYY-MM-DD (ANAF expected format).
 */
function todayFormatted(): string {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

// ─── API Functions ──────────────────────────────────────────────────────────

/**
 * Fetches company data from ANAF by CUI.
 *
 * The ANAF API expects a POST request with a JSON array of objects:
 * [{ "cui": <number>, "data": "YYYY-MM-DD" }]
 *
 * Returns the parsed company data or throws on error.
 */
export async function getCompanyByCUI(
  cui: string
): Promise<ANAFCompany | null> {
  const numericCUI = normalizeCUI(cui);
  const data = todayFormatted();

  const body = JSON.stringify([{ cui: numericCUI, data }]);

  const response = await fetch(ANAF_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  if (!response.ok) {
    throw new Error(
      `ANAF API error: ${response.status} ${response.statusText}`
    );
  }

  const result = (await response.json()) as ANAFResponse;

  if (result.found && result.found.length > 0) {
    return result.found[0];
  }

  return null;
}

/**
 * Fetches company data from ANAF for multiple CUIs at once.
 *
 * ANAF allows max 500 CUIs per request.
 * Returns an object with found companies and not-found CUIs.
 */
export async function getCompaniesByCUI(
  cuiList: string[]
): Promise<ANAFResponse> {
  if (cuiList.length === 0) {
    return { cod: 200, message: "OK", found: [], notFound: [] };
  }

  if (cuiList.length > 500) {
    throw new Error(
      "ANAF permite maxim 500 de CUI-uri per request. Ai trimis " +
        cuiList.length +
        "."
    );
  }

  const data = todayFormatted();
  const body = JSON.stringify(
    cuiList.map((cui) => ({ cui: normalizeCUI(cui), data }))
  );

  const response = await fetch(ANAF_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  if (!response.ok) {
    throw new Error(
      `ANAF API error: ${response.status} ${response.statusText}`
    );
  }

  return (await response.json()) as ANAFResponse;
}

/**
 * Search company by name.
 *
 * NOTE: ANAF does not provide a public API for searching companies by name.
 * This is a stub that always returns null.
 *
 * Future options:
 * - Integrate with Registrul Comertului (ONRC) API
 * - Build our own search index from periodic ANAF bulk data exports
 * - Use openapi.ro or similar third-party Romanian company search APIs
 */
export async function searchCompanyByName(
  _name: string
): Promise<ANAFCompany | null> {
  // ANAF does not offer a name-based search endpoint.
  // When we build our own company database, this will query it instead.
  return null;
}
