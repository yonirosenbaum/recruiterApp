export type Role = 'RECRUITER' | 'SUPER_ADMIN';

export type TerritoryRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type LastContacted = {
  at: string;
  byUserId: string;
  byName: string;
};

export type RadarTrigger = {
  id: string;
  companyId: string;
  canonicalJobId: string;
  category: string;
  categoryHint: string;
  industry: string;
  jobTitle: string;
  companyName: string;
  isAgency: boolean;
  location: string;
  heatScore: number;
  scoreVersion: number;
  featureVector: Record<string, number> | null;
  insightText: string;
  talkingPoints: string[];
  daysLive: number;
  firstSeenDate: string;
  lastContacted: LastContacted | null;
  areaId: string | null;
  areaName: string | null;
  benchmarkPitch: string | null;
};

export type RadarResponse = {
  scannedAt: string;
  banner: {
    headline: string;
    subtext: string;
    statusLabel: string;
  };
  metrics: {
    newTriggersToday: number;
    newTriggersDelta: number;
    medianTimeToFillDays: number | null;
    repostRatePercent: number;
    repostRateScope: string;
    leadsContactedToday: number;
    leadsContactedScope: string;
  };
  filters: {
    verticals: string[];
    triggerTypes: string[];
  };
  triggers: RadarTrigger[];
};

export type DigestKind = 'daily' | 'weekly' | 'quarterly';

export type DigestResponse = {
  kind: DigestKind;
  scheduledAt: string;
  preview: {
    to: string;
    subject: string;
    signals: Array<{
      id: string;
      category: string;
      heatScore: number;
      company: string;
      role: string;
      statusText: string;
      insightQuote: string;
    }>;
    tipoffLeads?: DigestLeadGroup[];
    newClusteredLeads?: DigestLeadGroup[];
    pastClientsHiring?: Array<{
      company: string;
      liveRoleCount: number;
      sampleTitle: string | null;
    }>;
    marketIntel?: MarketIntelReport | null;
    marketIntelBullets?: string[];
  };
  cadence: Array<{ id: string; label: string; enabled: boolean }>;
  recipients: string[];
  statsLast30Days: {
    digestsDelivered: number;
    openersCopied: number;
    meetingsLogged: number;
  };
};

export type DigestLeadGroup = {
  companyId: string;
  company: string;
  headline: string;
  insightQuote: string;
  heatScore: number;
  section: 'tipoff' | 'new_clustered';
  roles: Array<{
    title: string;
    category: string;
    daysLive: number;
  }>;
};

export type MarketIntelCompanyRow = {
  companyId: string;
  companyName: string;
  liveRoleCount: number;
  note: string;
  isAgency?: boolean;
};

export type MarketIntelTtfRow = {
  title: string;
  place: string;
  placeKind: 'area' | 'region';
  sampleSize: number;
  medianTtfDays: number;
  slug?: string | null;
};

export type MarketIntelRepostRow = {
  companyId: string;
  companyName: string;
  liveCount: number;
  repostCount: number;
  repostRatePercent: number;
};

export type MarketIntelSalaryMoveRow = {
  verticalId: string;
  verticalName: string;
  recentMedian: number | null;
  priorMedian: number | null;
  delta: number | null;
  recentSample: number;
  priorSample: number;
};

export type MarketIntelReport = {
  generatedAt: string;
  lookbackDays: number;
  periodLabel: string;
  /** Patch-scoped subscriber intel vs nationwide public edition. */
  scope?: 'allocation' | 'national';
  ttfByRolePlace: MarketIntelTtfRow[];
  repostByEmployer: MarketIntelRepostRow[];
  salaryMovementByVertical: MarketIntelSalaryMoveRow[];
  hiring: MarketIntelCompanyRow[];
  agencyActivity: MarketIntelCompanyRow[];
  frozen: MarketIntelCompanyRow[];
  thawed: MarketIntelCompanyRow[];
};

export type DigestSendResult = {
  ok: true;
  kind: DigestKind;
  to: string;
  subject: string;
  previewUrl?: string;
};

export type ClientMatchStatus = 'MATCHED' | 'UNMATCHED' | 'AMBIGUOUS';

export type LapsedListResponse = {
  firing: Array<{
    watchedClientId: string;
    companyId: string;
    companyName: string;
    rawName: string;
    liveRoleCount: number;
    sampleJobs: Array<{
      id: string;
      title: string;
      heatScore: number | null;
    }>;
  }>;
  watchlist: Array<{
    id: string;
    rawName: string;
    nameNormalized: string;
    matchStatus: ClientMatchStatus;
    matchNote: string | null;
    companyId: string | null;
    companyName: string | null;
    createdAt: string;
  }>;
  counts: {
    total: number;
    matched: number;
    unmatched: number;
    ambiguous: number;
    firing: number;
  };
};

export type LapsedImportReport = {
  summary: {
    received: number;
    added: number;
    alreadyWatched: number;
    matched: number;
    unmatched: number;
    ambiguous: number;
    rejected: number;
  };
  errors: Array<{ row: number; name: string; message: string }>;
  unmatchedSample: string[];
  ambiguousSample: Array<{ name: string; candidates: string[] }>;
};

