'use client';

import { useState } from 'react';
import styled from 'styled-components';
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
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

const Card = styled.section`
  background: #fff;
  border: 1px solid #e8edf5;
  border-radius: 14px;
  padding: 18px 20px;
  max-width: 560px;
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

export function CoveragePage() {
  const { data, isLoading, isError } = useCoverageQuery();
  const [open, setOpen] = useState(false);

  return (
    <>
      <AppHeader title="Coverage" subtitle="Your exclusive territory." />

      {isLoading && <CircularProgress sx={{ mt: 4 }} />}
      {isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to load coverage.
        </Alert>
      )}

      {data && (
        <>
          <Intro>{data.tagline}</Intro>
          <Card>
            <Title>Exclusive slot</Title>
            <SlotTitle>{data.exclusiveSlot.title}</SlotTitle>
            <Tags>
              {data.exclusiveSlot.verticals.map((v) => (
                <Chip key={v} size="small" label={v} variant="outlined" />
              ))}
            </Tags>
            <Body>{data.exclusiveSlot.description}</Body>
            {data.integrity?.takeawaySuppression && (
              <Body>
                <strong>Integrity. </strong>
                {data.integrity.takeawaySuppression}
              </Body>
            )}
            <Button variant="contained" onClick={() => setOpen(true)}>
              Request a new territory
            </Button>
          </Card>
        </>
      )}

      <TerritoryRequestModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
