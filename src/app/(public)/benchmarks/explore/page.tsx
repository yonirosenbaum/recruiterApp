'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
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
  margin: 0 0 18px;
  color: #64748b;
  font-size: 15px;
  line-height: 1.5;

  a {
    color: #ea580c;
    font-weight: 700;
    text-decoration: none;
  }
`;

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 22px;
`;

const FilterLabel = styled.label`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
`;

const CitySelect = styled.select`
  min-width: 220px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #0f172a;
  border-radius: 10px;
  padding: 10px 12px;
  font: inherit;
  font-size: 14px;
  font-weight: 600;

  &:focus {
    outline: 2px solid #fb923c;
    outline-offset: 1px;
  }
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
  const [areaId, setAreaId] = useState('');
  const { data, isLoading, isError } = usePublicBenchmarksQuery(
    areaId || undefined,
  );
  const items = data?.items ?? [];
  const areas = data?.areas ?? [];
  const selectedCity = useMemo(
    () => areas.find((a) => a.id === areaId)?.name,
    [areas, areaId],
  );

  return (
    <Page>
      <Inner>
        <Brand>Tipoff Daily</Brand>
        <Title>Hiring benchmarks</Title>
        <Lead>
          Median time-to-fill by role title across Australia, or a single city.
          No account required. For the national picture, read the{' '}
          <Link href="/report">Tipoff Report</Link>
          {' '}or the{' '}
          <Link href="/report/quarterly">quarterly edition</Link>.
        </Lead>

        <Filters>
          <FilterLabel htmlFor="explore-city">City</FilterLabel>
          <CitySelect
            id="explore-city"
            value={areaId}
            onChange={(e) => setAreaId(e.target.value)}
          >
            <option value="">Australia</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
                {a.state ? ` · ${a.state}` : ''}
              </option>
            ))}
          </CitySelect>
        </Filters>

        {isLoading && <CircularProgress />}
        {isError && (
          <Alert severity="error">Could not load public benchmarks.</Alert>
        )}

        {data && items.length === 0 && (
          <Alert severity="info">
            {selectedCity
              ? `No city × title slices with enough sample in ${selectedCity} yet.`
              : 'No Australia-wide title slices with enough sample yet.'}
          </Alert>
        )}

        {items.length > 0 && (
          <List>
            {items.map((row) => (
              <li key={row.slug}>
                <Item href={`/benchmarks/${row.slug}`}>
                  <div>
                    <ItemTitle>{row.titleQuery}</ItemTitle>
                    <ItemMeta>
                      {row.areaName}
                      {row.sampleSize > 0 ? ` · ${row.sampleSize} closed` : ''}
                      {(row.openRoleCount ?? 0) > 0
                        ? ` · ${row.openRoleCount} open`
                        : ''}
                      {(row.salaryRoleCount ?? 0) > 0
                        ? ` · ${row.salaryRoleCount} roles with salary`
                        : ''}
                    </ItemMeta>
                  </div>
                  <ItemStat>
                    {row.marketMedianTtfDays != null
                      ? `${row.marketMedianTtfDays}d median`
                      : 'Open now'}
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
