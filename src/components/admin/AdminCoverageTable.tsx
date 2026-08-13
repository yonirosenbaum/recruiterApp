'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Alert, CircularProgress, TextField } from '@mui/material';
import { useAdminTerritoryStatsQuery } from '@/lib/query/hooks';
import type { AdminTerritoryComboRow } from '@/types/api';

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const Hint = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 13px;
`;

const Wrap = styled.div`
  overflow: auto;
  border: 1px solid #e8edf5;
  border-radius: 12px;
  max-height: 70vh;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  background: #fff;

  th,
  td {
    padding: 8px 12px;
    text-align: left;
    border-bottom: 1px solid #eef2f7;
    white-space: nowrap;
  }

  th {
    position: sticky;
    top: 0;
    background: #f8fafc;
    font-size: 11px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #64748b;
    font-weight: 750;
    cursor: pointer;
    user-select: none;
  }

  td.num,
  th.num {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  tfoot td {
    font-weight: 750;
    background: #f8fafc;
    position: sticky;
    bottom: 0;
  }

  tr.muted td {
    color: #64748b;
  }

  tbody tr.clickable {
    cursor: pointer;
  }

  tbody tr.clickable:hover td {
    background: #f1f5f9;
  }
`;

type SortKey =
  | 'areaName'
  | 'verticalName'
  | 'liveJobs'
  | 'jobs'
  | 'radarTriggers'
  | 'companies';

function compare(
  a: AdminTerritoryComboRow,
  b: AdminTerritoryComboRow,
  key: SortKey,
  dir: 1 | -1,
) {
  const av = a[key];
  const bv = b[key];
  if (typeof av === 'number' && typeof bv === 'number') {
    return (av - bv) * dir;
  }
  return String(av).localeCompare(String(bv)) * dir;
}

export function AdminCoverageTable() {
  const { data, isLoading, isError } = useAdminTerritoryStatsQuery();
  const router = useRouter();
  const [q, setQ] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('radarTriggers');
  const [sortDir, setSortDir] = useState<1 | -1>(-1);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const filtered = (data?.rows ?? []).filter((row) => {
      if (!needle) return true;
      return (
        row.areaName.toLowerCase().includes(needle) ||
        row.state.toLowerCase().includes(needle) ||
        row.verticalName.toLowerCase().includes(needle)
      );
    });
    return [...filtered].sort((a, b) => compare(a, b, sortKey, sortDir));
  }, [data?.rows, q, sortKey, sortDir]);

  const onSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 1 ? -1 : 1));
      return;
    }
    setSortKey(key);
    setSortDir(key === 'areaName' || key === 'verticalName' ? 1 : -1);
  };

  const mark = (key: SortKey) =>
    sortKey === key ? (sortDir === 1 ? ' ↑' : ' ↓') : '';

  if (isLoading) return <CircularProgress size={24} />;
  if (isError) {
    return <Alert severity="error">Failed to load city × vertical counts.</Alert>;
  }
  if (!data) return null;

  return (
    <>
      <Toolbar>
        <Hint>
          {rows.length} of {data.rows.length} city × vertical slots · click a
          row to open that radar · radar is active hiring signals (non-agency) ·
          live jobs are currently open ads
        </Hint>
        <TextField
          size="small"
          label="Filter"
          placeholder="City or vertical"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </Toolbar>

      <Wrap>
        <Table>
          <thead>
            <tr>
              <th onClick={() => onSort('areaName')}>City{mark('areaName')}</th>
              <th onClick={() => onSort('verticalName')}>
                Vertical{mark('verticalName')}
              </th>
              <th className="num" onClick={() => onSort('radarTriggers')}>
                Radar{mark('radarTriggers')}
              </th>
              <th className="num" onClick={() => onSort('liveJobs')}>
                Live jobs{mark('liveJobs')}
              </th>
              <th className="num" onClick={() => onSort('jobs')}>
                All jobs{mark('jobs')}
              </th>
              <th className="num" onClick={() => onSort('companies')}>
                Companies{mark('companies')}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const city = row.state
                ? `${row.areaName} · ${row.state}`
                : row.areaName;
              const href = `/radar?areaId=${encodeURIComponent(row.areaId)}&verticalId=${encodeURIComponent(row.verticalId)}&vertical=${encodeURIComponent(row.verticalName)}&city=${encodeURIComponent(city)}`;
              return (
                <tr
                  key={`${row.areaId}::${row.verticalId}`}
                  className="clickable"
                  tabIndex={0}
                  role="link"
                  onClick={() => router.push(href)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      router.push(href);
                    }
                  }}
                >
                  <td>
                    {row.areaName}
                    {row.state ? ` · ${row.state}` : ''}
                  </td>
                  <td>{row.verticalName}</td>
                  <td className="num">
                    {row.radarTriggers.toLocaleString('en-AU')}
                  </td>
                  <td className="num">{row.liveJobs.toLocaleString('en-AU')}</td>
                  <td className="num">{row.jobs.toLocaleString('en-AU')}</td>
                  <td className="num">
                    {row.companies.toLocaleString('en-AU')}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>Mapped totals</td>
              <td className="num">
                {data.totals.radarTriggers.toLocaleString('en-AU')}
              </td>
              <td className="num">
                {data.totals.liveJobs.toLocaleString('en-AU')}
              </td>
              <td className="num">
                {data.totals.jobs.toLocaleString('en-AU')}
              </td>
              <td className="num">
                {data.totals.companies.toLocaleString('en-AU')}
              </td>
            </tr>
            <tr className="muted">
              <td colSpan={2}>Unmapped (missing city or vertical)</td>
              <td className="num">
                {data.unmapped.radarTriggers.toLocaleString('en-AU')}
              </td>
              <td className="num">
                {data.unmapped.liveJobs.toLocaleString('en-AU')}
              </td>
              <td className="num">
                {data.unmapped.jobs.toLocaleString('en-AU')}
              </td>
              <td className="num">
                {data.unmapped.companies.toLocaleString('en-AU')}
              </td>
            </tr>
          </tfoot>
        </Table>
      </Wrap>
    </>
  );
}
