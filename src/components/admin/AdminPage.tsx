'use client';

import { useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tab,
  Tabs,
  TextField,
} from '@mui/material';
import { AppHeader } from '@/components/layout/AppHeader';
import {
  TerritoryVerticalSelect,
  type TerritorySelection,
} from '@/components/territory/TerritoryVerticalSelect';
import {
  useAdminTerritoryRequestsQuery,
  useAdminUsersQuery,
  useApproveTerritoryRequestMutation,
  useAssignTerritoryMutation,
  useRejectTerritoryRequestMutation,
  useTerritoryOptionsQuery,
  useAdminScrapeLocationPoliciesQuery,
  useCreateScrapeLocationPolicyMutation,
  useUpdateScrapeLocationPolicyMutation,
  useDeleteScrapeLocationPolicyMutation,
} from '@/lib/query/hooks';
import { AdminCoverageTable } from '@/components/admin/AdminCoverageTable';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.section`
  background: #fff;
  border: 1px solid #e8edf5;
  border-radius: 14px;
  padding: 18px 20px;
`;

const Title = styled.h2`
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 750;
`;

const Row = styled.div`
  border-top: 1px solid #eef2f7;
  padding: 12px 0;

  &:first-of-type {
    border-top: 0;
  }
`;

const Meta = styled.div`
  color: #64748b;
  font-size: 12px;
  margin-top: 4px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
`;

const AssignBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
`;

export function AdminPage() {
  const [tab, setTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState<
    'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'
  >('PENDING');
  const usersQuery = useAdminUsersQuery();
  const requestsQuery = useAdminTerritoryRequestsQuery(
    statusFilter === 'ALL' ? undefined : statusFilter,
  );
  const catalogQuery = useTerritoryOptionsQuery('all');
  const approve = useApproveTerritoryRequestMutation();
  const reject = useRejectTerritoryRequestMutation();
  const assign = useAssignTerritoryMutation();
  const policiesQuery = useAdminScrapeLocationPoliciesQuery();
  const createPolicy = useCreateScrapeLocationPolicyMutation();
  const updatePolicy = useUpdateScrapeLocationPolicyMutation();
  const deletePolicy = useDeleteScrapeLocationPolicyMutation();

  const [assignUserId, setAssignUserId] = useState('');
  const [selection, setSelection] = useState<TerritorySelection>({
    areaId: '',
    verticalId: '',
  });
  const [reviewNote, setReviewNote] = useState('');
  const [policyForm, setPolicyForm] = useState({
    label: '',
    country: 'AU',
    state: '',
    city: '',
    region: '',
    areaId: '',
  });

  const recruiters = useMemo(
    () =>
      usersQuery.data?.users.filter((u) => u.role === 'RECRUITER') ?? [],
    [usersQuery.data],
  );

  return (
    <>
      <AppHeader
        title="Admin"
        subtitle="Users, territories, coverage, and scrape location allowlists."
      />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Territory requests" />
        <Tab label="Users" />
        <Tab label="Assign slot" />
        <Tab label="Scrape locations" />
        <Tab label="Coverage" />
      </Tabs>

      {tab === 0 && (
        <Card>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
              marginBottom: 8,
            }}
          >
            <Title>Territory requests</Title>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="status-filter">Status</InputLabel>
              <Select
                labelId="status-filter"
                label="Status"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as typeof statusFilter,
                  )
                }
              >
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="APPROVED">Approved</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
                <MenuItem value="ALL">All</MenuItem>
              </Select>
            </FormControl>
          </div>

          {requestsQuery.isLoading && <CircularProgress size={24} />}
          {requestsQuery.isError && (
            <Alert severity="error">Failed to load requests.</Alert>
          )}

          {requestsQuery.data?.requests.length === 0 && (
            <Alert severity="info">No requests in this filter.</Alert>
          )}

          {requestsQuery.data?.requests.map((req) => (
            <Row key={req.id}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <strong>
                  {req.areaName} — {req.verticalName}
                </strong>
                <Chip size="small" label={req.status} />
              </div>
              <Meta>
                {req.user?.fullName} · {req.user?.agencyName} · {req.user?.email}
              </Meta>
              <Meta>
                Requested{' '}
                {new Date(req.createdAt).toLocaleString('en-AU')}
                {req.notes ? ` · “${req.notes}”` : ''}
              </Meta>
              {req.status === 'PENDING' && (
                <Actions>
                  <Button
                    size="small"
                    variant="contained"
                    disabled={approve.isPending}
                    onClick={() =>
                      approve.mutate({ id: req.id, reviewNote })
                    }
                  >
                    Approve
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    disabled={reject.isPending}
                    onClick={() =>
                      reject.mutate({ id: req.id, reviewNote })
                    }
                  >
                    Reject
                  </Button>
                </Actions>
              )}
            </Row>
          ))}

          <TextField
            sx={{ mt: 2 }}
            size="small"
            fullWidth
            label="Review note (optional, applied to next action)"
            value={reviewNote}
            onChange={(e) => setReviewNote(e.target.value)}
          />
        </Card>
      )}

      {tab === 1 && (
        <Card>
          <Title>All users</Title>
          {usersQuery.isLoading && <CircularProgress size={24} />}
          {usersQuery.data?.users.map((user) => (
            <Row key={user.id}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <strong>{user.fullName}</strong>
                <Chip size="small" label={user.role} variant="outlined" />
                {user.pendingRequests > 0 && (
                  <Chip
                    size="small"
                    color="warning"
                    label={`${user.pendingRequests} pending`}
                  />
                )}
              </div>
              <Meta>
                {user.email} · {user.agencyName}
              </Meta>
              <Meta>
                Allocations:{' '}
                {user.allocations.length === 0
                  ? 'none'
                  : user.allocations
                      .map((a) => `${a.areaName} / ${a.verticalName}`)
                      .join('; ')}
              </Meta>
            </Row>
          ))}
        </Card>
      )}

      {tab === 2 && (
        <Grid>
          <Card>
            <Title>Direct assign (super admin)</Title>
            <AssignBox>
              <FormControl fullWidth>
                <InputLabel id="assign-user">Recruiter</InputLabel>
                <Select
                  labelId="assign-user"
                  label="Recruiter"
                  value={assignUserId}
                  onChange={(e) => setAssignUserId(e.target.value)}
                >
                  {recruiters.map((u) => (
                    <MenuItem key={u.id} value={u.id}>
                      {u.fullName} ({u.agencyName})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TerritoryVerticalSelect
                options={
                  catalogQuery.data
                    ? {
                        ...catalogQuery.data,
                        combinations: catalogQuery.data.combinations.filter(
                          (c) => !c.held,
                        ),
                        areas: catalogQuery.data.areas.filter((a) =>
                          catalogQuery.data!.combinations.some(
                            (c) => c.areaId === a.id && !c.held,
                          ),
                        ),
                        verticals: catalogQuery.data.verticals.filter((v) =>
                          catalogQuery.data!.combinations.some(
                            (c) => c.verticalId === v.id && !c.held,
                          ),
                        ),
                      }
                    : undefined
                }
                value={selection}
                onChange={setSelection}
              />

              {assign.isError && (
                <Alert severity="error">
                  {(assign.error as Error).message}
                </Alert>
              )}
              {assign.isSuccess && (
                <Alert severity="success">Territory assigned.</Alert>
              )}

              <Button
                variant="contained"
                disabled={
                  !assignUserId ||
                  !selection.areaId ||
                  !selection.verticalId ||
                  assign.isPending
                }
                onClick={() =>
                  assign.mutate({
                    userId: assignUserId,
                    areaId: selection.areaId,
                    verticalId: selection.verticalId,
                  })
                }
              >
                Assign territory
              </Button>
            </AssignBox>
          </Card>
          <Card>
            <Title>Catalog visibility</Title>
            <Meta>
              Super admins load <code>scope=all</code>. Recruiters only receive
              allocated pairs on <code>scope=allocated</code>, and open slots on{' '}
              <code>scope=requestable</code> when submitting a request.
            </Meta>
            {catalogQuery.data && (
              <Meta style={{ marginTop: 12 }}>
                {catalogQuery.data.combinations.length} area×vertical
                combinations in catalog (including held).
              </Meta>
            )}
          </Card>
        </Grid>
      )}

      {tab === 3 && (
        <Grid>
          <Card>
            <Title>Allowed scrape locations</Title>
            <Meta style={{ marginBottom: 12 }}>
              When any policy is active, crawls only keep jobs matching at least
              one rule (country / state / city / region). Empty fields = wildcard.
              No active policies = open mode (all locations).
            </Meta>

            {policiesQuery.isLoading && <CircularProgress size={24} />}
            {policiesQuery.isError && (
              <Alert severity="error">Failed to load policies.</Alert>
            )}

            {policiesQuery.data?.policies.map((p) => (
              <Row key={p.id}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <strong>{p.label}</strong>
                  <Chip
                    size="small"
                    label={p.active ? 'active' : 'off'}
                    color={p.active ? 'success' : 'default'}
                    variant="outlined"
                  />
                </div>
                <Meta>
                  {[p.country, p.state, p.city, p.region]
                    .filter(Boolean)
                    .join(' · ') || 'any location'}
                  {p.areaName ? ` · area: ${p.areaName}` : ''}
                </Meta>
                <Actions>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() =>
                      updatePolicy.mutate({ id: p.id, active: !p.active })
                    }
                  >
                    {p.active ? 'Disable' : 'Enable'}
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    variant="text"
                    onClick={() => deletePolicy.mutate(p.id)}
                  >
                    Delete
                  </Button>
                </Actions>
              </Row>
            ))}
          </Card>

          <Card>
            <Title>Add location policy</Title>
            <AssignBox>
              <TextField
                size="small"
                label="Label"
                value={policyForm.label}
                onChange={(e) =>
                  setPolicyForm((f) => ({ ...f, label: e.target.value }))
                }
              />
              <TextField
                size="small"
                label="Country (e.g. AU)"
                value={policyForm.country}
                onChange={(e) =>
                  setPolicyForm((f) => ({ ...f, country: e.target.value }))
                }
              />
              <TextField
                size="small"
                label="State (e.g. NSW)"
                value={policyForm.state}
                onChange={(e) =>
                  setPolicyForm((f) => ({ ...f, state: e.target.value }))
                }
              />
              <TextField
                size="small"
                label="City (optional)"
                value={policyForm.city}
                onChange={(e) =>
                  setPolicyForm((f) => ({ ...f, city: e.target.value }))
                }
              />
              <TextField
                size="small"
                label="Region (optional)"
                value={policyForm.region}
                onChange={(e) =>
                  setPolicyForm((f) => ({ ...f, region: e.target.value }))
                }
              />
              <FormControl fullWidth size="small">
                <InputLabel id="policy-area">Link to area (optional)</InputLabel>
                <Select
                  labelId="policy-area"
                  label="Link to area (optional)"
                  value={policyForm.areaId}
                  onChange={(e) =>
                    setPolicyForm((f) => ({ ...f, areaId: e.target.value }))
                  }
                >
                  <MenuItem value="">None</MenuItem>
                  {(catalogQuery.data?.areas ?? []).map((a) => (
                    <MenuItem key={a.id} value={a.id}>
                      {a.name} ({a.state})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {createPolicy.isError && (
                <Alert severity="error">
                  {(createPolicy.error as Error).message}
                </Alert>
              )}
              {createPolicy.isSuccess && (
                <Alert severity="success">Policy created.</Alert>
              )}

              <Button
                variant="contained"
                disabled={!policyForm.label.trim() || createPolicy.isPending}
                onClick={() =>
                  createPolicy.mutate({
                    label: policyForm.label.trim(),
                    country: policyForm.country.trim() || null,
                    state: policyForm.state.trim() || null,
                    city: policyForm.city.trim() || null,
                    region: policyForm.region.trim() || null,
                    areaId: policyForm.areaId || null,
                    active: true,
                  })
                }
              >
                Add policy
              </Button>
            </AssignBox>
          </Card>
        </Grid>
      )}

      {tab === 4 && (
        <Card>
          <Title>Jobs and companies by city × vertical</Title>
          <AdminCoverageTable />
        </Card>
      )}
    </>
  );
}
