'use client';

import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  Alert,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
} from '@mui/material';
import { AppHeader } from '@/components/layout/AppHeader';
import { MarketIntelPanel } from '@/components/benchmarks/MarketIntelPanel';
import {
  useBenchmarkOptionsQuery,
  useBenchmarksQuery,
} from '@/lib/query/hooks';

const Intro = styled.p`
  margin: 0 0 16px;
  color: #64748b;
  font-size: 14px;
  max-width: 640px;
`;

const Columns = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const Column = styled.div`
  min-width: 0;
`;

const Controls = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
`;

const Panel = styled.section`
  background: #fff;
  border: 1px solid #e8edf5;
  border-radius: 14px;
  padding: 18px 20px;
  min-width: 0;
`;

const CardTitle = styled.h2`
  margin: 0 0 14px;
  font-size: 16px;
  font-weight: 750;
`;

const Metrics = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin: 14px 0;
`;

const Metric = styled.div`
  background: #f8fafc;
  border: 1px solid #e8edf5;
  border-radius: 12px;
  padding: 12px 14px;
`;

const MetricLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #64748b;
`;

const MetricValue = styled.div`
  margin-top: 4px;
  font-size: 22px;
  font-weight: 750;
  color: #0f172a;
`;

const PitchBox = styled.pre`
  margin: 0 0 12px;
  white-space: pre-wrap;
  word-break: break-word;
  background: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 12px;
  padding: 12px 14px;
  font: inherit;
  font-size: 13.5px;
  line-height: 1.5;
  color: #9a3412;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Hint = styled.p`
  margin: 10px 0 0;
  color: #94a3b8;
  font-size: 12.5px;
`;

const SectionTitle = styled.h3`
  margin: 18px 0 10px;
  font-size: 13px;
  font-weight: 750;
  letter-spacing: 0.04em;
  color: #64748b;
`;

function formatAud(value: number | null | undefined): string {
  if (value == null) return '—';
  return `$${value.toLocaleString('en-AU')}`;
}

function csvEscape(value: string | number | null | undefined): string {
  const raw = value == null ? '' : String(value);
  if (/[",\n]/.test(raw)) return `"${raw.replace(/"/g, '""')}"`;
  return raw;
}

