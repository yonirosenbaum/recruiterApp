'use client';

import { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import {
  Alert,
  Button,
  CircularProgress,
  Tab,
  Tabs,
} from '@mui/material';
import { AppHeader } from '@/components/layout/AppHeader';
import { OutreachActions } from '@/components/common/OutreachActions';
import {
  useDigestQuery,
  useSendDigestMutation,
} from '@/lib/query/hooks';
import type { DigestKind, DigestLeadGroup } from '@/types/api';

const Card = styled.section`
  background: #fff;
  border: 1px solid #e8edf5;
  border-radius: 14px;
  padding: 18px 20px;
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 750;
`;

const CardSub = styled.p`
  margin: 4px 0 16px;
  color: #64748b;
  font-size: 12px;
`;

const SectionLabel = styled.h3`
  margin: 20px 0 8px;
  font-size: 12px;
  font-weight: 750;
  letter-spacing: 0.04em;
  color: #64748b;
`;

const EmailMeta = styled.div`
  border: 1px solid #e8edf5;
  border-radius: 10px;
  padding: 10px 12px;
  background: #f8fafc;
  margin-bottom: 14px;
  font-size: 13px;
  color: #334155;

  strong {
    color: #64748b;
    font-weight: 600;
    display: inline-block;
    width: 56px;
  }
`;

const Signal = styled.div`
  border-top: 1px solid #eef2f7;
  padding: 12px 0;
`;

const SignalTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  color: #2563eb;
`;

const Heat = styled.span`
  color: #64748b;
`;

const SignalTitle = styled.div`
  margin-top: 4px;
  font-weight: 700;
  color: #0f172a;
  font-size: 14px;
`;

const SignalStatus = styled.div`
  color: #64748b;
  font-size: 12px;
  margin-top: 2px;
`;

const Quote = styled.blockquote`
  margin: 8px 0 0;
  padding: 0;
  border: 0;
  font-style: italic;
  color: #475569;
  font-size: 13px;
  line-height: 1.45;
`;

const IntelBox = styled.div`
  margin-top: 18px;
  padding: 14px;
  background: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 12px;
`;

const BulletList = styled.ul`
  margin: 8px 0 0;
  padding: 0 0 0 18px;
  color: #7c2d12;
  font-size: 13.5px;
  line-height: 1.45;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 0 14px;
`;

function LeadSection({
  title,
  leads,
}: {
  title: string;
  leads: DigestLeadGroup[];
}) {
  if (leads.length === 0) return null;
  return (
    <div>
      <SectionLabel>{title}</SectionLabel>
      {leads.map((lead) => (
        <Signal key={lead.companyId}>
          <SignalTop>
            <span>
              {lead.roles.length} role{lead.roles.length === 1 ? '' : 's'}
            </span>
            <Heat>heat {lead.heatScore}</Heat>
          </SignalTop>
          <SignalTitle>{lead.headline}</SignalTitle>
          <SignalStatus>
            {lead.roles
              .map((r) => `${r.title} · ${r.category} · ${r.daysLive}d`)
              .join(' · ')}
          </SignalStatus>
          <Quote>“{lead.insightQuote}”</Quote>
        </Signal>
      ))}
    </div>
  );
}

export function DigestPage() {
  const [kind, setKind] = useState<DigestKind>('daily');
  const { data, isLoading, isError } = useDigestQuery(kind);
  const sendMutation = useSendDigestMutation();

  return (
    <>
      <AppHeader
        title="Digest"
        subtitle={
          data?.scheduledAt
            ? `Next ${kind} send ${new Date(data.scheduledAt).toLocaleString(
                'en-AU',
                {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  timeZone: 'Australia/Sydney',
                  timeZoneName: 'short',
                },
              )}.`
            : 'Scheduled …'
        }
      />

      <Tabs
        value={kind}
        onChange={(_, value: DigestKind) => setKind(value)}
        sx={{ mb: 2 }}
      >
        <Tab value="daily" label="Daily tipoffs" />
        <Tab value="weekly" label="Weekly market intel" />
        <Tab value="quarterly" label="Quarterly report" />
      </Tabs>

      <Actions>
        <Button
          variant="contained"
          size="small"
          disabled={sendMutation.isPending}
          onClick={() => sendMutation.mutate(kind)}
        >
          {sendMutation.isPending
            ? 'Sending…'
            : `Send ${kind} email to me`}
        </Button>
      </Actions>

      {sendMutation.isSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Sent to {sendMutation.data.to}
          {sendMutation.data.previewUrl
            ? ` · preview: ${sendMutation.data.previewUrl}`
            : ''}
        </Alert>
      )}
      {sendMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to send digest email.
        </Alert>
      )}

      {isLoading && <CircularProgress sx={{ mt: 2 }} />}
      {isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to load digest.
        </Alert>
      )}

      {data && (
        <Card>
          <div>
            <CardTitle>
              {kind === 'quarterly'
                ? 'Quarterly report preview'
                : kind === 'weekly'
                  ? 'Weekly digest preview'
                  : 'Daily digest preview'}
            </CardTitle>
            <CardSub>
              {kind === 'quarterly'
                ? 'The email is a short note with a button to the public quarterly report.'
                : 'Watchlist sits above tipoffs every send, even on quiet weeks. Tipoffs (hard-to-fill, reopened, softened) follow. Fresh hiring sprees are labelled New & clustered — not sold as heat tipoffs.'}
            </CardSub>
          </div>

          <EmailMeta>
            <div>
              <strong>To</strong> {data.preview.to}
            </div>
            <div>
              <strong>Subject</strong> {data.preview.subject}
            </div>
          </EmailMeta>

          {kind === 'quarterly' && (
            <div style={{ marginTop: 16 }}>
              <CardSub style={{ marginBottom: 12 }}>
                This quarter&apos;s Tipoff Report is out. Click{' '}
                <Link href="/report/quarterly">here</Link> to see the quarterly
                report — national hiring, by vertical, from public job ads.
              </CardSub>
              <Button
                href="/report/quarterly"
                variant="contained"
                size="small"
              >
                See the quarterly report
              </Button>
            </div>
          )}

          {kind !== 'quarterly' && (
            <div
              style={{
                marginTop: 8,
                marginBottom: 8,
                padding: '14px 0 4px',
                borderTop: '1px solid #eef2f7',
              }}
            >
              <SectionLabel>
                {data.preview.watchlist && data.preview.watchlist.eventCount > 0
                  ? `YOUR WATCHLIST — ${data.preview.watchlist.eventCount} event${
                      data.preview.watchlist.eventCount === 1 ? '' : 's'
                    } this week`
                  : 'YOUR WATCHLIST'}
              </SectionLabel>
              {data.preview.watchlist &&
              data.preview.watchlist.events.length > 0 ? (
                data.preview.watchlist.events.map((event) => (
                  <SignalStatus
                    key={`${event.kind}-${event.canonicalJobId}-${event.line}`}
                    style={{ marginTop: 8 }}
                  >
                    {event.line}
                    {event.heatScore != null ? ` · heat ${event.heatScore}` : ''}
                    {' · '}
                    <Link href={`/watchlist`}>Open watchlist</Link>
                  </SignalStatus>
                ))
              ) : (
                <SignalStatus style={{ marginTop: 8 }}>
                  No activity on your {data.preview.watchlist?.watchedCount ?? 0}{' '}
                  watched account
                  {(data.preview.watchlist?.watchedCount ?? 0) === 1
                    ? ''
                    : 's'}
                  .
                </SignalStatus>
              )}
            </div>
          )}

          {kind !== 'quarterly' &&
            data.preview.agencyMarket &&
            (data.preview.agencyMarket.activity.length > 0 ||
              data.preview.agencyMarket.takeaways.length > 0 ||
              data.preview.agencyMarket.relationshipBlurb) && (
              <div
                style={{
                  marginTop: 8,
                  marginBottom: 8,
                  padding: '14px 0 4px',
                  borderTop: '1px solid #eef2f7',
                }}
              >
                <SectionLabel>AGENCY ACTIVITY — your market</SectionLabel>
                {data.preview.agencyMarket.activity.map((row) => (
                  <SignalStatus
                    key={row.agencyCompanyId}
                    style={{ marginTop: 8 }}
                  >
                    <strong style={{ color: '#0f172a' }}>{row.agencyName}</strong>
                    {' advertising: '}
                    {row.roles
                      .map((role) =>
                        role.clientName
                          ? `${role.clientName} (${role.title}, ${role.daysLive}d)`
                          : `${role.title}, ${role.daysLive}d`,
                      )
                      .join(' · ')}
                  </SignalStatus>
                ))}
                {data.preview.agencyMarket.takeaways.map((row) => (
                  <div
                    key={`${row.agencyCompanyId}-${row.canonicalJobId}`}
                    style={{
                      marginTop: 12,
                      padding: '10px 12px',
                      background: '#fff7ed',
                      border: '1px solid #fed7aa',
                      borderRadius: 8,
                    }}
                  >
                    <SignalStatus style={{ color: '#9a3412' }}>
                      TAKEAWAY WATCH: {row.line}
                    </SignalStatus>
                    <div style={{ marginTop: 8 }}>
                      <OutreachActions
                        companyId={row.agencyCompanyId}
                        canonicalJobId={row.canonicalJobId}
                        modes={['pitched']}
                      />
                    </div>
                  </div>
                ))}
                {data.preview.agencyMarket.relationshipBlurb && (
                  <SignalStatus style={{ marginTop: 10 }}>
                    {data.preview.agencyMarket.relationshipBlurb}
                  </SignalStatus>
                )}
              </div>
            )}

          {kind !== 'quarterly' &&
            (data.preview.marketIntelBullets?.length ?? 0) > 0 && (
            <IntelBox>
              <CardTitle style={{ color: '#9a3412' }}>
                {data.preview.marketIntel?.periodLabel ?? 'Market intel'}
              </CardTitle>
              <BulletList>
                {data.preview.marketIntelBullets!.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </BulletList>
              {data.preview.marketIntel && (
                <div style={{ marginTop: 12 }}>
                  {(
                    [
                      ["Who's hiring", data.preview.marketIntel.hiring],
                      [
                        'Agency activity',
                        data.preview.marketIntel.agencyActivity,
                      ],
                      ['Frozen', data.preview.marketIntel.frozen],
                      ['Thawed', data.preview.marketIntel.thawed],
                    ] as const
                  ).map(([label, rows]) =>
                    rows.length === 0 ? null : (
                      <div key={label} style={{ marginTop: 10 }}>
                        <SignalStatus
                          style={{ fontWeight: 700, color: '#9a3412' }}
                        >
                          {label.toUpperCase()}
                        </SignalStatus>
                        {rows.slice(0, 5).map((r) => (
                          <SignalStatus
                            key={r.companyId}
                            style={{ marginTop: 4 }}
                          >
                            <strong style={{ color: '#7c2d12' }}>
                              {r.companyName}
                            </strong>
                            {` — ${r.note}`}
                          </SignalStatus>
                        ))}
                      </div>
                    ),
                  )}
                </div>
              )}
            </IntelBox>
          )}

          {kind !== 'quarterly' && (
            <>
              <LeadSection
                title="TIPOFFS"
                leads={data.preview.tipoffLeads ?? []}
              />
              <LeadSection
                title="NEW & CLUSTERED"
                leads={data.preview.newClusteredLeads ?? []}
              />
            </>
          )}

          {kind !== 'quarterly' &&
            (data.preview.tipoffLeads?.length ?? 0) === 0 &&
            (data.preview.newClusteredLeads?.length ?? 0) === 0 &&
            data.preview.signals.map((signal) => (
              <Signal key={signal.id}>
                <SignalTop>
                  <span>{signal.category}</span>
                  <Heat>heat {signal.heatScore}</Heat>
                </SignalTop>
                <SignalTitle>
                  {signal.company} — {signal.role}
                </SignalTitle>
                <SignalStatus>{signal.statusText}</SignalStatus>
                <Quote>“{signal.insightQuote}”</Quote>
              </Signal>
            ))}

          {kind !== 'quarterly' &&
            (data.preview.pastClientsHiring?.length ?? 0) > 0 &&
            !data.preview.watchlist && (
            <div
              style={{
                marginTop: 20,
                borderTop: '1px solid #eef2f7',
                paddingTop: 14,
              }}
            >
              <CardTitle>Past clients hiring on your patch</CardTitle>
              <CardSub>From your lapsed-client watchlist.</CardSub>
              {data.preview.pastClientsHiring!.map((p) => (
                <SignalStatus key={p.company} style={{ marginTop: 8 }}>
                  <strong style={{ color: '#0f172a' }}>{p.company}</strong>
                  {` — ${p.liveRoleCount} live role${
                    p.liveRoleCount === 1 ? '' : 's'
                  }`}
                  {p.sampleTitle ? ` · ${p.sampleTitle}` : ''}
                </SignalStatus>
              ))}
            </div>
          )}
        </Card>
      )}
    </>
  );
}
