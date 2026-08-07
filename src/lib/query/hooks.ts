'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { endpoints, type TerritoryScope } from '@/lib/api/endpoints';
import type { TerritoryRequestStatus } from '@/types/api';
import { useAuth } from '@/components/auth/AuthProvider';

export const queryKeys = {
  radar: (filters?: { triggerType?: string; vertical?: string }) =>
    ['radar', filters] as const,
  digest: (userId?: string) => ['digest', userId] as const,
  companies: (userId?: string) => ['companies', userId] as const,
  company: (id: string, userId?: string) =>
    ['companies', userId, id] as const,
  coverage: ['coverage'] as const,
  territoryOptions: (scope: TerritoryScope) =>
    ['territories', 'options', scope] as const,
  myTerritoryRequests: ['territories', 'requests', 'mine'] as const,
  demoRadar: ['demo', 'radar'] as const,
  adminUsers: ['admin', 'users'] as const,
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

export function useDigestQuery() {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.digest(user?.id),
    queryFn: () => endpoints.digest(),
    enabled: Boolean(user),
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

export function useCoverageQuery() {
  return useQuery({
    queryKey: queryKeys.coverage,
    queryFn: () => endpoints.coverage(),
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
      void qc.invalidateQueries({ queryKey: queryKeys.digest() });
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
      void qc.invalidateQueries({ queryKey: queryKeys.digest() });
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
