import { apiFetch } from './client';
import type {
  AuthSession,
  AuthUser,
  BenchmarkOptions,
  BenchmarkResult,
  CompanyDetail,
  CoverageResponse,
  DemoRadarResponse,
  DigestResponse,
  DigestKind,
  DigestSendResult,
  MarketIntelReport,
  PublicTipoffReport,
  PublicTipoffReportEditionMeta,
  LastContacted,
  LapsedImportReport,
  LapsedListResponse,
  PublicBenchmarkIndex,
  RadarResponse,
  TerritoriesOptions,
  TerritoryRequestItem,
  AdminUser,
  AdminTerritoryStats,
  TerritoryRequestStatus,
  ScrapeLocationPolicy,
} from '@/types/api';

export type TerritoryScope = 'allocated' | 'requestable' | 'all';

export const endpoints = {
  radar: (params?: { triggerType?: string; vertical?: string }) => {
    const search = new URLSearchParams();
    if (params?.triggerType) search.set('triggerType', params.triggerType);
    if (params?.vertical) search.set('vertical', params.vertical);
    const qs = search.toString();
    return apiFetch<RadarResponse>(`/radar${qs ? `?${qs}` : ''}`);
  },

  digest: (kind: DigestKind = 'daily') =>
    apiFetch<DigestResponse>(`/digest?kind=${kind}`),

  sendDigest: (kind: DigestKind = 'daily') =>
    apiFetch<DigestSendResult>('/digest/send', {
      method: 'POST',
      body: JSON.stringify({ kind }),
    }),

  marketIntel: (params?: { lookbackDays?: number; period?: 'weekly' | 'quarterly' }) => {
    const search = new URLSearchParams();
    if (params?.lookbackDays != null) {
      search.set('lookbackDays', String(params.lookbackDays));
    }
    if (params?.period) search.set('period', params.period);
    const qs = search.toString();
    return apiFetch<MarketIntelReport>(
      `/benchmarks/market-intel${qs ? `?${qs}` : ''}`,
    );
  },

  lapsedClients: () => apiFetch<LapsedListResponse>('/lapsed-clients'),

  importLapsedClients: (body: {
    names?: string[];
    rows?: Array<{ row: number; name: string }>;
  }) =>
    apiFetch<LapsedImportReport>('/lapsed-clients/import', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  removeLapsedClient: (id: string) =>
    apiFetch<{ ok: boolean }>(`/lapsed-clients/${id}`, { method: 'DELETE' }),

  rematchLapsedClient: (id: string) =>
    apiFetch<{
      id: string;
      rawName: string;
      matchStatus: string;
      matchNote: string | null;
      companyId: string | null;
      companyName: string | null;
    }>(`/lapsed-clients/${id}/rematch`, { method: 'POST' }),

  companies: () =>
    apiFetch<{ companies: CompanyDetail[] }>('/companies'),

  company: (id: string) => apiFetch<CompanyDetail>(`/companies/${id}`),

  setCompanyAgency: (id: string, isAgency: boolean) =>
    apiFetch<CompanyDetail>(`/companies/${id}/agency`, {
      method: 'PATCH',
      body: JSON.stringify({ isAgency }),
    }),

  markContacted: (body: {
    companyId: string;
    canonicalJobId?: string;
    hiringSignalId?: string;
    note?: string;
  }) =>
    apiFetch<{
      event: {
        id: string;
        companyId: string;
        canonicalJobId: string | null;
        hiringSignalId: string | null;
        kind: string;
        createdAt: string;
      };
      lastContacted: LastContacted;
    }>('/outreach', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  undoOutreach: (eventId: string) =>
    apiFetch<{ message: string }>(`/outreach/${eventId}`, {
      method: 'DELETE',
    }),

  coverage: () => apiFetch<CoverageResponse>('/coverage'),

  benchmarkOptions: () => apiFetch<BenchmarkOptions>('/benchmarks/options'),

  benchmarks: (params: {
    titleQuery: string;
    areaId: string;
    verticalId?: string;
    lookbackDays?: number;
  }) => {
    const search = new URLSearchParams();
    search.set('titleQuery', params.titleQuery);
    search.set('areaId', params.areaId);
    if (params.verticalId) search.set('verticalId', params.verticalId);
    if (params.lookbackDays != null) {
      search.set('lookbackDays', String(params.lookbackDays));
    }
    return apiFetch<BenchmarkResult>(`/benchmarks?${search.toString()}`);
  },

  benchmarkForJob: (canonicalJobId: string) =>
    apiFetch<BenchmarkResult>(`/benchmarks/for-job/${canonicalJobId}`),

  publicBenchmarks: (params?: { limit?: number; areaId?: string }) => {
    const search = new URLSearchParams();
    search.set('limit', String(params?.limit ?? 40));
    if (params?.areaId) search.set('areaId', params.areaId);
    return apiFetch<PublicBenchmarkIndex>(
      `/benchmarks/public?${search.toString()}`,
      { auth: false },
    );
  },

  publicBenchmark: (slug: string) =>
    apiFetch<BenchmarkResult>(`/benchmarks/public/${encodeURIComponent(slug)}`, {
      auth: false,
    }),

  publicTipoffReport: () =>
    apiFetch<PublicTipoffReport>('/benchmarks/report', { auth: false }),

  publicTipoffReportEditions: () =>
    apiFetch<PublicTipoffReportEditionMeta[]>(
      '/benchmarks/report/editions',
      { auth: false },
    ),

  publicTipoffReportEdition: (editionKey: string) =>
    apiFetch<PublicTipoffReport>(
      `/benchmarks/report/editions/${encodeURIComponent(editionKey)}`,
      { auth: false },
    ),

  territoryOptions: (scope: TerritoryScope = 'allocated') =>
    apiFetch<TerritoriesOptions>(`/territories/options?scope=${scope}`),

  requestTerritory: (body: {
    areaId: string;
    verticalId: string;
    notes?: string;
  }) =>
    apiFetch<{
      message: string;
      request: TerritoryRequestItem;
    }>('/territories/request', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  myTerritoryRequests: () =>
    apiFetch<{ requests: TerritoryRequestItem[] }>(
      '/territories/requests/mine',
    ),

  login: (body: { email: string; password: string }) =>
    apiFetch<AuthSession>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
      auth: false,
    }),

  signup: (body: {
    fullName: string;
    email: string;
    password: string;
    agencyName: string;
  }) =>
    apiFetch<AuthSession>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(body),
      auth: false,
    }),

  me: () => apiFetch<AuthUser>('/auth/me'),

  forgotPassword: (body: { email: string }) =>
    apiFetch<{
      message: string;
      previewUrl?: string;
      resetPath?: string;
    }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(body),
      auth: false,
    }),

  resetPassword: (body: { token: string; password: string }) =>
    apiFetch<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(body),
      auth: false,
    }),

  demoRadar: () => apiFetch<DemoRadarResponse>('/demo/radar', { auth: false }),

  adminUsers: () => apiFetch<{ users: AdminUser[] }>('/admin/users'),

  adminTerritoryStats: () =>
    apiFetch<AdminTerritoryStats>('/admin/territory-stats'),

  adminTerritoryRequests: (status?: TerritoryRequestStatus) =>
    apiFetch<{ requests: TerritoryRequestItem[] }>(
      `/admin/territory-requests${status ? `?status=${status}` : ''}`,
    ),

  approveTerritoryRequest: (id: string, reviewNote?: string) =>
    apiFetch<{ message: string; request: TerritoryRequestItem }>(
      `/admin/territory-requests/${id}/approve`,
      {
        method: 'POST',
        body: JSON.stringify({ reviewNote }),
      },
    ),

  rejectTerritoryRequest: (id: string, reviewNote?: string) =>
    apiFetch<{ message: string; request: TerritoryRequestItem }>(
      `/admin/territory-requests/${id}/reject`,
      {
        method: 'POST',
        body: JSON.stringify({ reviewNote }),
      },
    ),

  assignTerritory: (body: {
    userId: string;
    areaId: string;
    verticalId: string;
  }) =>
    apiFetch<{ message: string }>('/admin/allocations', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  adminScrapeLocationPolicies: () =>
    apiFetch<{ policies: ScrapeLocationPolicy[] }>(
      '/admin/scrape-location-policies',
    ),

  createScrapeLocationPolicy: (body: {
    label: string;
    country?: string | null;
    state?: string | null;
    city?: string | null;
    region?: string | null;
    areaId?: string | null;
    active?: boolean;
  }) =>
    apiFetch<{ message: string; policy: ScrapeLocationPolicy }>(
      '/admin/scrape-location-policies',
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
    ),

  updateScrapeLocationPolicy: (
    id: string,
    body: {
      label?: string;
      country?: string | null;
      state?: string | null;
      city?: string | null;
      region?: string | null;
      areaId?: string | null;
      active?: boolean;
    },
  ) =>
    apiFetch<{ message: string; policy: ScrapeLocationPolicy }>(
      `/admin/scrape-location-policies/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
      },
    ),

  deleteScrapeLocationPolicy: (id: string) =>
    apiFetch<{ message: string }>(`/admin/scrape-location-policies/${id}`, {
      method: 'DELETE',
    }),
};
