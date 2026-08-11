'use client';

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { endpoints, type TerritoryScope } from '@/lib/api/endpoints';
import type { TerritoryRequestStatus } from '@/types/api';
import { useAuth } from '@/components/auth/AuthProvider';

export const queryKeys = {
  radar: (filters?: { triggerType?: string; vertical?: string }) =>
    ['radar', filters] as const,
  digest: (userId?: string, kind: 'daily' | 'weekly' = 'daily') =>
    ['digest', userId, kind] as const,
  marketIntel: (
    userId?: string,
    period: 'weekly' | 'quarterly' = 'weekly',
  ) => ['benchmarks', 'market-intel', userId, period] as const,
  lapsed: (userId?: string) => ['lapsed', userId] as const,
  companies: (userId?: string) => ['companies', userId] as const,
  company: (id: string, userId?: string) =>
    ['companies', userId, id] as const,
  coverage: ['coverage'] as const,
  benchmarkOptions: ['benchmarks', 'options'] as const,
  benchmarks: (params: {
    titleQuery: string;
    areaId: string;
    verticalId?: string;
    lookbackDays?: number;
  }) => ['benchmarks', 'query', params] as const,
  publicBenchmarks: (areaId?: string) =>
    ['benchmarks', 'public', areaId ?? 'all'] as const,
  publicBenchmark: (slug: string) => ['benchmarks', 'public', slug] as const,
  publicTipoffReport: ['benchmarks', 'report'] as const,
  territoryOptions: (scope: TerritoryScope) =>
    ['territories', 'options', scope] as const,
  myTerritoryRequests: ['territories', 'requests', 'mine'] as const,
  demoRadar: ['demo', 'radar'] as const,
  adminUsers: ['admin', 'users'] as const,
  adminTerritoryStats: ['admin', 'territory-stats'] as const,
  adminRequests: (status?: TerritoryRequestStatus) =>
    ['admin', 'territory-requests', status] as const,
  adminScrapeLocationPolicies: ['admin', 'scrape-location-policies'] as const,
};

export function useRadarQuery(filters?: {
  triggerType?: string;
  vertical?: string;
}) {
  return useQuery({
    queryKey: queryKeys.radar(filters),
    queryFn: () => endpoints.radar(filters),
  });
}

export function useDigestQuery(kind: 'daily' | 'weekly' = 'daily') {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.digest(user?.id, kind),
    queryFn: () => endpoints.digest(kind),
    enabled: Boolean(user),
  });
}

export function useSendDigestMutation() {
  return useMutation({
    mutationFn: (kind: 'daily' | 'weekly') => endpoints.sendDigest(kind),
  });
}

export function useMarketIntelQuery(
  period: 'weekly' | 'quarterly' = 'weekly',
  options?: { enabled?: boolean },
) {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.marketIntel(user?.id, period),
    queryFn: () =>
      endpoints.marketIntel({
        period,
        lookbackDays: period === 'quarterly' ? 90 : undefined,
      }),
    enabled: Boolean(user) && (options?.enabled ?? true),
  });
}

export function useLapsedClientsQuery() {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.lapsed(user?.id),
    queryFn: () => endpoints.lapsedClients(),
    enabled: Boolean(user),
  });
}

export function useImportLapsedClientsMutation() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: endpoints.importLapsedClients,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.lapsed(user?.id) });
      void qc.invalidateQueries({ queryKey: ['digest'] });
    },
  });
}

export function useRemoveLapsedClientMutation() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: endpoints.removeLapsedClient,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.lapsed(user?.id) });
    },
  });
}

export function useRematchLapsedClientMutation() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: endpoints.rematchLapsedClient,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.lapsed(user?.id) });
    },
  });
}

export function useCompaniesQuery() {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.companies(user?.id),
    queryFn: () => endpoints.companies(),
    enabled: Boolean(user),
  });
}

export function useCompanyQuery(id: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.company(id, user?.id),
    queryFn: () => endpoints.company(id),
    enabled: Boolean(id && user),
  });
}

export function useSetCompanyAgencyMutation() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: ({ id, isAgency }: { id: string; isAgency: boolean }) =>
      endpoints.setCompanyAgency(id, isAgency),
    onSuccess: (_data, vars) => {
      void qc.invalidateQueries({ queryKey: queryKeys.companies(user?.id) });
      void qc.invalidateQueries({
        queryKey: queryKeys.company(vars.id, user?.id),
      });
      void qc.invalidateQueries({ queryKey: ['benchmarks'] });
      void qc.invalidateQueries({ queryKey: ['digest'] });
    },
  });
}

export function useCoverageQuery() {
  return useQuery({
    queryKey: queryKeys.coverage,
    queryFn: () => endpoints.coverage(),
  });
}

export function useBenchmarkOptionsQuery() {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.benchmarkOptions,
    queryFn: () => endpoints.benchmarkOptions(),
    enabled: Boolean(user),
  });
}