export function BenchmarksPage() {
  const optionsQuery = useBenchmarkOptionsQuery();
  const [areaId, setAreaId] = useState('');
  const [verticalId, setVerticalId] = useState('');
  const [titleQuery, setTitleQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [debounced, setDebounced] = useState({
    areaId: '',
    verticalId: '',
    titleQuery: '',
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebounced({ areaId, verticalId, titleQuery });
    }, 400);
    return () => window.clearTimeout(timer);
  }, [areaId, verticalId, titleQuery]);

  const params = useMemo(() => {
    const title = debounced.titleQuery.trim();
    if (!debounced.areaId || !title) return null;
    return {
      areaId: debounced.areaId,
      titleQuery: title,
      verticalId: debounced.verticalId || undefined,
    };
  }, [debounced]);

  const resultQuery = useBenchmarksQuery(params);

  const onCopyPitch = async () => {
    const text =
      resultQuery.data?.pitchParagraph ?? resultQuery.data?.pitchLine;
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const onDownloadCsv = () => {
    const r = resultQuery.data;
    if (!r) return;
    const header = [
      'title',
      'area',
      'vertical',
      'lookback_days',
      'closed_roles',
      'open_roles',
      'median_ttf_days',
      'salary_median',
      'salary_mean',
      'salary_min',
      'salary_p25',
      'salary_p75',
      'salary_max',
      'salary_roles',
      'your_open_days',
      'your_open_count',
      'available',
      'slug',
    ];
    const row = [
      r.titleQuery,
      r.areaName,
      r.verticalName ?? '',
      r.lookbackDays,
      r.sampleSize,
      r.openRoleCount,
      r.marketMedianTtfDays,
      r.salary.mid,
      r.salary.mean,
      r.salary.min,
      r.salary.p25,
      r.salary.p75,
      r.salary.max,
      r.salary.sampleSize,
      r.yourOpenDays,
      r.yourOpenCount,
      r.available ? 'yes' : 'no',
      r.slug,
    ].map(csvEscape);
    const blob = new Blob([[header.join(','), row.join(',')].join('\n')], {
      type: 'text/csv;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `benchmark-${r.slug}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <AppHeader
        title="Benchmarks"
        subtitle="Role×city fill times, salary bands, and market intel for your patch."
      />

      <Intro>
        Market stats for a title use the full city catalog. “Your opens” only
        count live roles on your allocated patch. Market intel is
        allocation-scoped.
      </Intro>

      <Columns>
        <Column>
          <Panel>
          <CardTitle>Title × city slice</CardTitle>
          {optionsQuery.isLoading && <CircularProgress sx={{ mt: 2 }} />}
          {optionsQuery.isError && (
            <Alert severity="error">Failed to load benchmark options.</Alert>
          )}

          {optionsQuery.data && (
            <>
          <Controls>
            <TextField
              select
              size="small"
              label="Area"
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
            >
              <MenuItem value="">Select city</MenuItem>
              {optionsQuery.data.areas.map((a) => (
                <MenuItem key={a.id} value={a.id}>
                  {a.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              label="Vertical (optional)"
              value={verticalId}
              onChange={(e) => setVerticalId(e.target.value)}
            >
              <MenuItem value="">All verticals</MenuItem>
              {optionsQuery.data.verticals.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  {v.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              size="small"
              label="Title"
              placeholder="e.g. Site Manager"
              value={titleQuery}
              onChange={(e) => setTitleQuery(e.target.value)}
            />
          </Controls>

          {optionsQuery.data.topTitles.length > 0 && (
            <Hint style={{ marginTop: -8, marginBottom: 12 }}>
              Popular:{' '}
              {optionsQuery.data.topTitles.slice(0, 8).map((t) => (
                <button
                  key={t.title}
                  type="button"
                  onClick={() => setTitleQuery(t.title)}
                  style={{
                    marginRight: 8,
                    marginBottom: 4,
                    border: '1px solid #e2e8f0',
                    background: '#fff',
                    borderRadius: 999,
                    padding: '2px 10px',
                    fontSize: 12,
                    cursor: 'pointer',
                    color: '#334155',
                  }}
                >
                  {t.title}
                </button>
              ))}
            </Hint>
          )}

          {!params && (
            <Hint>Pick a city and title to load the live slice.</Hint>
          )}

          {params && resultQuery.isLoading && (
            <CircularProgress sx={{ mt: 2 }} size={28} />
          )}
          {params && resultQuery.isError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              Failed to load benchmarks for this slice.
            </Alert>
          )}

          {resultQuery.data && (
            <>
              {!resultQuery.data.available ? (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Not enough closed roles yet ({resultQuery.data.sampleSize}{' '}
                  found, need ≥ {optionsQuery.data.minSample}). Try a broader
                  title or another city.
                </Alert>
              ) : null}

              <Metrics>
                <Metric>
                  <MetricLabel>MEDIAN TTF</MetricLabel>
                  <MetricValue>
                    {resultQuery.data.marketMedianTtfDays ?? '—'}
                    {resultQuery.data.marketMedianTtfDays != null ? 'd' : ''}
                  </MetricValue>
                </Metric>
                <Metric>
                  <MetricLabel>YOUR OPENS</MetricLabel>
                  <MetricValue>
                    {resultQuery.data.yourOpenDays ?? '—'}
                    {resultQuery.data.yourOpenDays != null ? 'd' : ''}
                  </MetricValue>
                </Metric>
                <Metric>
                  <MetricLabel>OPEN ROLES</MetricLabel>
                  <MetricValue>{resultQuery.data.openRoleCount}</MetricValue>
                </Metric>
                <Metric>
                  <MetricLabel>CLOSED ROLES</MetricLabel>
                  <MetricValue>{resultQuery.data.sampleSize}</MetricValue>
                </Metric>
              </Metrics>

              <SectionTitle>ADVERTISED SALARY (MIDPOINTS)</SectionTitle>
              <Metrics>
                <Metric>
                  <MetricLabel>MEDIAN</MetricLabel>
                  <MetricValue>
                    {formatAud(resultQuery.data.salary.mid)}
                  </MetricValue>
                </Metric>
                <Metric>
                  <MetricLabel>MEAN</MetricLabel>
                  <MetricValue>
                    {formatAud(resultQuery.data.salary.mean)}
                  </MetricValue>
                </Metric>
                <Metric>
                  <MetricLabel>LOW</MetricLabel>
                  <MetricValue>
                    {formatAud(resultQuery.data.salary.min)}
                  </MetricValue>
                </Metric>
                <Metric>
                  <MetricLabel>P25</MetricLabel>
                  <MetricValue>
                    {formatAud(resultQuery.data.salary.p25)}
                  </MetricValue>
                </Metric>
                <Metric>
                  <MetricLabel>P75</MetricLabel>
                  <MetricValue>
                    {formatAud(resultQuery.data.salary.p75)}
                  </MetricValue>
                </Metric>
                <Metric>
                  <MetricLabel>HIGH</MetricLabel>
                  <MetricValue>
                    {formatAud(resultQuery.data.salary.max)}
                  </MetricValue>
                </Metric>
              </Metrics>

              <Hint>
                From {resultQuery.data.salary.sampleSize} ads with min+max
                salary · lookback {resultQuery.data.lookbackDays}d
                {resultQuery.data.salary.sampleSize > 0 &&
                resultQuery.data.salary.sampleSize < 10
                  ? ' · P25/P75 need ≥10 salary ads'
                  : ''}
              </Hint>

              {(resultQuery.data.pitchParagraph ||
                resultQuery.data.pitchLine) && (
                <>
                  <PitchBox>
                    {resultQuery.data.pitchParagraph ??
                      resultQuery.data.pitchLine}
                  </PitchBox>
                  <Actions>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => void onCopyPitch()}
                    >
                      {copied ? 'Copied' : 'Copy pitch'}
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={onDownloadCsv}
                    >
                      Download CSV
                    </Button>
                  </Actions>
                </>
              )}
            </>
          )}
            </>
          )}
          </Panel>
        </Column>

        <Column>
          <MarketIntelPanel />
        </Column>
      </Columns>
    </>
  );
}
