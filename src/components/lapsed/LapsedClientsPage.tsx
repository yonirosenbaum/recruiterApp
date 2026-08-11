'use client';

import { useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Pagination,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import Link from 'next/link';
import { AppHeader } from '@/components/layout/AppHeader';
import { OutreachActions } from '@/components/common/OutreachActions';
import {
  useImportLapsedClientsMutation,
  useLapsedClientsQuery,
  useRematchLapsedClientMutation,
  useRemoveLapsedClientMutation,
  useSetWatchedClientLabelMutation,
} from '@/lib/query/hooks';
import { parseCompanyNamesText } from '@/lib/parse-company-names';
import type { LapsedImportReport } from '@/types/api';

const PAGE_SIZE = 10;

const Intro = styled.p`
  margin: 0 0 16px;
  color: #64748b;
  font-size: 14px;
  max-width: 640px;
`;

const Section = styled.section`
  background: #fff;
  border: 1px solid #e8edf5;
  border-radius: 14px;
  padding: 18px 20px;
  margin-bottom: 14px;
`;

const SectionTitle = styled.h2`
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 750;
`;

const SectionSub = styled.p`
  margin: 0 0 14px;
  color: #64748b;
  font-size: 12px;
`;

const ListToolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
`;

const ListFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 12px;
`;

const FireCard = styled.article`
  border: 1px solid #e8edf5;
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 10px;
  background: #f8fafc;
`;

const CompanyName = styled.div`
  font-weight: 750;
  font-size: 15px;
  color: #0f172a;
`;

const Meta = styled.div`
  margin-top: 4px;
  font-size: 13px;
  color: #64748b;
`;

const JobList = styled.ul`
  margin: 8px 0 0;
  padding: 0 0 0 18px;
  font-size: 13px;
  color: #334155;
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-top: 1px solid #eef2f7;
  font-size: 13px;

  &:first-of-type {
    border-top: 0;
  }
`;

const RowActions = styled.div`
  display: flex;
  gap: 6px;
  flex-shrink: 0;
`;

const ImportActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  align-items: center;
`;

const HiddenFile = styled.input`
  display: none;
`;

const ErrorList = styled.ul`
  margin: 10px 0 0;
  padding: 0 0 0 18px;
  font-size: 13px;
  color: #b91c1c;
  max-height: 180px;
  overflow: auto;
`;

function matchesQuery(haystack: string, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return q
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => haystack.toLowerCase().includes(token));
}

function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function LapsedClientsPage() {
  const { data, isLoading, isError } = useLapsedClientsQuery();
  const importMutation = useImportLapsedClientsMutation();
  const removeMutation = useRemoveLapsedClientMutation();
  const rematchMutation = useRematchLapsedClientMutation();
  const labelMutation = useSetWatchedClientLabelMutation();
  const [importLabel, setImportLabel] = useState<'LAPSED' | 'DREAM'>('LAPSED');

  const fileRef = useRef<HTMLInputElement>(null);
  const [paste, setPaste] = useState('');
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [previewBlanks, setPreviewBlanks] = useState(0);
  const [previewHeader, setPreviewHeader] = useState<string | null>(null);
  const [localErrors, setLocalErrors] = useState<string[]>([]);
  const [pendingRows, setPendingRows] = useState<
    Array<{ row: number; name: string }>
  >([]);
  const [lastReport, setLastReport] = useState<LapsedImportReport | null>(null);

  const [firingSearch, setFiringSearch] = useState('');
  const [firingPage, setFiringPage] = useState(1);
  const [watchSearch, setWatchSearch] = useState('');
  const [watchPage, setWatchPage] = useState(1);

  const filteredFiring = useMemo(() => {
    const list = data?.firing ?? [];
    return list.filter((f) =>
      matchesQuery(
        [f.companyName, f.rawName, ...f.sampleJobs.map((j) => j.title)].join(
          ' ',
        ),
        firingSearch,
      ),
    );
  }, [data?.firing, firingSearch]);

  const filteredWatchlist = useMemo(() => {
    const list = data?.watchlist ?? [];
    return list.filter((w) =>
      matchesQuery(
        [w.rawName, w.companyName ?? '', w.matchStatus, w.matchNote ?? ''].join(
          ' ',
        ),
        watchSearch,
      ),
    );
  }, [data?.watchlist, watchSearch]);

  const firingPageCount = Math.max(
    1,
    Math.ceil(filteredFiring.length / PAGE_SIZE),
  );
  const watchPageCount = Math.max(
    1,
    Math.ceil(filteredWatchlist.length / PAGE_SIZE),
  );
  const safeFiringPage = Math.min(firingPage, firingPageCount);
  const safeWatchPage = Math.min(watchPage, watchPageCount);
  const pagedFiring = paginate(filteredFiring, safeFiringPage, PAGE_SIZE);
  const pagedWatchlist = paginate(filteredWatchlist, safeWatchPage, PAGE_SIZE);

  const applyParsedText = (text: string) => {
    const parsed = parseCompanyNamesText(text);
    setLocalErrors(parsed.errors);
    setPreviewBlanks(parsed.blankCount);
    setPreviewHeader(parsed.headerUsed);
    if (parsed.errors.some((e) => e.includes('maximum'))) {
      setPendingRows([]);
      setPreviewCount(parsed.rows.length);
      return;
    }
    setPendingRows(parsed.rows);
    setPreviewCount(parsed.rows.length);
  };

  const onFile = async (file: File | null) => {
    if (!file) return;
    const text = await file.text();
    setPaste('');
    applyParsedText(text);
  };

  const onConfirmImport = async () => {
    if (pendingRows.length === 0) return;
    const report = await importMutation.mutateAsync({
      rows: pendingRows,
      label: importLabel,
    });
    setLastReport(report);
    setPendingRows([]);
    setPreviewCount(null);
    setPaste('');
    setWatchPage(1);
    setFiringPage(1);
  };

  return (
    <>
      <AppHeader
        title="Watchlist"
        subtitle="Named accounts you care about — every event, not just the hot ones."
      />

      <Intro>
        Upload or paste company names only (no personal data). Label them as
        lapsed clients or dream clients — same machinery. Quiet weeks still
        confirm silence. Cap: {data?.capUsed ?? 0}/
        {data?.cap != null && Number.isFinite(data.cap) ? data.cap : '∞'}.
      </Intro>

      {isLoading && <CircularProgress sx={{ mt: 2 }} />}
      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load your watched clients.
        </Alert>
      )}

      {data && (
        <>
          <Section>
            <SectionTitle>Hiring now</SectionTitle>
            <SectionSub>
              Matched watched accounts with live roles in your exclusive
              territory.
            </SectionSub>
            {data.firing.length === 0 ? (
              <Meta>
                No activity on your {data.counts.total} watched account
                {data.counts.total === 1 ? '' : 's'}.
              </Meta>
            ) : (
              <>
                <ListToolbar>
                  <TextField
                    size="small"
                    placeholder="Search hiring clients or roles"
                    value={firingSearch}
                    onChange={(e) => {
                      setFiringSearch(e.target.value);
                      setFiringPage(1);
                    }}
                    sx={{
                      minWidth: { xs: '100%', sm: 260 },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 999,
                        background: '#fff',
                      },
                    }}
                  />
                  <Meta>
                    {filteredFiring.length} of {data.firing.length}
                    {firingSearch.trim() ? ' matching' : ''}
                  </Meta>
                </ListToolbar>
                {pagedFiring.length === 0 ? (
                  <Meta>No hiring clients match that search.</Meta>
                ) : (
                  pagedFiring.map((f) => (
                    <FireCard key={f.watchedClientId}>
                      <CompanyName>
                        {f.companyName}{' '}
                        <Chip
                          size="small"
                          label={f.label === 'DREAM' ? 'dream' : 'lapsed'}
                          variant="outlined"
                          sx={{ ml: 0.5, verticalAlign: 'middle' }}
                        />
                      </CompanyName>
                      <Meta>
                        {f.liveRoleCount} live role
                        {f.liveRoleCount === 1 ? '' : 's'}
                        {f.rawName !== f.companyName
                          ? ` · watched as “${f.rawName}”`
                          : ''}
                      </Meta>
                      {f.sampleJobs.length > 0 && (
                        <JobList>
                          {f.sampleJobs.map((j) => (
                            <li key={j.id}>
                              {j.title}
                              {j.heatScore != null
                                ? ` · heat ${j.heatScore}`
                                : ''}
                            </li>
                          ))}
                        </JobList>
                      )}
                    </FireCard>
                  ))
                )}
                {filteredFiring.length > PAGE_SIZE && (
                  <ListFooter>
                    <Meta>
                      Page {safeFiringPage} of {firingPageCount}
                    </Meta>
                    <Pagination
                      count={firingPageCount}
                      page={safeFiringPage}
                      onChange={(_, p) => setFiringPage(p)}
                      size="small"
                      color="primary"
                    />
                  </ListFooter>
                )}
              </>
            )}
          </Section>

          {(data.events?.length ?? 0) > 0 && (
            <Section>
              <SectionTitle>This week’s events</SectionTitle>
              <SectionSub>
                Every listing, city, salary, thaw, and repost — no heat gate.
              </SectionSub>
              {data.events!.map((event) => (
                <Row key={`${event.kind}-${event.canonicalJobId}-${event.line}`}>
                  <div>
                    <div style={{ fontWeight: 650 }}>{event.line}</div>
                    <Meta>
                      {event.label === 'DREAM' ? 'dream' : 'lapsed'}
                      {event.heatScore != null ? ` · heat ${event.heatScore}` : ''}
                    </Meta>
                    {event.companyId && (
                      <Meta>
                        <Link href={`/radar?company=${event.companyId}`}>
                          Open on radar
                        </Link>
                      </Meta>
                    )}
                    <div style={{ marginTop: 8 }}>
                      <OutreachActions
                        companyId={event.companyId}
                        canonicalJobId={event.canonicalJobId}
                        modes={['called', 'not_relevant']}
                      />
                    </div>
                  </div>
                </Row>
              ))}
            </Section>
          )}

          <Section>
            <SectionTitle>Import accounts</SectionTitle>
            <SectionSub>
              CSV or one company per line. Headers like “Company” / “Client”
              work; otherwise we use the first column.
            </SectionSub>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={importLabel}
              onChange={(_, v: 'LAPSED' | 'DREAM' | null) => {
                if (v) setImportLabel(v);
              }}
              sx={{ mb: 1.5 }}
            >
              <ToggleButton value="LAPSED">Lapsed clients</ToggleButton>
              <ToggleButton value="DREAM">Dream clients</ToggleButton>
            </ToggleButtonGroup>
            <TextField
              multiline
              minRows={4}
              fullWidth
              placeholder={'Acme Legal\nNorthline Advisory\nHalloran Group'}
              value={paste}
              onChange={(e) => {
                setPaste(e.target.value);
                if (e.target.value.trim()) applyParsedText(e.target.value);
                else {
                  setPendingRows([]);
                  setPreviewCount(null);
                  setLocalErrors([]);
                }
              }}
            />
            <ImportActions>
              <Button
                variant="outlined"
                size="small"
                onClick={() => fileRef.current?.click()}
              >
                Choose CSV / TXT
              </Button>
              <HiddenFile
                ref={fileRef}
                type="file"
                accept=".csv,.txt,text/csv,text/plain"
                onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
              />
              <Button
                variant="contained"
                size="small"
                disabled={
                  pendingRows.length === 0 || importMutation.isPending
                }
                onClick={() => void onConfirmImport()}
              >
                {importMutation.isPending
                  ? 'Importing…'
                  : `Import ${pendingRows.length || ''}`.trim()}
              </Button>
              {previewCount != null && (
                <Meta>
                  {previewCount} name{previewCount === 1 ? '' : 's'} ready
                  {previewBlanks > 0 ? ` · ${previewBlanks} blank skipped` : ''}
                  {previewHeader ? ` · column “${previewHeader}”` : ''}
                </Meta>
              )}
            </ImportActions>
            {localErrors.length > 0 && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                {localErrors.join(' ')}
              </Alert>
            )}
            {importMutation.isError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {(importMutation.error as Error)?.message ??
                  'Import failed. Check the list and try again.'}
              </Alert>
            )}
            {lastReport && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Received {lastReport.summary.received}: added{' '}
                {lastReport.summary.added}, already watched{' '}
                {lastReport.summary.alreadyWatched}, matched{' '}
                {lastReport.summary.matched}, unmatched{' '}
                {lastReport.summary.unmatched}, ambiguous{' '}
                {lastReport.summary.ambiguous}, rejected{' '}
                {lastReport.summary.rejected}.
              </Alert>
            )}
            {lastReport && lastReport.errors.length > 0 && (
              <ErrorList>
                {lastReport.errors.slice(0, 40).map((e) => (
                  <li key={`${e.row}-${e.message}`}>
                    Row {e.row}
                    {e.name ? ` (“${e.name}”)` : ''}: {e.message}
                  </li>
                ))}
              </ErrorList>
            )}
            {lastReport && lastReport.unmatchedSample.length > 0 && (
              <Meta style={{ marginTop: 10 }}>
                Unmatched sample: {lastReport.unmatchedSample.join(', ')}
              </Meta>
            )}
            {lastReport && lastReport.ambiguousSample.length > 0 && (
              <Meta style={{ marginTop: 6 }}>
                Ambiguous:{' '}
                {lastReport.ambiguousSample
                  .map(
                    (a) =>
                      `${a.name} → ${a.candidates.slice(0, 3).join(' / ')}`,
                  )
                  .join('; ')}
              </Meta>
            )}
          </Section>

          <Section>
            <SectionTitle>All accounts</SectionTitle>
            <SectionSub>
              {data.counts.total} watched · {data.counts.matched} matched ·{' '}
              {data.counts.unmatched} unmatched · {data.counts.ambiguous}{' '}
              ambiguous
            </SectionSub>
            {data.watchlist.length === 0 ? (
              <Meta>No accounts watched yet — import a list above.</Meta>
            ) : (
              <>
                <ListToolbar>
                  <TextField
                    size="small"
                    placeholder="Search watchlist"
                    value={watchSearch}
                    onChange={(e) => {
                      setWatchSearch(e.target.value);
                      setWatchPage(1);
                    }}
                    sx={{
                      minWidth: { xs: '100%', sm: 260 },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 999,
                        background: '#fff',
                      },
                    }}
                  />
                  <Meta>
                    {filteredWatchlist.length} of {data.watchlist.length}
                    {watchSearch.trim() ? ' matching' : ''}
                  </Meta>
                </ListToolbar>
                {pagedWatchlist.length === 0 ? (
                  <Meta>No watched clients match that search.</Meta>
                ) : (
                  pagedWatchlist.map((w) => (
                    <Row key={w.id}>
                      <div>
                        <div style={{ fontWeight: 650 }}>{w.rawName}</div>
                        <Meta>
                          {w.companyName && w.companyName !== w.rawName
                            ? `→ ${w.companyName} · `
                            : ''}
                          {w.matchNote ?? ''}
                        </Meta>
                        <Chip
                          size="small"
                          label={w.matchStatus.toLowerCase()}
                          sx={{ mt: 0.5, mr: 0.5 }}
                          color={
                            w.matchStatus === 'MATCHED'
                              ? 'success'
                              : w.matchStatus === 'AMBIGUOUS'
                                ? 'warning'
                                : 'default'
                          }
                          variant="outlined"
                        />
                        <Chip
                          size="small"
                          label={w.label === 'DREAM' ? 'dream' : 'lapsed'}
                          sx={{ mt: 0.5 }}
                          variant="outlined"
                        />
                      </div>
                      <RowActions>
                        <Button
                          size="small"
                          onClick={() =>
                            void labelMutation.mutateAsync({
                              id: w.id,
                              label: w.label === 'DREAM' ? 'LAPSED' : 'DREAM',
                            })
                          }
                          disabled={labelMutation.isPending}
                        >
                          {w.label === 'DREAM' ? 'Mark lapsed' : 'Mark dream'}
                        </Button>
                        {(w.matchStatus === 'UNMATCHED' ||
                          w.matchStatus === 'AMBIGUOUS') && (
                          <Button
                            size="small"
                            onClick={() =>
                              void rematchMutation.mutateAsync(w.id)
                            }
                            disabled={rematchMutation.isPending}
                          >
                            Rematch
                          </Button>
                        )}
                        <Button
                          size="small"
                          color="inherit"
                          onClick={() => void removeMutation.mutateAsync(w.id)}
                          disabled={removeMutation.isPending}
                        >
                          Remove
                        </Button>
                      </RowActions>
                    </Row>
                  ))
                )}
                {filteredWatchlist.length > PAGE_SIZE && (
                  <ListFooter>
                    <Meta>
                      Page {safeWatchPage} of {watchPageCount}
                    </Meta>
                    <Pagination
                      count={watchPageCount}
                      page={safeWatchPage}
                      onChange={(_, p) => setWatchPage(p)}
                      size="small"
                      color="primary"
                    />
                  </ListFooter>
                )}
              </>
            )}
          </Section>
        </>
      )}
    </>
  );
}
