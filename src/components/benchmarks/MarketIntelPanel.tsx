"use client";

import styled from "styled-components";
import { Alert, Button, CircularProgress, Tab, Tabs } from "@mui/material";
import { useMarketIntelQuery, useSendDigestMutation } from "@/lib/query/hooks";
import type { MarketIntelCompanyRow, MarketIntelReport } from "@/types/api";

const Panel = styled.section`
  background: #fff;
  border: 1px solid #e8edf5;
  border-radius: 14px;
  padding: 18px 20px;
  min-width: 0;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 750;
`;

const Sub = styled.p`
  margin: 4px 0 14px;
  color: #64748b;
  font-size: 13px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
`;

const Block = styled.div`
  background: #f8fafc;
  border: 1px solid #e8edf5;
  border-radius: 12px;
  padding: 12px 14px;
`;

const BlockTitle = styled.div`
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 0.04em;
  color: #64748b;
  margin-bottom: 8px;
`;

const Row = styled.div`
  font-size: 13px;
  color: #334155;
  line-height: 1.4;
  padding: 4px 0;

  & + & {
    border-top: 1px solid #eef2f7;
  }

  strong {
    color: #0f172a;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
`;

const Empty = styled.p`
  margin: 0;
  color: #94a3b8;
  font-size: 13px;
`;

function formatAud(n: number | null): string {
  if (n == null) return "—";
  const sign = n > 0 ? "+" : "";
  return `${sign}$${Math.round(n).toLocaleString("en-AU")}`;
}

function CompanyBlock({
  title,
  rows,
}: {
  title: string;
  rows: MarketIntelCompanyRow[];
}) {
  if (rows && rows.length === 0) return null;
  return (
    <Block>
      <BlockTitle>{title}</BlockTitle>
      {rows.slice(0, 5).map((r) => (
        <Row key={r.companyId}>
          <strong>{r.companyName}</strong>
          <div style={{ color: "#64748b", fontSize: 12 }}>{r.note}</div>
        </Row>
      ))}
    </Block>
  );
}

function reportToMarkdown(report: MarketIntelReport): string {
  const section = (heading: string, body: string[]) =>
    body.length === 0 ? [] : [`## ${heading}`, ...body, ``];

  const lines = [
    `# ${report.periodLabel}`,
    ``,
    `Generated ${new Date(report.generatedAt).toLocaleString("en-AU")} · ${report.lookbackDays}d lookback`,
    ``,
    ...section(
      "Median days-to-fill (role × place)",
      report.ttfByRolePlace.map(
        (r) =>
          `- ${r.title} in ${r.place} (${r.placeKind}): ${r.medianTtfDays}d · ${r.sampleSize} closed`,
      ),
    ),
    ...section(
      "Repost rates by employer",
      report.repostByEmployer.map(
        (r) =>
          `- ${r.companyName}: ${r.repostRatePercent}% (${r.repostCount}/${r.liveCount} live)`,
      ),
    ),
    ...section(
      "Salary movement by vertical",
      report.salaryMovementByVertical.map((r) => {
        const delta = r.delta == null ? "n/a" : formatAud(r.delta);
        return `- ${r.verticalName}: recent ${formatAud(r.recentMedian).replace("+", "")} vs prior ${formatAud(r.priorMedian).replace("+", "")} (${delta})`;
      }),
    ),
    ...section(
      "Who's hiring",
      report.hiring.map((r) => `- ${r.companyName}: ${r.note}`),
    ),
    ...section(
      "Agency activity",
      report.agencyActivity.map((r) => `- ${r.companyName}: ${r.note}`),
    ),
    ...section(
      "Frozen",
      report.frozen.map((r) => `- ${r.companyName}: ${r.note}`),
    ),
    ...section(
      "Thawed",
      report.thawed.map((r) => `- ${r.companyName}: ${r.note}`),
    ),
  ];
  return lines.join("\n");
}

