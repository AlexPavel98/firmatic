import type { ANAFCompany } from "./anaf";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface RiskScore {
  /** 0-100 where 100 is safest */
  score: number;
  level: "low" | "medium" | "high";
  factors: string[];
}

// ─── Score Calculation ──────────────────────────────────────────────────────

/**
 * Calculates a heuristic risk score for a company based on ANAF public data.
 *
 * Score breakdown (max 100 = lowest risk):
 *  +30  TVA active (platitor de TVA)
 *  +20  Not inactive (statusInactivi = false)
 *  +15  e-Factura active
 *  +15  Registered > 2 years ago (based on nrRegCom year or data)
 *  +10  Has phone number on file
 *  +10  Has registration number (nrRegCom)
 *
 * Deductions (red flags):
 *  -20  Company is inactive
 *  -15  Company has been deregistered (radiat)
 *  -10  TVA on collection (TVA la incasare) — may indicate cash flow issues
 *
 * This is a placeholder heuristic. In the future this will incorporate:
 * - Financial statements from MFinante
 * - Payment history / delays
 * - Court records (ONRC)
 * - AI-based scoring model
 */
export function calculateRiskScore(company: ANAFCompany): RiskScore {
  let score = 0;
  const factors: string[] = [];

  // ── Positive signals ────────────────────────────────────────────────

  if (company.scpTVA) {
    score += 30;
    factors.push("Platitor de TVA activ");
  } else {
    factors.push("Nu este platitor de TVA");
  }

  if (!company.statusInactivi) {
    score += 20;
    factors.push("Firma activa (nu este inactiva fiscal)");
  }

  if (company.statusRO_e_Factura) {
    score += 15;
    factors.push("Inregistrat in sistemul RO e-Factura");
  } else {
    factors.push("Nu este inregistrat in RO e-Factura");
  }

  // Check registration age from nrRegCom (format: J40/1234/2020)
  if (company.nrRegCom) {
    score += 10;
    factors.push("Are numar de inregistrare la Registrul Comertului");

    const yearMatch = company.nrRegCom.match(/\/(\d{4})$/);
    if (yearMatch) {
      const regYear = parseInt(yearMatch[1], 10);
      const currentYear = new Date().getFullYear();
      const age = currentYear - regYear;

      if (age >= 2) {
        score += 15;
        factors.push(`Firma inregistrata de ${age} ani`);
      } else {
        factors.push(
          `Firma recenta (${age} ${age === 1 ? "an" : "ani"}) — risc mai mare`
        );
      }
    }
  } else {
    factors.push("Lipseste numarul de inregistrare");
  }

  if (company.telefon && company.telefon.trim() !== "") {
    score += 10;
    factors.push("Are numar de telefon inregistrat");
  } else {
    factors.push("Nu are numar de telefon inregistrat");
  }

  // ── Negative signals (deductions) ───────────────────────────────────

  if (company.statusInactivi) {
    score -= 20;
    factors.push("ATENTIE: Firma este inactiva fiscal");
  }

  if (company.dataRadiere && company.dataRadiere.trim() !== "") {
    score -= 15;
    factors.push("ATENTIE: Firma a fost radiata");
  }

  if (company.statusTvaIncasare) {
    score -= 10;
    factors.push(
      "TVA la incasare — poate indica probleme de flux de numerar"
    );
  }

  if (
    company.stare_inregistrare &&
    company.stare_inregistrare.toLowerCase().includes("radiere")
  ) {
    score -= 15;
    factors.push("ATENTIE: Stare inregistrare indica radiere");
  }

  // ── Clamp score ─────────────────────────────────────────────────────

  score = Math.max(0, Math.min(100, score));

  // ── Determine level ─────────────────────────────────────────────────

  let level: RiskScore["level"];
  if (score >= 70) {
    level = "low";
  } else if (score >= 40) {
    level = "medium";
  } else {
    level = "high";
  }

  return { score, level, factors };
}
