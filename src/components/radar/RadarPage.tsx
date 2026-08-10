"use client";

import {
  Alert,
  Chip,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import { AppHeader } from "@/components/layout/AppHeader";
import { TriggerCard } from "@/components/radar/TriggerCard";
import { useRadarQuery } from "@/lib/query/hooks";

const Banner = styled.section`
  background: linear-gradient(135deg, #0f2744 0%, #1e3a5f 55%, #243b66 100%);
  color: #fff;
  border-radius: 16px;
  padding: 22px 24px;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const BannerTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 750;
  max-width: 640px;
  letter-spacing: -0.02em;
`;

const BannerSub = styled.p`
  margin: 8px 0 0;
  color: #cbd5e1;
  font-size: 13px;
  max-width: 560px;
`;

const Status = styled.div`
  position: absolute;
  top: 18px;
  right: 20px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #93c5fd;
  background: rgba(255, 255, 255, 0.08);
  padding: 6px 10px;
  border-radius: 999px;

  @media (max-width: 560px) {
    position: static;
    align-self: flex-end;
    margin-top: 10px;
  }
`;

const Metrics = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const MetricCard = styled.div`
  background: #fff;
  border: 1px solid #e8edf5;
  border-radius: 14px;
  padding: 14px 16px;
`;

const MetricLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #94a3b8;
  text-transform: uppercase;
`;

const MetricValue = styled.div<{ $compact?: boolean }>`
  margin-top: 6px;
  font-size: ${(p) => (p.$compact ? "16px" : "28px")};
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.03em;
  line-height: 1.2;
`;

const MetricHint = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
`;

const Filters = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 14px;
`;

const Count = styled.span`
  margin-left: auto;
  color: #64748b;
  font-size: 13px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export function RadarPage() {
  const [triggerType, setTriggerType] = useState("All triggers");
  const [vertical, setVertical] = useState("All verticals");
  const { data, isLoading, isError } = useRadarQuery({ triggerType, vertical });

  return (
    <>
      <AppHeader
        title="Radar"
        subtitle={
          data
            ? `Ranked BD triggers — ${new Date(
                data.scannedAt,
              ).toLocaleDateString("en-AU", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "Australia/Sydney",
              })}.`
            : "Ranked BD triggers."
        }
      />

      {isLoading && <CircularProgress sx={{ mt: 4 }} />}
      {isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to load radar signals from the API.
        </Alert>
      )}

      {data && (
        <>
          <Banner>
            <Status>{data.banner.statusLabel}</Status>
            <BannerTitle>{data.banner.headline}</BannerTitle>
            <BannerSub>{data.banner.subtext}</BannerSub>
          </Banner>

          <Metrics>
            <MetricCard>
              <MetricLabel>Active triggers</MetricLabel>
              <MetricValue>{data.metrics.newTriggersToday}</MetricValue>
              <MetricHint>on your patch right now</MetricHint>
            </MetricCard>
            <MetricCard>
              <MetricLabel>Median time-to-fill</MetricLabel>
              <MetricValue $compact={data.metrics.medianTimeToFillDays == null}>
                {data.metrics.medianTimeToFillDays == null
                  ? "Not available"
                  : `${data.metrics.medianTimeToFillDays}d`}
              </MetricValue>
              <MetricHint>for your verticals</MetricHint>
            </MetricCard>
            <MetricCard>
              <MetricLabel>Repost rate</MetricLabel>
              <MetricValue>{data.metrics.repostRatePercent}%</MetricValue>
              <MetricHint>for {data.metrics.repostRateScope}</MetricHint>
            </MetricCard>
            <MetricCard>
              <MetricLabel>Leads contacted today</MetricLabel>
              <MetricValue>{data.metrics.leadsContactedToday}</MetricValue>
              <MetricHint>{data.metrics.leadsContactedScope}</MetricHint>
            </MetricCard>
          </Metrics>

          <Filters>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <Select
                value={vertical}
                onChange={(e) => setVertical(e.target.value)}
                sx={{ background: "#fff", borderRadius: 2 }}
              >
                {data.filters.verticals.map((v) => (
                  <MenuItem key={v} value={v}>
                    {v}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {data.filters.triggerTypes.map((t) => (
              <Chip
                key={t}
                label={t}
                clickable
                color={triggerType === t ? "primary" : "default"}
                variant={triggerType === t ? "filled" : "outlined"}
                onClick={() => setTriggerType(t)}
                sx={{ background: triggerType === t ? undefined : "#fff" }}
              />
            ))}
            <Count>
              {data.triggers.length} of {data.metrics.newTriggersToday} triggers
            </Count>
          </Filters>

          <List>
            {data.triggers.map((trigger) => (
              <TriggerCard key={trigger.id} trigger={trigger} />
            ))}
          </List>
        </>
      )}
    </>
  );
}
