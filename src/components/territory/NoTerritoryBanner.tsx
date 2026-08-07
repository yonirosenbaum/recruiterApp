'use client';

import styled from 'styled-components';
import { Button } from '@mui/material';
import { WarningAmberRounded } from '@mui/icons-material';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  useMyTerritoryRequestsQuery,
  useTerritoryOptionsQuery,
} from '@/lib/query/hooks';

const Banner = styled.section`
  display: flex;
  align-items: center;
  gap: 18px;
  background: #fef2f2;
  border: 2px solid #dc2626;
  border-radius: 14px;
  padding: 22px 24px;
  margin: 12px 0 20px;

  @media (max-width: 760px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const IconWrap = styled.div`
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #fee2e2;
  color: #b91c1c;
`;

const Body = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #991b1b;
`;

const Text = styled.p`
  margin: 6px 0 0;
  font-size: 14px;
  line-height: 1.5;
  color: #7f1d1d;
`;

export function NoTerritoryBanner({
  onRequestTerritory,
}: {
  onRequestTerritory: () => void;
}) {
  const { user } = useAuth();
  const isRecruiter = user?.role === 'RECRUITER';

  const { data: allocations, isLoading } = useTerritoryOptionsQuery(
    'allocated',
    { enabled: isRecruiter },
  );
  const { data: requests } = useMyTerritoryRequestsQuery({
    enabled: isRecruiter,
  });

  if (!isRecruiter || isLoading) return null;
  if ((allocations?.combinations.length ?? 0) > 0) return null;

  const pending =
    requests?.requests.filter((r) => r.status === 'PENDING').length ?? 0;

  return (
    <Banner role="alert">
      <IconWrap>
        <WarningAmberRounded fontSize="large" />
      </IconWrap>
      <Body>
        <Title>No territory assigned yet</Title>
        <Text>
          {pending > 0
            ? `You have ${pending} territory request${pending === 1 ? '' : 's'} awaiting admin approval. Hiring signals stay hidden until one is approved.`
            : 'Request a location and industry to start seeing hiring signals. Until a territory is approved, no jobs will appear on your screens.'}
        </Text>
      </Body>
      <Button
        variant="contained"
        color="error"
        size="large"
        onClick={onRequestTerritory}
        sx={{ flexShrink: 0, fontWeight: 700, whiteSpace: 'nowrap' }}
      >
        Request a new territory
      </Button>
    </Banner>
  );
}
