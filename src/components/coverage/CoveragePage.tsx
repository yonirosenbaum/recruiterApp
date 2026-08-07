'use client';

import { useState } from 'react';
import styled from 'styled-components';
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Switch,
} from '@mui/material';
import { AppHeader } from '@/components/layout/AppHeader';
import { TerritoryRequestModal } from '@/components/territory/TerritoryRequestModal';
import { useCoverageQuery } from '@/lib/query/hooks';

const Intro = styled.p`
  margin: 0 0 16px;
  color: #64748b;
  font-size: 14px;
  max-width: 640px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.section`
  background: #fff;
  border: 1px solid #e8edf5;
  border-radius: 14px;
  padding: 18px 20px;
`;

const Title = styled.h2`
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 750;
`;

const SlotTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 750;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 10px 0;
`;

const Body = styled.p`
  margin: 0 0 14px;
  color: #475569;
  font-size: 13px;
  line-height: 1.5;
`;

const SourceRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
  border-top: 1px solid #eef2f7;
  font-size: 13px;

  &:first-of-type {
    border-top: 0;
  }
`;

const ThresholdRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  padding: 8px 0;
  border-top: 1px solid #eef2f7;
  font-size: 13px;

  &:first-of-type {
    border-top: 0;
  }

  strong {
    color: #0f172a;
  }
`;

const ModuleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 0;
`;

export function CoveragePage() {
  const { data, isLoading, isError } = useCoverageQuery();
  const [open, setOpen] = useState(false);

  return (
    <>
      <AppHeader title="Coverage" subtitle="Territory, sources & modules." />

      {isLoading && <CircularProgress sx={{ mt: 4 }} />}
      {isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to load coverage.
        </Alert>
      )}

      {data && (
        <>
          <Intro>{data.tagline}</Intro>
          <Grid>
            <Card>
              <Title>Exclusive slot</Title>
              <SlotTitle>{data.exclusiveSlot.title}</SlotTitle>
              <Tags>
                {data.exclusiveSlot.verticals.map((v) => (
                  <Chip key={v} size="small" label={v} variant="outlined" />
                ))}
              </Tags>
              <Body>{data.exclusiveSlot.description}</Body>
              <Button variant="contained" onClick={() => setOpen(true)}>
                Request a new territory
              </Button>
            </Card>

            <Card>
              <Title>Ingestion sources</Title>
              {data.ingestionSources.map((source) => (
                <SourceRow key={source.name}>
                  <div>
                    <strong>{source.name}</strong>
                    <div style={{ color: '#64748b', fontSize: 12 }}>{source.role}</div>
                  </div>
                  <span style={{ color: '#64748b' }}>{source.syncedAt}</span>
                </SourceRow>
              ))}
            </Card>

            <Card>
              <Title>Trigger thresholds</Title>
              {data.triggerThresholds.map((row) => (
                <ThresholdRow key={row.name}>
                  <span>{row.name}</span>
                  <strong>{row.value}</strong>
                </ThresholdRow>
              ))}
            </Card>

            <Card>
              <Title>Modules</Title>
              {data.modules.map((mod) => (
                <ModuleRow key={mod.id}>
                  <div>
                    <div style={{ fontWeight: 650 }}>{mod.name}</div>
                    {mod.priceLabel && (
                      <div style={{ color: '#64748b', fontSize: 12 }}>
                        {mod.priceLabel}
                      </div>
                    )}
                  </div>
                  {mod.priceLabel && !mod.enabled ? (
                    <Chip size="small" label={mod.priceLabel} />
                  ) : (
                    <Switch checked={mod.enabled} readOnly />
                  )}
                </ModuleRow>
              ))}
            </Card>
          </Grid>
        </>
      )}

      <TerritoryRequestModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