export function useBenchmarksQuery(
  params: {
    titleQuery: string;
    areaId: string;
    verticalId?: string;
    lookbackDays?: number;
  } | null,
) {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.benchmarks(
      params ?? { titleQuery: '', areaId: '' },
    ),
    queryFn: () => endpoints.benchmarks(params!),
    enabled: Boolean(
      user && params?.titleQuery.trim() && params?.areaId,
    ),
  });
}

export function usePublicBenchmarksQuery(areaId?: string) {
  return useQuery({
    queryKey: queryKeys.publicBenchmarks(areaId),
    queryFn: () => endpoints.publicBenchmarks({ areaId: areaId || undefined }),
    placeholderData: keepPreviousData,
  });
}

export function usePublicBenchmarkQuery(slug: string) {
  return useQuery({
    queryKey: queryKeys.publicBenchmark(slug),
    queryFn: () => endpoints.publicBenchmark(slug),
    enabled: Boolean(slug),
  });
}

export function usePublicTipoffReportQuery() {
  return useQuery({
    queryKey: queryKeys.publicTipoffReport,
    queryFn: () => endpoints.publicTipoffReport(),
  });
}

export function useTerritoryOptionsQuery(
  scope: TerritoryScope = 'allocated',
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.territoryOptions(scope),
    queryFn: () => endpoints.territoryOptions(scope),
    enabled: options?.enabled ?? true,
  });
}

export function useMyTerritoryRequestsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.myTerritoryRequests,
    queryFn: () => endpoints.myTerritoryRequests(),
    enabled: options?.enabled ?? true,
  });
}

export function useDemoRadarQuery() {
  return useQuery({
    queryKey: queryKeys.demoRadar,
    queryFn: () => endpoints.demoRadar(),
  });
}

export function useRequestTerritoryMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: endpoints.requestTerritory,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['territories'] });
      void qc.invalidateQueries({ queryKey: queryKeys.coverage });
      void qc.invalidateQueries({ queryKey: ['admin'] });
    },
  });
}

export function useMarkContactedMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: endpoints.markContacted,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['radar'] });
      void qc.invalidateQueries({ queryKey: ['companies'] });
      void qc.invalidateQueries({ queryKey: ['digest'] });
    },
  });
}

export function useUndoOutreachMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => endpoints.undoOutreach(eventId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['radar'] });
      void qc.invalidateQueries({ queryKey: ['companies'] });
      void qc.invalidateQueries({ queryKey: ['digest'] });
    },
  });
}

export function useLoginMutation() {
  return useMutation({ mutationFn: endpoints.login });
}

export function useSignupMutation() {
  return useMutation({ mutationFn: endpoints.signup });
}

export function useForgotPasswordMutation() {
  return useMutation({ mutationFn: endpoints.forgotPassword });
}

export function useResetPasswordMutation() {
  return useMutation({ mutationFn: endpoints.resetPassword });
}

export function useAdminUsersQuery() {
  return useQuery({
    queryKey: queryKeys.adminUsers,
    queryFn: () => endpoints.adminUsers(),
  });
}

export function useAdminTerritoryStatsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.adminTerritoryStats,
    queryFn: () => endpoints.adminTerritoryStats(),
    enabled: options?.enabled ?? true,
  });
}

export function useAdminTerritoryRequestsQuery(
  status?: TerritoryRequestStatus,
) {
  return useQuery({
    queryKey: queryKeys.adminRequests(status),
    queryFn: () => endpoints.adminTerritoryRequests(status),
  });
}

export function useApproveTerritoryRequestMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reviewNote }: { id: string; reviewNote?: string }) =>
      endpoints.approveTerritoryRequest(id, reviewNote),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin'] });
      void qc.invalidateQueries({ queryKey: ['territories'] });
      void qc.invalidateQueries({ queryKey: queryKeys.coverage });
    },
  });
}

export function useRejectTerritoryRequestMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reviewNote }: { id: string; reviewNote?: string }) =>
      endpoints.rejectTerritoryRequest(id, reviewNote),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin'] });
    },
  });
}

export function useAssignTerritoryMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: endpoints.assignTerritory,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin'] });
      void qc.invalidateQueries({ queryKey: ['territories'] });
      void qc.invalidateQueries({ queryKey: queryKeys.coverage });
    },
  });
}

export function useAdminScrapeLocationPoliciesQuery() {
  return useQuery({
    queryKey: queryKeys.adminScrapeLocationPolicies,
    queryFn: () => endpoints.adminScrapeLocationPolicies(),
  });
}

export function useCreateScrapeLocationPolicyMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: endpoints.createScrapeLocationPolicy,
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: queryKeys.adminScrapeLocationPolicies,
      });
    },
  });
}

export function useUpdateScrapeLocationPolicyMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: {
      id: string;
      label?: string;
      country?: string | null;
      state?: string | null;
      city?: string | null;
      region?: string | null;
      areaId?: string | null;
      active?: boolean;
    }) => endpoints.updateScrapeLocationPolicy(id, body),
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: queryKeys.adminScrapeLocationPolicies,
      });
    },
  });
}

export function useDeleteScrapeLocationPolicyMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => endpoints.deleteScrapeLocationPolicy(id),
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: queryKeys.adminScrapeLocationPolicies,
      });
    },
  });
}
