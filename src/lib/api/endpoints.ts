import { apiFetch } from './client';
import type {
  AuthSession,
  AuthUser,
  CompanyDetail,
  CoverageResponse,
  DemoRadarResponse,
  DigestResponse,
  LastContacted,
  RadarResponse,
  TerritoriesOptions,
  TerritoryRequestItem,
  AdminUser,
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

  digest: () => apiFetch<DigestResponse>('/digest'),

  companies: () =>
    apiFetch<{ companies: CompanyDetail[] }>('/companies'),

  company: (id: string) => apiFetch<CompanyDetail>(`/companies/${id}`),

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
