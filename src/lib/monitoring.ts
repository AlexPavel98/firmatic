// ─── Monitoring Types & Utilities ─────────────────────────────────────────

export interface MonitoredCompany {
  id: string;
  cui: string;
  name: string;
  addedAt: string;
  lastChecked: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskGrade: string;
  alertCount: number;
  status: 'active' | 'paused';
}

export interface Alert {
  id: string;
  companyId: string;
  companyCUI: string;
  companyName: string;
  type: AlertType;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
}

export type AlertType =
  | 'tva_status_change'
  | 'fiscal_inactive'
  | 'efactura_change'
  | 'insolvency_filed'
  | 'court_case_new'
  | 'financial_decline'
  | 'risk_score_change'
  | 'address_change'
  | 'admin_change'
  | 'debt_increase';

// ─── Alert Type Metadata ─────────────────────────────────────────────────

export const ALERT_TYPE_META: Record<
  AlertType,
  { label: string; icon: string; defaultSeverity: Alert['severity'] }
> = {
  tva_status_change: {
    label: 'Schimbare statut TVA',
    icon: 'Receipt',
    defaultSeverity: 'warning',
  },
  fiscal_inactive: {
    label: 'Inactivitate fiscală',
    icon: 'AlertTriangle',
    defaultSeverity: 'critical',
  },
  efactura_change: {
    label: 'Schimbare e-Factura',
    icon: 'FileText',
    defaultSeverity: 'info',
  },
  insolvency_filed: {
    label: 'Insolvență depusă',
    icon: 'Gavel',
    defaultSeverity: 'critical',
  },
  court_case_new: {
    label: 'Dosar nou instanță',
    icon: 'Scale',
    defaultSeverity: 'warning',
  },
  financial_decline: {
    label: 'Declin financiar',
    icon: 'TrendingDown',
    defaultSeverity: 'warning',
  },
  risk_score_change: {
    label: 'Schimbare scor risc',
    icon: 'ShieldAlert',
    defaultSeverity: 'info',
  },
  address_change: {
    label: 'Schimbare adresă',
    icon: 'MapPin',
    defaultSeverity: 'info',
  },
  admin_change: {
    label: 'Schimbare administrator',
    icon: 'UserCog',
    defaultSeverity: 'warning',
  },
  debt_increase: {
    label: 'Creștere datorii ANAF',
    icon: 'Banknote',
    defaultSeverity: 'critical',
  },
};

// ─── Utility Functions ───────────────────────────────────────────────────

export function getAlertTypeLabel(type: AlertType): string {
  return ALERT_TYPE_META[type]?.label ?? type;
}

export function getAlertSeverityColor(severity: Alert['severity']): string {
  switch (severity) {
    case 'info':
      return 'text-primary bg-primary/10';
    case 'warning':
      return 'text-chart-4 bg-chart-4/10';
    case 'critical':
      return 'text-destructive bg-destructive/10';
    default:
      return 'text-muted-foreground bg-muted';
  }
}

export function getRiskLevelColor(level: MonitoredCompany['riskLevel']): string {
  switch (level) {
    case 'low':
      return 'text-primary bg-primary/10 border-primary/20';
    case 'medium':
      return 'text-chart-4 bg-chart-4/10 border-chart-4/20';
    case 'high':
      return 'text-destructive bg-destructive/10 border-destructive/20';
    case 'critical':
      return 'text-destructive bg-destructive/15 border-destructive/30';
    default:
      return 'text-muted-foreground bg-muted border-border';
  }
}

export function getRiskLevelLabel(level: MonitoredCompany['riskLevel']): string {
  switch (level) {
    case 'low':
      return 'Scăzut';
    case 'medium':
      return 'Mediu';
    case 'high':
      return 'Ridicat';
    case 'critical':
      return 'Critic';
  }
}

export function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 1) return 'acum';
  if (diffMin < 60) return `acum ${diffMin} min`;
  if (diffHours < 24) return `acum ${diffHours} ore`;
  if (diffDays < 7) return `acum ${diffDays} zile`;
  return date.toLocaleDateString('ro-RO');
}

// ─── Mock Data ───────────────────────────────────────────────────────────

