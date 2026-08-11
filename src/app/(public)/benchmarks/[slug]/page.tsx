'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import styled from 'styled-components';
import { Alert, CircularProgress } from '@mui/material';
import { usePublicBenchmarkQuery } from '@/lib/query/hooks';

const Page = styled.main`
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #fff7ed 100%);
  padding: 40px 20px 64px;
`;

const Inner = styled.div`
  max-width: 680px;
  margin: 0 auto;
`;

const Back = styled(Link)`
  display: inline-block;
  margin-bottom: 18px;
  color: #64748b;
  font-size: 13px;
  text-decoration: none;

  &:hover {
    color: #ea580c;
  }
`;

const Brand = styled.div`
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #ea580c;
  text-transform: uppercase;
  margin-bottom: 10px;
`;

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
`;

const Lead = styled.p`
  margin: 0 0 24px;
  color: #64748b;
  font-size: 15px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
`;

const Stat = styled.div`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 16px;
`;

const StatLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #64748b;
`;

const StatValue = styled.div`
  margin-top: 4px;
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
`;

const Note = styled.p`
  margin: 0;
  color: #94a3b8;
  font-size: 12.5px;
  line-height: 1.45;
`;

export default function PublicBenchmarkSlugPage() {
  const params = useParams<{ slug: string }>();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const { data, isLoading, isError } = usePublicBenchmarkQuery(slug);

  return (
    <Page>
      <Inner>
        <Back href="/benchmarks/explore">← All benchmarks</Back>
        <Brand>Tipoff Daily</Brand>

        {isLoading && <CircularProgress />}
        {isError && (
          <Alert severity="error">Benchmark not found or unavailable.</Alert>
        )}

        {data && (
          <>
            <Title>
              {data.titleQuery} in {data.areaName}
            </Title>
            <Lead>
              Live market median time-to-fill
              {data.verticalName ? ` · ${data.verticalName}` : ''}.
            </Lead>

            {!data.available ? (
              <Alert severity="info" sx={{ mb: 2 }}>
                Not enough closed roles yet ({data.sampleSize} found). Check back
                as more ads close.
              </Alert>
            ) : null}

            <Grid>
              <Stat>
                <StatLabel>MEDIAN FILL</StatLabel>
                <StatValue>
                  {data.marketMedianTtfDays ?? '—'}
                  {data.marketMedianTtfDays != null ? 'd' : ''}
                </StatValue>
              </Stat>
              <Stat>
                <StatLabel>CLOSED ROLES</StatLabel>
                <StatValue>{data.sampleSize}</StatValue>
              </Stat>
              <Stat>
                <StatLabel>OPEN ROLES</StatLabel>
                <StatValue>{data.openRoleCount}</StatValue>
              </Stat>
              <Stat>
                <StatLabel>SALARY MEDIAN</StatLabel>
                <StatValue>
                  {data.salary.mid != null
                    ? `$${data.salary.mid.toLocaleString('en-AU')}`
                    : '—'}
                </StatValue>
              </Stat>
              <Stat>
                <StatLabel>SALARY MEAN</StatLabel>
                <StatValue>
                  {data.salary.mean != null
                    ? `$${data.salary.mean.toLocaleString('en-AU')}`
                    : '—'}
                </StatValue>
              </Stat>
              <Stat>
                <StatLabel>SALARY LOW</StatLabel>
                <StatValue>
                  {data.salary.min != null
                    ? `$${data.salary.min.toLocaleString('en-AU')}`
                    : '—'}
                </StatValue>
              </Stat>
              <Stat>
                <StatLabel>SALARY P25</StatLabel>
                <StatValue>
                  {data.salary.p25 != null
                    ? `$${data.salary.p25.toLocaleString('en-AU')}`
                    : '—'}
                </StatValue>
              </Stat>
              <Stat>
                <StatLabel>SALARY P75</StatLabel>
                <StatValue>
                  {data.salary.p75 != null
                    ? `$${data.salary.p75.toLocaleString('en-AU')}`
                    : '—'}
                </StatValue>
              </Stat>
              <Stat>
                <StatLabel>SALARY HIGH</StatLabel>
                <StatValue>
                  {data.salary.max != null
                    ? `$${data.salary.max.toLocaleString('en-AU')}`
                    : '—'}
                </StatValue>
              </Stat>
            </Grid>

            <Note>
              Salary figures use advertised midpoints ((min+max)/2) from{' '}
              {data.salary.sampleSize} ads · lookback {data.lookbackDays} days.
              {data.salary.sampleSize > 0 && data.salary.sampleSize < 10
                ? ' P25/P75 need ≥10 salary ads.'
                : ''}{' '}
              Figures exclude recruiter-private “your opens” data.
            </Note>
          </>
        )}
      </Inner>
    </Page>
  );
}
