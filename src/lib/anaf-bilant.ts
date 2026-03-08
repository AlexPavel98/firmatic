/**
 * ANAF Balance Sheet API Client
 *
 * Fetches financial statements (bilanturi) from ANAF's public API.
 * Data is available for normal companies (not banks/insurance).
 *
 * API endpoint: https://webservicesp.anaf.ro/bilant?an={year}&cui={cuiNumber}
 */

const ANAF_BILANT_URL = "https://webservicesp.anaf.ro/bilant";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface FinancialIndicator {
  indicator: string;
  val_indicator: number;
  val_den_indicator: string;
}

export interface ANAFBilant {
  an: number;
  cui: number;
  deni: string;
  caen: string;
  den_caen: string;
  i: FinancialIndicator[];
}

export interface ParsedFinancials {
  year: number;
  turnover: number;
  totalRevenue: number;
  totalExpenses: number;
  grossProfit: number;
  grossLoss: number;
  netProfit: number;
  netLoss: number;
  employees: number;
  fixedAssets: number;
  currentAssets: number;
  inventory: number;
  receivables: number;
  cash: number;
  totalLiabilities: number;
  equity: number;
  paidCapital: number;
}

export interface FinancialRatios {
  /** Net profit / turnover (percentage) */
  profitMargin: number;
  /** Current assets / total liabilities */
  currentRatio: number;
  /** Total liabilities / equity */
  debtToEquity: number;
  /** Net profit / equity (percentage) */
  returnOnEquity: number;
  /** Turnover growth vs previous year (percentage), null if no previous data */
  revenueGrowth: number | null;
  /** Net profit growth vs previous year (percentage), null if no previous data */
  profitGrowth: number | null;
  /** Turnover / number of employees */
  employeeProductivity: number;
}

// ─── Indicator mapping ──────────────────────────────────────────────────────

const INDICATOR_MAP: Record<string, keyof ParsedFinancials> = {
  I1: "fixedAssets",
  I2: "currentAssets",
  I3: "inventory",
  I4: "receivables",
  I5: "cash",
  I7: "totalLiabilities",
  I9: "equity",
  I10: "paidCapital",
  I13: "turnover",
  I14: "totalRevenue",
  I15: "totalExpenses",
  I16: "grossProfit",
  I17: "grossLoss",
  I18: "netProfit",
  I19: "netLoss",
  I20: "employees",
};

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Delay utility for rate limiting (ANAF allows ~1 req/sec).
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Format a number as Romanian currency: "1.234.567 lei"
 */
export function formatRON(amount: number): string {
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formatted} lei`;
}

// ─── API Functions ──────────────────────────────────────────────────────────

/**
 * Fetches a single year's balance sheet from ANAF.
 *
 * Returns null if the data is not available (company too new, year not filed yet, etc.)
 */
export async function getFinancials(
  cui: number,
  year: number
): Promise<ANAFBilant | null> {
  const url = `${ANAF_BILANT_URL}?an=${year}&cui=${cui}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `ANAF Bilant API error: ${response.status} ${response.statusText}`
    );
  }

  const data = (await response.json()) as ANAFBilant;

  // ANAF returns an object even when no data — check if indicators exist
  if (!data.i || data.i.length === 0) {
    return null;
  }

  return data;
}

/**
 * Fetches balance sheets for multiple years, respecting ANAF rate limits.
 *
 * Fetches sequentially with a 1-second delay between requests.
 * Skips years where no data is available.
 */
export async function getFinancialsHistory(
  cui: number,
  fromYear: number,
  toYear: number
): Promise<ParsedFinancials[]> {
  const results: ParsedFinancials[] = [];

  for (let year = fromYear; year <= toYear; year++) {
    try {
      const bilant = await getFinancials(cui, year);
      if (bilant) {
        results.push(parseFinancials(bilant));
      }
    } catch (error) {
      console.error(
        `[anaf-bilant] Failed to fetch year ${year} for CUI ${cui}:`,
        error
      );
      // Continue with other years
    }

    // Rate limit: wait 1 second between requests (except after last)
    if (year < toYear) {
      await delay(1000);
    }
  }

  return results;
}

/**
 * Parses an ANAF balance sheet response into a structured object.
 */
export function parseFinancials(bilant: ANAFBilant): ParsedFinancials {
  const parsed: ParsedFinancials = {
    year: bilant.an,
    turnover: 0,
    totalRevenue: 0,
    totalExpenses: 0,
    grossProfit: 0,
    grossLoss: 0,
    netProfit: 0,
    netLoss: 0,
    employees: 0,
    fixedAssets: 0,
    currentAssets: 0,
    inventory: 0,
    receivables: 0,
    cash: 0,
    totalLiabilities: 0,
    equity: 0,
    paidCapital: 0,
  };

  for (const item of bilant.i) {
    const key = INDICATOR_MAP[item.indicator];
    if (key) {
      parsed[key] = item.val_indicator;
    }
  }

  return parsed;
}

/**
 * Calculates financial ratios from parsed balance sheet data.
 *
 * If a previous year is provided, also computes growth rates.
 * Division by zero is handled gracefully (returns 0).
 */
export function calculateRatios(
  current: ParsedFinancials,
  previous?: ParsedFinancials
): FinancialRatios {
  const netResult = current.netProfit - current.netLoss;

  const profitMargin =
    current.turnover !== 0 ? (netResult / current.turnover) * 100 : 0;

  const currentRatio =
    current.totalLiabilities !== 0
      ? current.currentAssets / current.totalLiabilities
      : 0;

  const debtToEquity =
    current.equity !== 0 ? current.totalLiabilities / current.equity : 0;

  const returnOnEquity =
    current.equity !== 0 ? (netResult / current.equity) * 100 : 0;

  const employeeProductivity =
    current.employees !== 0 ? current.turnover / current.employees : 0;

  let revenueGrowth: number | null = null;
  let profitGrowth: number | null = null;

  if (previous) {
    if (previous.turnover !== 0) {
      revenueGrowth =
        ((current.turnover - previous.turnover) / previous.turnover) * 100;
    }

    const prevNetResult = previous.netProfit - previous.netLoss;
    if (prevNetResult !== 0) {
      profitGrowth = ((netResult - prevNetResult) / Math.abs(prevNetResult)) * 100;
    }
  }

  return {
    profitMargin: Math.round(profitMargin * 100) / 100,
    currentRatio: Math.round(currentRatio * 100) / 100,
    debtToEquity: Math.round(debtToEquity * 100) / 100,
    returnOnEquity: Math.round(returnOnEquity * 100) / 100,
    revenueGrowth:
      revenueGrowth !== null ? Math.round(revenueGrowth * 100) / 100 : null,
    profitGrowth:
      profitGrowth !== null ? Math.round(profitGrowth * 100) / 100 : null,
    employeeProductivity: Math.round(employeeProductivity),
  };
}