export const MOCK_MONITORED_COMPANIES: MonitoredCompany[] = [
  {
    id: '1',
    cui: '14399840',
    name: 'SC Construct Pro SRL',
    addedAt: '2025-11-15T10:00:00Z',
    lastChecked: '2026-03-08T08:30:00Z',
    riskScore: 82,
    riskLevel: 'low',
    riskGrade: 'A',
    alertCount: 1,
    status: 'active',
  },
  {
    id: '2',
    cui: '30504790',
    name: 'Trans Cargo Express SRL',
    addedAt: '2025-12-01T14:00:00Z',
    lastChecked: '2026-03-08T08:30:00Z',
    riskScore: 55,
    riskLevel: 'medium',
    riskGrade: 'B',
    alertCount: 3,
    status: 'active',
  },
  {
    id: '3',
    cui: '18215498',
    name: 'Alim Fresh Distribution SRL',
    addedAt: '2025-10-20T09:00:00Z',
    lastChecked: '2026-03-08T08:30:00Z',
    riskScore: 28,
    riskLevel: 'high',
    riskGrade: 'D',
    alertCount: 5,
    status: 'active',
  },
  {
    id: '4',
    cui: '44218765',
    name: 'Digital Innovations SRL',
    addedAt: '2026-01-10T11:00:00Z',
    lastChecked: '2026-03-08T08:30:00Z',
    riskScore: 91,
    riskLevel: 'low',
    riskGrade: 'A+',
    alertCount: 0,
    status: 'active',
  },
  {
    id: '5',
    cui: '27653198',
    name: 'Mobitech Solutions SRL',
    addedAt: '2025-09-05T16:00:00Z',
    lastChecked: '2026-03-07T22:00:00Z',
    riskScore: 15,
    riskLevel: 'critical',
    riskGrade: 'F',
    alertCount: 7,
    status: 'active',
  },
  {
    id: '6',
    cui: '35129876',
    name: 'Agro Verde Farming SRL',
    addedAt: '2026-02-14T08:00:00Z',
    lastChecked: '2026-03-08T08:30:00Z',
    riskScore: 68,
    riskLevel: 'medium',
    riskGrade: 'B-',
    alertCount: 2,
    status: 'paused',
  },
];

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'a1',
    companyId: '5',
    companyCUI: '27653198',
    companyName: 'Mobitech Solutions SRL',
    type: 'insolvency_filed',
    severity: 'critical',
    title: 'Cerere de insolvență depusă',
    description:
      'A fost depusă cerere de insolvență la Tribunalul București. Dosar nr. 1234/3/2026.',
    createdAt: '2026-03-08T07:15:00Z',
    read: false,
  },
  {
    id: 'a2',
    companyId: '3',
    companyCUI: '18215498',
    companyName: 'Alim Fresh Distribution SRL',
    type: 'debt_increase',
    severity: 'critical',
    title: 'Datorii ANAF crescute cu 340%',
    description:
      'Datoriile restante la ANAF au crescut de la 12.500 RON la 55.000 RON în ultimele 30 de zile.',
    createdAt: '2026-03-08T06:45:00Z',
    read: false,
  },
  {
    id: 'a3',
    companyId: '5',
    companyCUI: '27653198',
    companyName: 'Mobitech Solutions SRL',
    type: 'fiscal_inactive',
    severity: 'critical',
    title: 'Firma a devenit inactivă fiscal',
    description:
      'ANAF a declarat firma inactivă fiscal începând cu 01.03.2026. Facturile emise nu mai sunt deductibile.',
    createdAt: '2026-03-07T14:20:00Z',
    read: false,
  },
  {
    id: 'a4',
    companyId: '2',
    companyCUI: '30504790',
    companyName: 'Trans Cargo Express SRL',
    type: 'financial_decline',
    severity: 'warning',
    title: 'Cifra de afaceri a scăzut cu 45%',
    description:
      'Conform bilanțului depus, cifra de afaceri a scăzut de la 2.8M RON la 1.5M RON față de anul precedent.',
    createdAt: '2026-03-07T11:00:00Z',
    read: false,
  },
  {
    id: 'a5',
    companyId: '2',
    companyCUI: '30504790',
    companyName: 'Trans Cargo Express SRL',
    type: 'admin_change',
    severity: 'warning',
    title: 'Administrator nou: Ionescu Marian',
    description:
      'Administratorul firmei s-a schimbat de la Popescu Gheorghe la Ionescu Marian, conform ONRC.',
    createdAt: '2026-03-06T16:30:00Z',
    read: true,
  },
  {
    id: 'a6',
    companyId: '3',
    companyCUI: '18215498',
    companyName: 'Alim Fresh Distribution SRL',
    type: 'court_case_new',
    severity: 'warning',
    title: 'Dosar nou: litigiu comercial',
    description:
      'Dosar nr. 5678/300/2026 - litigiu comercial cu SC Furnizor General SRL, sumă: 120.000 RON.',
    createdAt: '2026-03-06T09:15:00Z',
    read: true,
  },
  {
    id: 'a7',
    companyId: '1',
    companyCUI: '14399840',
    companyName: 'SC Construct Pro SRL',
    type: 'efactura_change',
    severity: 'info',
    title: 'Înregistrat în RO e-Factura',
    description: 'Firma a fost înregistrată în sistemul RO e-Factura începând cu 01.03.2026.',
    createdAt: '2026-03-05T13:00:00Z',
    read: true,
  },
  {
    id: 'a8',
    companyId: '6',
    companyCUI: '35129876',
    companyName: 'Agro Verde Farming SRL',
    type: 'risk_score_change',
    severity: 'info',
    title: 'Scorul de risc a scăzut cu 12 puncte',
    description:
      'Scorul de risc a coborât de la 80 la 68 din cauza creșterii datoriilor pe termen scurt.',
    createdAt: '2026-03-05T10:00:00Z',
    read: true,
  },
  {
    id: 'a9',
    companyId: '2',
    companyCUI: '30504790',
    companyName: 'Trans Cargo Express SRL',
    type: 'address_change',
    severity: 'info',
    title: 'Sediul social s-a mutat',
    description:
      'Sediul social s-a schimbat din Str. Industriei 45 în Str. Progresului 12, București, Sector 3.',
    createdAt: '2026-03-04T15:00:00Z',
    read: true,
  },
  {
    id: 'a10',
    companyId: '5',
    companyCUI: '27653198',
    companyName: 'Mobitech Solutions SRL',
    type: 'tva_status_change',
    severity: 'warning',
    title: 'Firma nu mai este plătitoare de TVA',
    description:
      'ANAF a revocat calitatea de plătitor de TVA. Verificați dacă facturile existente trebuie corectate.',
    createdAt: '2026-03-03T08:00:00Z',
    read: true,
  },
];
