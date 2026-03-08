/**
 * Portal Just (portal.just.ro) Court Cases Client
 *
 * Searches Romanian court cases via the portal.just.ro SOAP web service.
 * Used to check if a company is involved in litigation, insolvency, etc.
 *
 * SOAP endpoint: http://portalquery.just.ro/query.asmx
 */

const PORTAL_JUST_URL = "http://portalquery.just.ro/query.asmx";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CourtCase {
  numarDosar: string;
  institutie: string;
  obiect: string;
  dataUltimaModificare: string;
  categorie: string;
  stadiu: string;
  parti: string[];
}

export interface CourtCaseSummary {
  total: number;
  cases: CourtCase[];
  asReclamant: number;
  asParat: number;
  insolventa: number;
  active: number;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Builds the SOAP XML envelope for CautareDosare.
 */
function buildSoapRequest(companyName: string): string {
  // Escape XML special characters in company name
  const escaped = companyName
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

  return `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <CautareDosare xmlns="http://portalquery.just.ro/query">
      <numarDosar></numarDosar>
      <obiectDosar></obiectDosar>
      <numeParte>${escaped}</numeParte>
      <institutie></institutie>
      <dataStart></dataStart>
      <dataStop></dataStop>
      <dataUltimaModificareStart></dataUltimaModificareStart>
      <dataUltimaModificareStop></dataUltimaModificareStop>
    </CautareDosare>
  </soap12:Body>
</soap12:Envelope>`;
}

/**
 * Extracts text content between XML tags. Simple regex-based parser
 * since we don't want to pull in a full XML library for server-side use.
 */
function extractTag(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>(.*?)</${tag}>`, "s");
  const match = xml.match(regex);
  return match ? match[1].trim() : "";
}

/**
 * Extracts all occurrences of a tag's text content from XML.
 */
function extractAllTags(xml: string, tag: string): string[] {
  const regex = new RegExp(`<${tag}[^>]*>(.*?)</${tag}>`, "gs");
  const results: string[] = [];
  let match;
  while ((match = regex.exec(xml)) !== null) {
    results.push(match[1].trim());
  }
  return results;
}

/**
 * Parses all court case blocks from the SOAP response XML.
 */
function parseCases(responseXml: string): CourtCase[] {
  const cases: CourtCase[] = [];

  // Each case is in a <Dosar> element
  const dosarBlocks = responseXml.match(/<Dosar\b[^>]*>[\s\S]*?<\/Dosar>/g);
  if (!dosarBlocks) return cases;

  for (const block of dosarBlocks) {
    const numarDosar = extractTag(block, "NumarDosar") || extractTag(block, "numarDosar");
    const institutie = extractTag(block, "Institutie") || extractTag(block, "institutie");
    const obiect = extractTag(block, "Obiect") || extractTag(block, "obiect");
    const dataUltimaModificare =
      extractTag(block, "DataUltimaModificare") ||
      extractTag(block, "dataUltimaModificare");
    const categorie = extractTag(block, "Categorie") || extractTag(block, "categorie");
    const stadiu = extractTag(block, "StadiuProcesual") || extractTag(block, "stadiuProcesual");

    // Parties can be in <Parte> or <DenumireParte> tags
    const parti =
      extractAllTags(block, "DenumireParte").length > 0
        ? extractAllTags(block, "DenumireParte")
        : extractAllTags(block, "Parte");

    cases.push({
      numarDosar,
      institutie,
      obiect,
      dataUltimaModificare,
      categorie,
      stadiu,
      parti,
    });
  }

  return cases;
}

/**
 * Checks if a case is an insolvency case based on its subject.
 */
function isInsolvencyCase(caseObj: CourtCase): boolean {
  const keywords = [
    "insolven",
    "faliment",
    "reorganizare",
    "lichidare",
    "dizolvare",
  ];
  const lowerObiect = caseObj.obiect.toLowerCase();
  return keywords.some((kw) => lowerObiect.includes(kw));
}

/**
 * Checks if a case appears to be active (not final).
 */
function isActiveCase(caseObj: CourtCase): boolean {
  const finalKeywords = ["solutionat", "finalizat", "arhivat", "radiat"];
  const lowerStadiu = caseObj.stadiu.toLowerCase();
  return !finalKeywords.some((kw) => lowerStadiu.includes(kw));
}

// ─── API Functions ──────────────────────────────────────────────────────────

/**
 * Searches court cases by company name via the portal.just.ro SOAP service.
 *
 * Returns a summary with categorized cases. If the service is unavailable
 * (common — it has frequent downtime), returns an empty result gracefully.
 */
export async function searchCourtCases(
  companyName: string
): Promise<CourtCaseSummary> {
  const emptySummary: CourtCaseSummary = {
    total: 0,
    cases: [],
    asReclamant: 0,
    asParat: 0,
    insolventa: 0,
    active: 0,
  };

  if (!companyName || companyName.trim().length === 0) {
    return emptySummary;
  }

  try {
    const soapBody = buildSoapRequest(companyName.trim());

    const response = await fetch(PORTAL_JUST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/soap+xml; charset=utf-8",
      },
      body: soapBody,
      signal: AbortSignal.timeout(15000), // 15s timeout — service can be slow
    });

    if (!response.ok) {
      console.error(
        `[portal-just] HTTP error: ${response.status} ${response.statusText}`
      );
      return emptySummary;
    }

    const xml = await response.text();
    const cases = parseCases(xml);

    const companyUpper = companyName.trim().toUpperCase();

    let asReclamant = 0;
    let asParat = 0;

    for (const caseObj of cases) {
      // Heuristic: if company appears first in parties list, likely reclamant
      // This is approximate — the SOAP response doesn't always specify roles clearly
      const partiUpper = caseObj.parti.map((p) => p.toUpperCase());
      const companyIndex = partiUpper.findIndex((p) =>
        p.includes(companyUpper)
      );

      if (companyIndex === 0) {
        asReclamant++;
      } else if (companyIndex > 0) {
        asParat++;
      }
    }

    return {
      total: cases.length,
      cases,
      asReclamant,
      asParat,
      insolventa: cases.filter(isInsolvencyCase).length,
      active: cases.filter(isActiveCase).length,
    };
  } catch (error) {
    // Service is frequently down — fail gracefully
    console.error("[portal-just] Failed to fetch court cases:", error);
    return emptySummary;
  }
}
