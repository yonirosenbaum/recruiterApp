'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { Alert, CircularProgress } from '@mui/material';
import { usePublicBenchmarksQuery } from '@/lib/query/hooks';

const Page = styled.main`
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
  padding: 40px 20px 64px;
`;

const Inner = styled.div`
  max-width: 760px;
  margin: 0 auto;
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
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
`;

const Lead = styled.p`
  margin: 0 0 28px;
  color: #64748b;
  font-size: 15px;
  line-height: 1.5;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
`;

const Item = styled(Link)`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: baseline;
  text-decoration: none;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 16px;
  color: inherit;

  &:hover {
    border-color: #fb923c;
  }
`;

const ItemTitle = styled.div`
  font-weight: 700;
  color: #0f172a;
  font-size: 15px;
`;

const ItemMeta = styled.div`
  margin-top: 2px;
  color: #64748b;
  font-size: 13px;
`;

const ItemStat = styled.div`
  font-weight: 750;
  color: #ea580c;
  white-space: nowrap;
`;

export default function PublicBenchmarksExplorePage() {
  const { data, isLoading, isError } = usePublicBenchmarksQuery();

  return (
    <Page>
      <Inner>
        <Brand>Tipoff Daily</Brand>
        <Title>Hiring benchmarks</Title>
        <Lead>
          Median time-to-fill by city and role title, computed live from closed
          job ads. No account required.
        </Lead>

        {isLoading && <CircularProgress />}
        {isError && (
          <Alert severity="error">Could not load public benchmarks.</Alert>
        )}

        {data && (
          <List>
            {data.map((row) => (
              <li key={row.slug}>
                <Item href={`/benchmarks/${row.slug}`}>
                  <div>
                    <ItemTitle>{row.titleQuery}</ItemTitle>
                    <ItemMeta>
                      {row.areaName} · {row.sampleSize} closed
                    </ItemMeta>
                  </div>
                  <ItemStat>
                    {row.marketMedianTtfDays != null
                      ? `${row.marketMedianTtfDays}d median`
                      : '—'}
                  </ItemStat>
                </Item>
              </li>
            ))}
          </List>
        )}
      </Inner>
    </Page>
  );
}