export function MarketIntelPanel({
  period,
  onPeriodChange,
}: {
  period: "weekly" | "quarterly";
  onPeriodChange: (period: "weekly" | "quarterly") => void;
}) {
  const { data, isLoading, isError } = useMarketIntelQuery("weekly", {
    enabled: period === "weekly",
  });
  const sendWeekly = useSendDigestMutation();

  const onDownloadWeekly = () => {
    if (!data) return;
    const blob = new Blob([reportToMarkdown(data)], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tipoff-weekly-market-intel.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasAnything =
    data &&
    (data.ttfByRolePlace.length > 0 ||
      data.repostByEmployer.length > 0 ||
      data.salaryMovementByVertical.length > 0 ||
      data.hiring.length > 0 ||
      data.agencyActivity.length > 0 ||
      data.frozen.length > 0 ||
      data.thawed.length > 0);

  return (
    <Panel>
      <Title>Market intel</Title>
      <Sub>
        {period === "quarterly"
          ? "The public quarterly edition — open it to share, or save a PDF."
          : "End-employer hiring only under Who's hiring. Agency ads are listed separately as competitor activity. Stats only appear when the sample is real (n≥10 rates, n≥20 salary, n≥10 closed for TTF)."}
      </Sub>

      <Tabs
        value={period}
        onChange={(_, value: "weekly" | "quarterly") => onPeriodChange(value)}
        sx={{ mb: 2, minHeight: 36 }}
      >
        <Tab value="weekly" label="Weekly snapshot" />
        <Tab value="quarterly" label="Quarterly Tipoff Report" />
      </Tabs>

      {period === "quarterly" && (
        <Actions style={{ marginTop: 0 }}>
          <Button href="/report" variant="contained" size="small">
            Open report
          </Button>
          <Button
            href="/report?print=1"
            target="_blank"
            rel="noreferrer"
            variant="outlined"
            size="small"
          >
            Download PDF
          </Button>
        </Actions>
      )}

      {period === "weekly" && isLoading && <CircularProgress size={28} />}
      {period === "weekly" && isError && (
        <Alert severity="error">Failed to load market intel.</Alert>
      )}

      {period === "weekly" && data && !hasAnything && (
        <Empty>
          Nothing solid enough to show yet for this lookback — modules appear as
          closed roles and live volume mature.
        </Empty>
      )}

      {period === "weekly" && data && hasAnything && (
        <>
          <Sub style={{ marginTop: 0 }}>
            {data.periodLabel} · {data.lookbackDays}d lookback
          </Sub>
          <Grid>
            {data.ttfByRolePlace.length > 0 && (
              <Block>
                <BlockTitle>TTF BY ROLE × PLACE</BlockTitle>
                {data.ttfByRolePlace.slice(0, 6).map((r) => (
                  <Row key={`${r.placeKind}-${r.place}-${r.title}`}>
                    <strong>{r.title}</strong> in {r.place}
                    <div style={{ color: "#64748b", fontSize: 12 }}>
                      {r.medianTtfDays}d median · {r.sampleSize} closed ·{" "}
                      {r.placeKind}
                    </div>
                  </Row>
                ))}
              </Block>
            )}

            {data.repostByEmployer.length > 0 && (
              <Block>
                <BlockTitle>REPOST BY EMPLOYER</BlockTitle>
                {data.repostByEmployer.slice(0, 6).map((r) => (
                  <Row key={r.companyId}>
                    <strong>{r.companyName}</strong>
                    <div style={{ color: "#64748b", fontSize: 12 }}>
                      {r.repostRatePercent}% · {r.repostCount}/{r.liveCount}{" "}
                      live
                    </div>
                  </Row>
                ))}
              </Block>
            )}

            {data.salaryMovementByVertical.length > 0 && (
              <Block>
                <BlockTitle>SALARY MOVEMENT BY VERTICAL</BlockTitle>
                {data.salaryMovementByVertical.slice(0, 6).map((r) => (
                  <Row key={r.verticalId}>
                    <strong>{r.verticalName}</strong>
                    <div style={{ color: "#64748b", fontSize: 12 }}>
                      {formatAud(r.delta)} vs prior half · now{" "}
                      {r.recentMedian != null
                        ? `$${Math.round(r.recentMedian).toLocaleString("en-AU")}`
                        : "—"}
                    </div>
                  </Row>
                ))}
              </Block>
            )}

            <CompanyBlock title="WHO'S HIRING" rows={data.hiring} />
            <CompanyBlock title="AGENCY ACTIVITY" rows={data.agencyActivity} />
            <CompanyBlock title="FROZEN" rows={data.frozen} />
            <CompanyBlock title="THAWED" rows={data.thawed} />
          </Grid>

          <Actions>
            <Button variant="outlined" size="small" onClick={onDownloadWeekly}>
              Download intel .md
            </Button>
            <Button
              variant="contained"
              size="small"
              disabled={sendWeekly.isPending}
              onClick={() => sendWeekly.mutate("weekly")}
            >
              {sendWeekly.isPending ? "Sending…" : "Email weekly digest to me"}
            </Button>
          </Actions>

          {sendWeekly.isSuccess && sendWeekly.variables === "weekly" && (
            <Alert severity="success" sx={{ mt: 1.5 }}>
              Weekly digest sent to {sendWeekly.data.to}
            </Alert>
          )}
        </>
      )}
    </Panel>
  );
}