export type CompanySummary = {
  id: string;
  name: string;
  location: string;
  isAgency: boolean;
  agencyMappedBy: string | null;
  openRoles: number;
  repostRatePercent: number;
  liveCount: number;
  industry: string;
  lastContacted: LastContacted | null;
};

export type CompanyDetail = CompanySummary & {
  aliases: string[];
  medianTimeToFillDays: number | null;
  timeline: Array<{ date: string; text: string }>;
  activeTriggers: Array<{
    id: string;
    category: string;
    jobTitle: string;
    heatScore: number;
    canonicalJobId: string;
    daysLive: number;
    benchmarkPitch: string | null;
  }>;
};

export type BenchmarkSalary = {
  mid: number | null;
  mean: number | null;
  min: number | null;
  max: number | null;
  p25: number | null;
  p75: number | null;
  sampleSize: number;
};

export type BenchmarkResult = {
  available: boolean;
  slug: string;
  titleQuery: string;
  areaId: string;
  areaName: string;
  verticalId: string | null;
  verticalName: string | null;
  lookbackDays: number;
  sampleSize: number;
  openRoleCount: number;
  marketMedianTtfDays: number | null;
  salary: BenchmarkSalary;
  yourOpenDays: number | null;
  yourOpenCount: number;
  pitchLine: string | null;
  pitchParagraph: string | null;
};

export type BenchmarkOptions = {
  areas: Array<{ id: string; name: string; state: string }>;
  verticals: Array<{ id: string; name: string }>;
  topTitles: Array<{ title: string; count: number }>;
  defaultLookbackDays: number;
  minSample: number;
};

export type PublicBenchmarkListItem = {
  slug: string;
  titleQuery: string;
  areaId: string;
  areaName: string;
  sampleSize: number;
  openRoleCount?: number;
  salaryRoleCount?: number;
  marketMedianTtfDays: number | null;
};

export type PublicBenchmarkIndex = {
  items: PublicBenchmarkListItem[];
  areas: Array<{ id: string; name: string; state: string }>;
};

export type PublicTipoffReport = MarketIntelReport & {
  headlines: string[];
  editionLabel: string;
  editionKey?: string;
  frozen?: boolean;
  featuredBenchmarks: PublicBenchmarkListItem[];
};

export type PublicTipoffReportEditionMeta = {
  editionKey: string;
  editionLabel: string;
  generatedAt: string;
  lookbackDays: number;
};

export type CoverageResponse = {
  tagline: string;
  exclusiveSlot: {
    title: string;
    verticals: string[];
    description: string;
  };
  allocations: Array<{
    areaId: string;
    verticalId: string;
    areaName: string;
    state?: string;
    verticalName: string;
  }>;
  ingestionSources: Array<{
    name: string;
    role: string;
    syncedAt: string;
  }>;
  triggerThresholds: Array<{ name: string; value: string }>;
  modules: Array<{
    id: string;
    name: string;
    enabled: boolean;
    priceLabel: string | null;
  }>;
  sidebarTerritory: {
    label: string;
    summary: string;
    hint: string;
  };
};

export type TerritoryOption = {
  areaId: string;
  areaName: string;
  state: string;
  verticalId: string;
  verticalName: string;
  held: boolean;
  heldByUserId?: string;
};

export type TerritoriesOptions = {
  scope: 'allocated' | 'requestable' | 'all';
  areas: Array<{ id: string; name: string; state: string }>;
  verticals: Array<{ id: string; name: string }>;
  combinations: TerritoryOption[];
};

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  agencyName: string;
  initials: string;
  role: Role;
};

export type AuthSession = {
  accessToken: string;
  user: AuthUser;
};

export type DemoRadarResponse = {
  isDemo: boolean;
  headline: string;
  valueProps: Array<{ title: string; body: string }>;
  sampleTriggers: RadarTrigger[];
};

export type AdminTerritoryComboRow = {
  areaId: string;
  areaName: string;
  state: string;
  verticalId: string;
  verticalName: string;
  jobs: number;
  liveJobs: number;
  companies: number;
};

export type AdminTerritoryStats = {
  rows: AdminTerritoryComboRow[];
  unmapped: { jobs: number; liveJobs: number; companies: number };
  totals: { jobs: number; liveJobs: number; companies: number };
};

export type AdminUser = {
  id: string;
  email: string;
  fullName: string;
  agencyName: string;
  role: Role;
  createdAt: string;
  pendingRequests: number;
  allocations: Array<{
    id: string;
    areaId: string;
    areaName?: string;
    state?: string;
    verticalId: string;
    verticalName?: string;
    grantedAt: string;
  }>;
};

export type TerritoryRequestItem = {
  id: string;
  userId: string;
  areaId: string;
  verticalId: string;
  areaName: string;
  state?: string;
  verticalName: string;
  notes?: string;
  status: TerritoryRequestStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewNote?: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    agencyName: string;
    role: Role;
  } | null;
};

export type ScrapeLocationPolicy = {
  id: string;
  label: string;
  country: string | null;
  state: string | null;
  city: string | null;
  region: string | null;
  areaId: string | null;
  areaName: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};
