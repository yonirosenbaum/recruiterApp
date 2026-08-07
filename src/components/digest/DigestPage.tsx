'use client';

import styled from 'styled-components';
import {
  Alert,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
} from '@mui/material';
import { AppHeader } from '@/components/layout/AppHeader';
import { useDigestQuery } from '@/lib/query/hooks';

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(260px, 0.8fr);
  gap: 16px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

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
  margin: 4px 0 0;
  color: #64748b;
  font-size: 12px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin: 14px 0 16px;
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

  &:first-of-type {
    border-top: 0;
  }
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

const SideStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionLabel = styled.div`
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #94a3b8;
  margin-bottom: 8px;
`;

const Recipient = styled.div`
  font-size: 13px;
  color: #334155;
  padding: 4px 0;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 13px;
  color: #334155;

  strong {
    font-weight: 750;
  }
`;

export function DigestPage() {
  const { data, isLoading, isError } = useDigestQuery();

  return (
    <>
      <AppHeader title="Daily digest" subtitle={`Scheduled ${data?.scheduledAt ?? '…'}.`} />

      {isLoading && <CircularProgress sx={{ mt: 4 }} />}
      {isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to load digest.
        </Alert>
      )}

      {data && (
        <Grid>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <CardTitle>Digest preview</CardTitle>
                <CardSub>Email, CSV, Bullhorn / JobAdder delivery.</CardSub>
              </div>
              <Actions>
                <Button variant="outlined" size="small">
                  Export CSV
                </Button>
                <Button variant="contained" size="small">
                  Send now
                </Button>
              </Actions>
            </div>

            <EmailMeta>
              <div>
                <strong>To</strong> {data.preview.to}
              </div>
              <div>
                <strong>Subject</strong> {data.preview.subject}
              </div>
            </EmailMeta>

            {data.preview.signals.map((signal) => (
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
          </Card>

          <SideStack>
            <Card>
              <SectionLabel>CADENCE</SectionLabel>
              {data.cadence.map((item) => (
                <FormControlLabel
                  key={item.id}
                  control={<Checkbox checked={item.enabled} readOnly />}
                  label={item.label}
                />
              ))}
            </Card>

            <Card>
              <SectionLabel>RECIPIENTS</SectionLabel>
              {data.recipients.map((email) => (
                <Recipient key={email}>{email}</Recipient>
              ))}
              <TextField
                size="small"
                placeholder="Add recipient"
                fullWidth
                sx={{ mt: 1 }}
              />
            </Card>

            <Card>
              <SectionLabel>LAST 30 DAYS</SectionLabel>
              <StatRow>
                <span>Digests delivered</span>
                <strong>{data.statsLast30Days.digestsDelivered}</strong>
              </StatRow>
              <StatRow>
                <span>Openers copied</span>
                <strong>{data.statsLast30Days.openersCopied}</strong>
              </StatRow>
              <StatRow>
                <span>Meetings logged</span>
                <strong>{data.statsLast30Days.meetingsLogged}</strong>
              </StatRow>
            </Card>
          </SideStack>
        </Grid>
      )}
    </>
  );
}
