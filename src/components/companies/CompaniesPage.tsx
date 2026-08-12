"use client";

import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { AppHeader } from "@/components/layout/AppHeader";
import { useAuth } from "@/components/auth/AuthProvider";
import { formatContactedLabel } from "@/lib/format-contacted";
import {
  useCompaniesQuery,
  useCompanyQuery,
  useMarkContactedMutation,
  useSetCompanyAgencyMutation,
  useUndoOutreachMutation,
} from "@/lib/query/hooks";
import type { LastContacted } from "@/types/api";

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(280px, 0.9fr) minmax(0, 1.4fr);
  gap: 14px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CompanyBtn = styled.button<{ $active?: boolean; $contacted?: boolean }>`
  text-align: left;
  border: 1px solid
    ${({ $active, $contacted }) =>
      $active ? "#93c5fd" : $contacted ? "#e2e8f0" : "#e8edf5"};
  background: ${({ $active, $contacted }) =>
    $active ? "#eff6ff" : $contacted ? "#f8fafc" : "#fff"};
  border-radius: 14px;
  padding: 14px 16px;
  cursor: pointer;
  font: inherit;
  opacity: ${({ $contacted, $active }) => ($contacted && !$active ? 0.85 : 1)};
`;

const RowTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

const Name = styled.div`
  font-weight: 750;
  color: #0f172a;
`;

const Meta = styled.div`
  margin-top: 4px;
  color: #64748b;
  font-size: 12px;
`;

const Live = styled.span`
  color: #16a34a;
  font-weight: 700;
`;

const Detail = styled.section`
  background: #fff;
  border: 1px solid #e8edf5;
  border-radius: 14px;
  padding: 20px;
`;

const Industry = styled.div`
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #64748b;
`;

const DetailName = styled.h2`
  margin: 6px 0 0;
  font-size: 24px;
  letter-spacing: -0.02em;
`;

const Aliases = styled.p`
  margin: 4px 0 0;
  color: #64748b;
  font-size: 13px;
`;

const Activity = styled.div`
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: #f8fafc;
  border: 1px solid #e8edf5;
  border-radius: 12px;
`;

const ActivityText = styled.div`
  flex: 1;
  min-width: 180px;
  font-size: 13px;
  color: #334155;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 18px 0;
`;

const Stat = styled.div`
  border: 1px solid #e8edf5;
  border-radius: 12px;
  padding: 12px;
  background: #f8fafc;
`;

const StatLabel = styled.div`
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #94a3b8;
`;

const StatValue = styled.div`
  margin-top: 4px;
  font-size: 24px;
  font-weight: 800;
`;

const Timeline = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const TimelineItem = styled.li`
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 12px;
  padding: 8px 0;
  border-top: 1px solid #eef2f7;
  font-size: 13px;

  time {
    color: #64748b;
    font-weight: 600;
  }
`;

const Triggers = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TriggerRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border: 1px solid #e8edf5;
  border-radius: 10px;
  padding: 10px 12px;
