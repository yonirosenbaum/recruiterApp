"use client";

import { Button, Chip } from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { HeatGauge } from "@/components/common/HeatGauge";
import { formatContactedLabel } from "@/lib/format-contacted";
import {
  useMarkContactedMutation,
  useUndoOutreachMutation,
} from "@/lib/query/hooks";
import type { LastContacted, RadarTrigger } from "@/types/api";

const Card = styled.article<{ $contacted?: boolean }>`
  background: ${({ $contacted }) => ($contacted ? "#f8fafc" : "#fff")};
  border: 1px solid ${({ $contacted }) => ($contacted ? "#e2e8f0" : "#e8edf5")};
  border-radius: 14px;
  padding: 18px 20px;
  opacity: ${({ $contacted }) => ($contacted ? 0.82 : 1)};
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 4px;
`;

const CategoryHint = styled.p`
  margin: 0 0 8px;
  color: #64748b;
  font-size: 12.5px;
  line-height: 1.4;
`;

const JobTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 750;
  color: #0f172a;
`;

const Meta = styled.p`
  margin: 4px 0 0;
  color: #64748b;
  font-size: 13px;
`;

const Insight = styled.p`
  margin: 12px 0 0;
  color: #334155;
  font-size: 13.5px;
  line-height: 1.5;
`;

const Points = styled.div`
  margin-top: 14px;
  background: #f8fafc;
  border: 1px solid #e8edf5;
  border-radius: 12px;
  padding: 12px 14px;
`;

const PointsLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #64748b;
  margin-bottom: 8px;
`;

const PointsList = styled.ul`
  margin: 0;
  padding: 0 0 0 18px;
  color: #1e293b;
  font-size: 13px;
  line-height: 1.45;

  li + li {
    margin-top: 4px;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
  align-items: center;
`;

const Footer = styled.div`
  margin-top: 12px;
  color: #94a3b8;
  font-size: 12px;
`;

const Pitch = styled.p`
  margin: 12px 0 0;
  padding: 10px 12px;
  background: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 10px;
  color: #9a3412;
  font-size: 13px;
  line-height: 1.45;
`;

const UndoHint = styled.span`
  font-size: 12px;
  color: #64748b;
`;

type TriggerCardProps = {
  trigger: RadarTrigger;
  compact?: boolean;
};

export function TriggerCard({ trigger, compact = false }: TriggerCardProps) {
  const markContacted = useMarkContactedMutation();
  const undoOutreach = useUndoOutreachMutation();
  const [pendingUndoId, setPendingUndoId] = useState<string | null>(null);
  const [optimisticContacted, setOptimisticContacted] =
    useState<LastContacted | null>(null);

  const lastContacted = optimisticContacted ?? trigger.lastContacted;

  useEffect(() => {
    if (!pendingUndoId) return;
    const timer = window.setTimeout(() => setPendingUndoId(null), 8000);
    return () => window.clearTimeout(timer);
  }, [pendingUndoId]);

  const onMarkContacted = async () => {
    const result = await markContacted.mutateAsync({
      companyId: trigger.companyId,
      canonicalJobId: trigger.canonicalJobId,
      hiringSignalId: trigger.id,
    });
    setOptimisticContacted(result.lastContacted);
    setPendingUndoId(result.event.id);
  };

  const onUndo = async () => {
    if (!pendingUndoId) return;
    const id = pendingUndoId;
    setPendingUndoId(null);
    await undoOutreach.mutateAsync(id);
    setOptimisticContacted(null);
  };

  return (
    <Card $contacted={Boolean(lastContacted)}>
      <Top>
        <div>
          <Tags>
            <Chip
              size="small"
              label={trigger.category}
              color="primary"
              variant="outlined"
            />
            <Chip size="small" label={trigger.industry} variant="outlined" />
            {lastContacted && (
              <Chip
                size="small"
                color="default"
                label={formatContactedLabel(lastContacted)}
                sx={{ background: "#e2e8f0", fontWeight: 600 }}
              />
            )}
          </Tags>
          {trigger.categoryHint ? (
            <CategoryHint>{trigger.categoryHint}</CategoryHint>
          ) : null}
          <JobTitle>{trigger.jobTitle}</JobTitle>
          <Meta>
            {trigger.companyName} · {trigger.location}
          </Meta>
        </div>
        <HeatGauge score={trigger.heatScore} size={compact ? 56 : 68} />
      </Top>

      <Insight>{trigger.insightText}</Insight>

      {trigger.benchmarkPitch ? <Pitch>{trigger.benchmarkPitch}</Pitch> : null}

      {!compact && trigger.talkingPoints.length > 0 && (
        <Points>
          <PointsLabel>WHY REACH OUT</PointsLabel>
          <PointsList>
            {trigger.talkingPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </PointsList>
        </Points>
      )}

      {!compact && (
        <Actions>
          {!lastContacted && (
            <Button
              variant="contained"
              size="small"
              onClick={() => void onMarkContacted()}
              disabled={markContacted.isPending || undoOutreach.isPending}
            >
              Mark contacted
            </Button>
          )}
          {pendingUndoId && (
            <>
              <Button
                variant="text"
                size="small"
                onClick={() => void onUndo()}
                disabled={undoOutreach.isPending}
              >
                Undo
              </Button>
              <UndoHint>Mis-tap? Undo for a few seconds</UndoHint>
            </>
          )}
        </Actions>
      )}

      <Footer>
        Live {trigger.daysLive} day{trigger.daysLive === 1 ? "" : "s"} · First
        seen{" "}
        {new Date(trigger.firstSeenDate).toLocaleDateString("en-AU", {
          day: "numeric",
          month: "short",
          year: "numeric",
          timeZone: "Australia/Sydney",
        })}
      </Footer>
    </Card>
  );
}
