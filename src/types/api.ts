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
  industry: string;
  jobTitle: string;
  companyName: string;
  location: string;
  heatScore: number;
  scoreVersion: number;
  featureVector: Record<string, number> | null;
  insightText: string;
  talkingPoints: string[];
  daysLive: number;
  firstSeenDate: string;
  lastContacted: LastContacted | null;
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
    medianTimeToFillDays: number;
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

export type DigestResponse = {
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
  };
  cadence: Array<{ id: string; label: string; enabled: boolean }>;
  recipients: string[];
  statsLast30Days: {
    digestsDelivered: number;
    openersCopied: number;
    meetingsLogged: number;
  };
};

export type CompanySummary = {
  id: string;
  name: string;
  location: string;
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
  }>;
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