`;

function AgencyToggle({
  companyId,
  isAgency,
}: {
  companyId: string;
  isAgency: boolean;
}) {
  const { user } = useAuth();
  const setAgency = useSetCompanyAgencyMutation();
  const canClassify = user?.role === "SUPER_ADMIN";

  if (!canClassify) {
    return (
      <Chip
        size="small"
        label={isAgency ? "Staffing agency" : "End-employer"}
        variant="outlined"
        sx={{ mt: 1 }}
      />
    );
  }

  return (
    <FormControlLabel
      sx={{ mt: 1, ml: 0 }}
      control={
        <Switch
          size="small"
          checked={isAgency}
          disabled={setAgency.isPending}
          onChange={(_, checked) => {
            void setAgency.mutateAsync({ id: companyId, isAgency: checked });
          }}
        />
      }
      label={isAgency ? "Staffing agency" : "End-employer"}
    />
  );
}

function MarkContactedControls({
  companyId,
  lastContacted,
  size = "small",
}: {
  companyId: string;
  lastContacted: LastContacted | null;
  size?: "small" | "medium";
}) {
  const markContacted = useMarkContactedMutation();
  const undoOutreach = useUndoOutreachMutation();
  const [pendingUndoId, setPendingUndoId] = useState<string | null>(null);

  useEffect(() => {
    if (!pendingUndoId) return;
    const timer = window.setTimeout(() => setPendingUndoId(null), 8000);
    return () => window.clearTimeout(timer);
  }, [pendingUndoId]);

  return (
    <>
      {lastContacted && (
        <Chip
          size="small"
          label={formatContactedLabel(lastContacted)}
          sx={{ background: "#e2e8f0", fontWeight: 600 }}
        />
      )}
      {!lastContacted && (
        <Button
          variant="contained"
          size={size}
          onClick={(e) => {
            e.stopPropagation();
            void markContacted
              .mutateAsync({ companyId })
              .then((result) => setPendingUndoId(result.event.id));
          }}
          disabled={markContacted.isPending || undoOutreach.isPending}
        >
          Mark contacted
        </Button>
      )}
      {pendingUndoId && (
        <Button
          variant="text"
          size={size}
          onClick={(e) => {
            e.stopPropagation();
            const id = pendingUndoId;
            setPendingUndoId(null);
            void undoOutreach.mutateAsync(id);
          }}
          disabled={undoOutreach.isPending}
        >
          Undo
        </Button>
      )}
    </>
  );
}

export function CompaniesPage() {
  const { data, isLoading, isError } = useCompaniesQuery();
  const [selectedId, setSelectedId] = useState<string>("");
  const detailQuery = useCompanyQuery(selectedId);

  useEffect(() => {
    if (!selectedId && data?.companies[0]) {
      setSelectedId(data.companies[0].id);
    }
  }, [data, selectedId]);

  return (
    <>
      <AppHeader title="Companies" subtitle="Longitudinal employer history." />

      {isLoading && <CircularProgress sx={{ mt: 4 }} />}
      {isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to load companies.
        </Alert>
      )}

      {data && (
        <Layout>
          <List>
            {data.companies.map((company) => (
              <CompanyBtn
                key={company.id}
                type="button"
                $active={company.id === selectedId}
                $contacted={Boolean(company.lastContacted)}
                onClick={() => setSelectedId(company.id)}
              >
                <RowTop>
                  <div>
                    <Name>
                      {company.name}
                      {company.isAgency ? (
                        <Chip
                          size="small"
                          label="Agency"
                          sx={{ ml: 1, height: 20, fontWeight: 700 }}
                        />
                      ) : null}
                    </Name>
                    <Meta>
                      {company.location} · {company.openRoles} open roles ·{" "}
                      {company.repostRatePercent}% repost ·{" "}
                      <Live>{company.liveCount} live</Live>
                    </Meta>
                  </div>
                </RowTop>
                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <MarkContactedControls
                    companyId={company.id}
                    lastContacted={company.lastContacted}
                  />
                </div>
              </CompanyBtn>
            ))}
          </List>

          <Detail>
            {detailQuery.isLoading && <CircularProgress size={24} />}
            {detailQuery.data && (
              <>
                <Industry>{detailQuery.data.industry.toUpperCase()}</Industry>
                <DetailName>{detailQuery.data.name}</DetailName>
                {detailQuery.data.aliases.length > 0 && (
                  <Aliases>
                    Resolved aliases: {detailQuery.data.aliases.join(", ")}
                  </Aliases>
                )}

                <AgencyToggle companyId={detailQuery.data.id} isAgency={detailQuery.data.isAgency} />

                <Activity>
                  <ActivityText>
                    {detailQuery.data.lastContacted
                      ? formatContactedLabel(detailQuery.data.lastContacted)
                      : "Not contacted yet on this territory."}
                  </ActivityText>
                  <MarkContactedControls
                    companyId={detailQuery.data.id}
                    lastContacted={detailQuery.data.lastContacted}
                  />
                </Activity>

                <Stats>
                  <Stat>
                    <StatLabel>OPEN ROLES</StatLabel>
                    <StatValue>{detailQuery.data.openRoles}</StatValue>
                  </Stat>
                  <Stat>
                    <StatLabel>MEDIAN TTF</StatLabel>
                    <StatValue>
                      {detailQuery.data.medianTimeToFillDays ?? "—"}
                      {detailQuery.data.medianTimeToFillDays != null ? "d" : ""}
                    </StatValue>
                  </Stat>
                  <Stat>
                    <StatLabel>REPOST RATE</StatLabel>
                    <StatValue>{detailQuery.data.repostRatePercent}%</StatValue>
                  </Stat>
                </Stats>

                <Timeline>
                  {detailQuery.data.timeline.map((event) => (
                    <TimelineItem key={`${event.date}-${event.text}`}>
                      <time>
                        {new Date(event.date).toLocaleDateString("en-AU", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </time>
                      <span>{event.text}</span>
                    </TimelineItem>
                  ))}
                </Timeline>

                <Triggers>
                  {detailQuery.data.activeTriggers.map((t) => (
                    <TriggerRow key={t.id}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                          }}
                        >
                          <Chip
                            size="small"
                            label={t.category}
                            color="primary"
                            variant="outlined"
                          />
                          <span style={{ fontWeight: 650 }}>{t.jobTitle}</span>
                        </div>
                        {t.benchmarkPitch ? (
                          <div
                            style={{
                              marginTop: 6,
                              color: "#9a3412",
                              fontSize: 12.5,
                              lineHeight: 1.4,
                            }}
                          >
                            {t.benchmarkPitch}
                          </div>
                        ) : null}
                      </div>
                      <strong>{t.heatScore}</strong>
                    </TriggerRow>
                  ))}
                </Triggers>
              </>
            )}
          </Detail>
        </Layout>
      )}
    </>
  );
}
