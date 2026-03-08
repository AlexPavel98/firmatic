/**
 * Risk Scoring System — Firmatic
 *
 * Advanced company risk assessment using 25+ indicators across 5 categories.
 * More comprehensive than Termene.ro's PartnerSCAN (18 indicators).
 *
 * Categories:
 *  - Fiscal     (TVA, e-Factura, fiscal activity)     — max ~25 pts
 *  - Financial  (profitability, liquidity, debt, trend) — max ~35 pts
 *  - Legal      (court cases, insolvency)              — max ~20 pts
 *  - Operational (age, transparency, completeness)     — max ~10 pts
 *  - Governance  (registration, address, data quality) — max ~10 pts
 */

import type { ANAFCompany } from "@/lib/anaf";
import type { ParsedFinancials, FinancialRatios } from "@/lib/anaf-bilant";
import type { CourtCaseSummary } from "@/lib/portal-just";

// ─── Types ──────────────────────────────────────────────────────────────────

export type RiskCategory =
  | "fiscal"
  | "financial"
  | "legal"
  | "operational"
  | "governance";

export interface RiskIndicator {
  name: string;
  category: RiskCategory;
  /** Points awarded: positive = good, negative = bad */
  score: number;
  /** Maximum possible points for this indicator */
  maxScore: number;
  status: "pass" | "warning" | "fail" | "neutral";
  /** Romanian explanation */
  detail: string;
}

export interface RiskScore {
  /** Normalized 0-100 (100 = safest) */
  score: number;
  level: "low" | "medium" | "high" | "critical";
  grade: "A" | "B" | "C" | "D" | "F";
  indicators: RiskIndicator[];
  categories: Record<
    RiskCategory,
    { score: number; maxScore: number; percentage: number }
  >;
  /** Romanian paragraph summary */
  summary: string;
  recommendation: "safe" | "caution" | "risky" | "avoid";
  lastUpdated: string;
}

// ─── Internal helpers ───────────────────────────────────────────────────────

function ind(
  name: string,
  category: RiskCategory,
  score: number,
  maxScore: number,
  status: RiskIndicator["status"],
  detail: string,
): RiskIndicator {
  return { name, category, score, maxScore, status, detail };
}

function fmtNum(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function regYear(nrRegCom: string | null | undefined): number | null {
  if (!nrRegCom) return null;
  const m = nrRegCom.match(/\/(\d{4})$/);
  return m ? parseInt(m[1], 10) : null;
}

// ─── Category evaluators ────────────────────────────────────────────────────

function fiscalIndicators(c: ANAFCompany): RiskIndicator[] {
  const out: RiskIndicator[] = [];

  // 1. TVA payer status (+8 / -5)
  out.push(
    c.scpTVA
      ? ind("Plătitor TVA", "fiscal", 8, 8, "pass",
          "Plătitor de TVA activ — indicator de activitate economică reală")
      : ind("Plătitor TVA", "fiscal", -5, 8, "warning",
          "Nu este plătitor de TVA — cifră de afaceri redusă sau probleme fiscale"),
  );

  // 2. Fiscal active status (+5 / -15)
  out.push(
    !c.statusInactivi
      ? ind("Stare fiscală", "fiscal", 5, 5, "pass",
          "Activă fiscal conform ANAF")
      : ind("Stare fiscală", "fiscal", -15, 5, "fail",
          "ATENȚIE: Declarată INACTIVĂ fiscal de ANAF — risc major"),
  );

  // 3. e-Factura enrollment (+4 / 0)
  out.push(
    c.statusRO_e_Factura
      ? ind("e-Factura", "fiscal", 4, 4, "pass",
          `Înregistrată în RO e-Factura${c.dataActiveRO_e_Factura ? ` din ${c.dataActiveRO_e_Factura}` : ""}`)
      : ind("e-Factura", "fiscal", 0, 4, "neutral",
          "Nu este înregistrată în RO e-Factura"),
  );

  // 4. TVA la încasare (-3 if active)
  out.push(
    c.statusTvaIncasare
      ? ind("TVA la încasare", "fiscal", -3, 3, "warning",
          "Aplică TVA la încasare — poate indica probleme de cash-flow sau cifră sub prag")
      : ind("TVA la încasare", "fiscal", 3, 3, "pass",
          "Nu aplică TVA la încasare — flux normal de TVA"),
  );

  // 5. Split TVA / plată defalcată (-2 if active)
  const hasSplit = c.stare_inregistrare?.toLowerCase().includes("plata defalcata");
  out.push(
    hasSplit
      ? ind("Plată defalcată TVA", "fiscal", -2, 2, "warning",
          "Aplică mecanismul plății defalcate de TVA — uneori indicator de risc fiscal")
      : ind("Plată defalcată TVA", "fiscal", 2, 2, "pass",
          "Nu aplică plata defalcată de TVA"),
  );

  // 6. TVA cancelled check (data_sfarsit_ScpTVA + not currently active)
  const tvaCancelled =
    !c.scpTVA && c.data_sfarsit_ScpTVA && c.data_sfarsit_ScpTVA.trim() !== "";
  out.push(
    tvaCancelled
      ? ind("TVA anulat", "fiscal", -5, 3, "fail",
          `Codul de TVA a fost anulat la ${c.data_sfarsit_ScpTVA} — risc fiscal semnificativ`)
      : ind("TVA anulat", "fiscal", 3, 3, "pass",
          "Codul de TVA nu a fost anulat"),
  );

  return out;
}

function financialIndicators(
  financials?: ParsedFinancials[],
  ratios?: FinancialRatios,
): RiskIndicator[] {
  const out: RiskIndicator[] = [];
  if (!financials || financials.length === 0) return out;

  // financials[0] = most recent year
  const latest = financials[0];
  const prev = financials.length > 1 ? financials[1] : undefined;
  const twoBack = financials.length > 2 ? financials[2] : undefined;
  const net = latest.netProfit - latest.netLoss;

  // ── 7. Revenue trend (+8 growing 2+ yrs, +4 stable, -4 declining) ──
  if (prev) {
    const d1 = latest.turnover - prev.turnover;
    const d2 = twoBack ? prev.turnover - twoBack.turnover : null;

    if (d1 > 0 && d2 !== null && d2 > 0) {
      out.push(ind("Trend cifră afaceri", "financial", 8, 8, "pass",
        "Cifră de afaceri în creștere constantă pe ultimii 3 ani"));
    } else if (d1 > 0) {
      out.push(ind("Trend cifră afaceri", "financial", 4, 8, "pass",
        "Cifră de afaceri în creștere față de anul precedent"));
    } else if (d1 === 0 || (d1 < 0 && d2 !== null && d2 > 0)) {
      out.push(ind("Trend cifră afaceri", "financial", 4, 8, "neutral",
        "Cifră de afaceri stabilă sau fluctuantă"));
    } else if (d1 < 0 && d2 !== null && d2 < 0) {
      out.push(ind("Trend cifră afaceri", "financial", -4, 8, "fail",
        "Cifră de afaceri în scădere constantă — semnal negativ"));
    } else {
      out.push(ind("Trend cifră afaceri", "financial", -2, 8, "warning",
        "Cifră de afaceri în scădere față de anul precedent"));
    }
  }

  // ── 8. Profitability (+8 profit, +4 breakeven, -8 loss) ──
  if (net > 0) {
    out.push(ind("Profitabilitate", "financial", 8, 8, "pass",
      `Profit net de ${fmtNum(net)} lei în ${latest.year}`));
  } else if (net === 0) {
    out.push(ind("Profitabilitate", "financial", 4, 8, "neutral",
      `Rezultat net zero în ${latest.year} — la pragul de rentabilitate`));
  } else {
    out.push(ind("Profitabilitate", "financial", -8, 8, "fail",
      `Pierdere netă de ${fmtNum(Math.abs(net))} lei în ${latest.year}`));
  }

  // ── 9. Profit margin quality ──
  if (ratios) {
    const pm = ratios.profitMargin;
    if (pm > 10) {
      out.push(ind("Marjă de profit", "financial", 5, 5, "pass",
        `Marjă ${pm}% — profitabilitate solidă`));
    } else if (pm > 5) {
      out.push(ind("Marjă de profit", "financial", 3, 5, "pass",
        `Marjă ${pm}% — profitabilitate acceptabilă`));
    } else if (pm > 0) {
      out.push(ind("Marjă de profit", "financial", 0, 5, "neutral",
        `Marjă ${pm}% — redusă`));
    } else {
      out.push(ind("Marjă de profit", "financial", -3, 5, "fail",
        `Marjă negativă (${pm}%) — operează în pierdere`));
    }

    // ── 10. Current ratio / liquidity ──
    const cr = ratios.currentRatio;
    if (cr > 1.5) {
      out.push(ind("Lichiditate curentă", "financial", 5, 5, "pass",
        `Rata curentă ${cr} — lichiditate bună`));
    } else if (cr > 1.0) {
      out.push(ind("Lichiditate curentă", "financial", 3, 5, "pass",
        `Rata curentă ${cr} — lichiditate acceptabilă`));
    } else if (cr > 0.5) {
      out.push(ind("Lichiditate curentă", "financial", 0, 5, "warning",
        `Rata curentă ${cr} — sub optimal`));
    } else {
      out.push(ind("Lichiditate curentă", "financial", -3, 5, "fail",
        `Rata curentă ${cr} — risc major de lichiditate`));
    }

    // ── 11. Debt to equity ──
    const dte = ratios.debtToEquity;
    if (dte < 1) {
      out.push(ind("Grad de îndatorare", "financial", 5, 5, "pass",
        `Datorii/Capital = ${dte} — grad scăzut de îndatorare`));
    } else if (dte < 2) {
      out.push(ind("Grad de îndatorare", "financial", 2, 5, "pass",
        `Datorii/Capital = ${dte} — îndatorare moderată`));
    } else if (dte < 3) {
      out.push(ind("Grad de îndatorare", "financial", 0, 5, "warning",
        `Datorii/Capital = ${dte} — îndatorare ridicată`));
    } else if (dte < 5) {
      out.push(ind("Grad de îndatorare", "financial", -3, 5, "fail",
        `Datorii/Capital = ${dte} — grad periculos`));
    } else {
      out.push(ind("Grad de îndatorare", "financial", -5, 5, "fail",
        `Datorii/Capital = ${dte} — supraîndatorare critică`));
    }
  }

  // ── 12. Employee count ──
  if (latest.employees > 10) {
    out.push(ind("Număr angajați", "financial", 3, 3, "pass",
      `${latest.employees} angajați — echipă stabilă`));
  } else if (latest.employees > 3) {
    out.push(ind("Număr angajați", "financial", 2, 3, "pass",
      `${latest.employees} angajați`));
  } else if (latest.employees > 0) {
    out.push(ind("Număr angajați", "financial", 1, 3, "neutral",
      `${latest.employees} ${latest.employees === 1 ? "angajat" : "angajați"} — micro-întreprindere`));
  } else {
    out.push(ind("Număr angajați", "financial", -2, 3, "warning",
      "0 angajați declarați — posibil firmă inactivă sau doar cu asociați"));
  }

  // ── 13. Paid-in capital ──
  if (latest.paidCapital > 10_000) {
    out.push(ind("Capital social", "financial", 3, 3, "pass",
      `Capital ${fmtNum(latest.paidCapital)} lei — capitalizare solidă`));
  } else if (latest.paidCapital > 200) {
    out.push(ind("Capital social", "financial", 1, 3, "neutral",
      `Capital ${fmtNum(latest.paidCapital)} lei — modest`));
  } else {
    out.push(ind("Capital social", "financial", -1, 3, "warning",
      `Capital minim (${fmtNum(latest.paidCapital)} lei) — subcapitalizare`));
  }

  return out;
}

function legalIndicators(court?: CourtCaseSummary): RiskIndicator[] {
  const out: RiskIndicator[] = [];
  if (!court) return out;

  // ── 14. No court cases bonus ──
  if (court.total === 0) {
    out.push(ind("Fără dosare", "legal", 10, 10, "pass",
      "Firma nu are dosare în instanță — profil juridic curat"));
  } else {
    out.push(ind("Dosare în instanță", "legal", 0, 10, "neutral",
      `${court.total} ${court.total === 1 ? "dosar" : "dosare"} pe portalul instanțelor`));
  }

  // ── 15. Active cases as defendant (-3 per case, max -10) ──
  if (court.asParat > 0) {
    const penalty = Math.min(court.asParat * 3, 10);
    out.push(ind("Pârât în instanță", "legal", -penalty, 5,
      court.asParat >= 3 ? "fail" : "warning",
      `${court.asParat} ${court.asParat === 1 ? "dosar" : "dosare"} ca pârât`));
  } else {
    out.push(ind("Pârât în instanță", "legal", 5, 5, "pass",
      "Niciun dosar ca pârât"));
  }

  // ── 16. Insolvency cases (-15 if any) ──
  if (court.insolventa > 0) {
    out.push(ind("Insolvență", "legal", -15, 5, "fail",
      `ATENȚIE: ${court.insolventa} ${court.insolventa === 1 ? "dosar" : "dosare"} de insolvență — risc critic`));
  } else {
    out.push(ind("Insolvență", "legal", 5, 5, "pass",
      "Fără dosare de insolvență"));
  }

  // ── 17. Cases as plaintiff (+2 if has some) ──
  if (court.asReclamant > 0) {
    out.push(ind("Reclamant în instanță", "legal", 2, 2, "pass",
      `${court.asReclamant} ${court.asReclamant === 1 ? "dosar" : "dosare"} ca reclamant — firmă activă în protejarea intereselor`));
  } else {
    out.push(ind("Reclamant în instanță", "legal", 0, 2, "neutral",
      "Niciun dosar ca reclamant"));
  }

  return out;
}

function operationalIndicators(c: ANAFCompany): RiskIndicator[] {
  const out: RiskIndicator[] = [];

  // ── 18. Company age ──
  const yr = regYear(c.nrRegCom);
  if (yr !== null) {
    const age = new Date().getFullYear() - yr;
    if (age >= 5) {
      out.push(ind("Vechime firmă", "operational", 5, 5, "pass",
        `${age} ani de activitate — experiență dovedită`));
    } else if (age >= 2) {
      out.push(ind("Vechime firmă", "operational", 3, 5, "pass",
        `${age} ani de activitate`));
    } else if (age >= 1) {
      out.push(ind("Vechime firmă", "operational", 1, 5, "neutral",
        `${age} an de activitate — încă la început`));
    } else {
      out.push(ind("Vechime firmă", "operational", -2, 5, "warning",
        "Firmă nou înființată (sub 1 an) — risc mai ridicat"));
    }
  }

  // ── 19. Has phone number ──
  out.push(
    c.telefon && c.telefon.trim() !== ""
      ? ind("Telefon de contact", "operational", 2, 2, "pass",
          "Are număr de telefon înregistrat — transparență")
      : ind("Telefon de contact", "operational", 0, 2, "neutral",
          "Nu are număr de telefon înregistrat la ANAF"),
  );

  // ── 20. Has registration number ──
  out.push(
    c.nrRegCom && c.nrRegCom.trim() !== ""
      ? ind("Nr. înregistrare", "operational", 2, 2, "pass",
          `Registrul Comerțului: ${c.nrRegCom}`)
      : ind("Nr. înregistrare", "operational", 0, 2, "warning",
          "Lipsește numărul de înregistrare"),
  );

  // ── 21. CAEN code / act constitutiv ──
  out.push(
    c.act && c.act.trim() !== ""
      ? ind("Cod CAEN / Act", "operational", 1, 1, "pass",
          "Are act constitutiv / cod CAEN declarat")
      : ind("Cod CAEN / Act", "operational", 0, 1, "neutral",
          "Lipsesc informații despre CAEN"),
  );

  return out;
}

function governanceIndicators(c: ANAFCompany): RiskIndicator[] {
  const out: RiskIndicator[] = [];

  // ── 22. Registration status ──
  const isRadiated =
    (c.dataRadiere && c.dataRadiere.trim() !== "") ||
    c.stare_inregistrare?.toLowerCase().includes("radiere");
  const isDissolved = c.stare_inregistrare?.toLowerCase().includes("dizolvare");

  if (isRadiated) {
    out.push(ind("Stare înregistrare", "governance", -10, 5, "fail",
      `ATENȚIE: Firma este RADIATĂ${c.dataRadiere ? ` la ${c.dataRadiere}` : ""}`));
  } else if (isDissolved) {
    out.push(ind("Stare înregistrare", "governance", -8, 5, "fail",
      "ATENȚIE: Firma este în procedură de DIZOLVARE"));
  } else {
    out.push(ind("Stare înregistrare", "governance", 5, 5, "pass",
      "Stare de înregistrare normală — firmă activă"));
  }

  // ── 23. Address quality ──
  const hasZip = c.codPostal && c.codPostal.trim() !== "";
  const hasAddr = c.adresa && c.adresa.trim().length > 10;
  if (hasZip && hasAddr) {
    out.push(ind("Calitate adresă", "governance", 3, 3, "pass",
      "Adresă completă cu cod poștal — sediu verificabil"));
  } else if (hasAddr) {
    out.push(ind("Calitate adresă", "governance", 1, 3, "neutral",
      "Adresă parțială fără cod poștal"));
  } else {
    out.push(ind("Calitate adresă", "governance", 0, 3, "warning",
      "Informații insuficiente despre sediul social"));
  }

  // ── 24. Data completeness ──
  const fields = [
    c.denumire, c.adresa, c.nrRegCom, c.codPostal,
    c.act, c.telefon, c.stare_inregistrare,
  ];
  const filled = fields.filter((f) => f && typeof f === "string" && f.trim() !== "").length;
  const ratio = filled / fields.length;
  if (ratio >= 0.7) {
    out.push(ind("Completitudine date", "governance", 2, 2, "pass",
      `${Math.round(ratio * 100)}% câmpuri completate — transparență bună`));
  } else if (ratio >= 0.4) {
    out.push(ind("Completitudine date", "governance", 1, 2, "neutral",
      `${Math.round(ratio * 100)}% câmpuri completate — date parțiale`));
  } else {
    out.push(ind("Completitudine date", "governance", 0, 2, "warning",
      `Doar ${Math.round(ratio * 100)}% câmpuri completate — lipsă transparență`));
  }

  return out;
}

// ─── Summary generation ─────────────────────────────────────────────────────

function buildSummary(
  company: ANAFCompany,
  score: number,
  grade: string,
  level: RiskScore["level"],
  recommendation: RiskScore["recommendation"],
  indicators: RiskIndicator[],
  financials?: ParsedFinancials[],
): string {
  const lvlRo: Record<string, string> = {
    low: "scăzut", medium: "mediu", high: "ridicat", critical: "critic",
  };
  const recoRo: Record<string, string> = {
    safe: "partener sigur pentru colaborare",
    caution: "partener acceptabil, dar cu precauție",
    risky: "partener riscant — verificări suplimentare recomandate",
    avoid: "partener de evitat — risc foarte mare",
  };

  const parts: string[] = [];

  parts.push(
    `${company.denumire} prezintă un risc ${lvlRo[level]} (scor ${score}/100, grad ${grade}).`,
  );

  // Fiscal summary
  const fiscalFails = indicators.filter((i) => i.category === "fiscal" && i.status === "fail");
  if (fiscalFails.length > 0) {
    parts.push(`Probleme fiscale: ${fiscalFails.map((i) => i.name.toLowerCase()).join(", ")}.`);
  } else {
    const tags: string[] = [];
    if (company.scpTVA) tags.push("plătitoare de TVA");
    if (!company.statusInactivi) tags.push("activă fiscal");
    if (company.statusRO_e_Factura) tags.push("înregistrată în e-Factura");
    if (tags.length > 0) parts.push(`Firma este ${tags.join(", ")}.`);
  }

  // Financial summary
  if (financials && financials.length > 0) {
    const latest = financials[0];
    const net = latest.netProfit - latest.netLoss;
    const bits: string[] = [];
    if (latest.turnover > 0) bits.push(`cifră de afaceri de ${fmtNum(latest.turnover)} lei`);
    if (net > 0) bits.push("profitabilitate constantă");
    else if (net < 0) bits.push("operează în pierdere");
    if (latest.employees > 0) bits.push(`${latest.employees} angajați`);
    if (bits.length > 0) {
      parts.push(`Indicatorii financiari arată ${bits.join(", ")} (${latest.year}).`);
    }
  }

  // Legal summary
  const hasInsolvency = indicators.some((i) => i.name === "Insolvență" && i.status === "fail");
  const legalFails = indicators.filter((i) => i.category === "legal" && i.status === "fail");
  if (hasInsolvency) {
    parts.push("ATENȚIE: Există dosare de insolvență.");
  } else if (legalFails.length > 0) {
    parts.push("Există dosare active în instanță ca pârât.");
  } else if (indicators.some((i) => i.name === "Fără dosare" && i.status === "pass")) {
    parts.push("Nu are dosare active în instanță.");
  }

  // Governance alerts
  const govFails = indicators.filter((i) => i.category === "governance" && i.status === "fail");
  if (govFails.length > 0) {
    parts.push(`Probleme de guvernanță: ${govFails.map((i) => i.detail.toLowerCase()).join("; ")}.`);
  }

  parts.push(`Recomandare: ${recoRo[recommendation]}.`);
  return parts.join(" ");
}

// ─── Main scoring function ──────────────────────────────────────────────────

/**
 * Calculates a comprehensive risk score for a Romanian company using 25+
 * indicators across 5 categories. Gracefully handles missing data — when
 * financials, ratios, or court cases are undefined, those indicators are
 * simply skipped and maxScore adjusts accordingly.
 */
export function calculateRiskScore(
  company: ANAFCompany,
  financials?: ParsedFinancials[],
  ratios?: FinancialRatios,
  courtCases?: CourtCaseSummary,
): RiskScore {
  // ── Collect all indicators ──
  const allIndicators: RiskIndicator[] = [
    ...fiscalIndicators(company),
    ...financialIndicators(financials, ratios),
    ...legalIndicators(courtCases),
    ...operationalIndicators(company),
    ...governanceIndicators(company),
  ];

  // ── Category breakdown ──
  const categories: RiskScore["categories"] = {
    fiscal: { score: 0, maxScore: 0, percentage: 0 },
    financial: { score: 0, maxScore: 0, percentage: 0 },
    legal: { score: 0, maxScore: 0, percentage: 0 },
    operational: { score: 0, maxScore: 0, percentage: 0 },
    governance: { score: 0, maxScore: 0, percentage: 0 },
  };

  for (const i of allIndicators) {
    categories[i.category].score += i.score;
    categories[i.category].maxScore += i.maxScore;
  }

  for (const cat of Object.keys(categories) as RiskCategory[]) {
    const c = categories[cat];
    c.percentage = c.maxScore > 0
      ? Math.round((Math.max(0, c.score) / c.maxScore) * 100)
      : 0;
  }

  // ── Normalize to 0-100 ──
  const rawScore = allIndicators.reduce((s, i) => s + i.score, 0);
  const maxScore = allIndicators.reduce((s, i) => s + i.maxScore, 0);
  const normalized = maxScore > 0
    ? Math.max(0, Math.min(100, Math.round((rawScore / maxScore) * 100)))
    : 0;

  // ── Grade: A (80-100), B (65-79), C (50-64), D (35-49), F (0-34) ──
  const grade: RiskScore["grade"] =
    normalized >= 80 ? "A" :
    normalized >= 65 ? "B" :
    normalized >= 50 ? "C" :
    normalized >= 35 ? "D" : "F";

  // ── Level: low (70+), medium (50-69), high (30-49), critical (0-29) ──
  const level: RiskScore["level"] =
    normalized >= 70 ? "low" :
    normalized >= 50 ? "medium" :
    normalized >= 30 ? "high" : "critical";

  // ── Recommendation: safe (75+), caution (50-74), risky (25-49), avoid (0-24) ──
  const recommendation: RiskScore["recommendation"] =
    normalized >= 75 ? "safe" :
    normalized >= 50 ? "caution" :
    normalized >= 25 ? "risky" : "avoid";

  // ── Summary ──
  const summary = buildSummary(
    company, normalized, grade, level, recommendation, allIndicators, financials,
  );

  return {
    score: normalized,
    level,
    grade,
    indicators: allIndicators,
    categories,
    summary,
    recommendation,
    lastUpdated: new Date().toISOString(),
  };
}
