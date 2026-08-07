'use client';

import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Alert, Button, CircularProgress } from '@mui/material';
import { TriggerCard } from '@/components/radar/TriggerCard';
import { useDemoRadarQuery } from '@/lib/query/hooks';

const Page = styled.div`
  min-height: 100vh;
  background: #eef1f6;
  padding: 32px 28px 48px;
`;

const Hero = styled.section`
  max-width: 980px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #0f2744, #1e3a5f);
  color: #fff;
  border-radius: 18px;
  padding: 28px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  letter-spacing: -0.03em;
  max-width: 720px;
`;

const Props = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 20px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const Prop = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 14px;

  strong {
    display: block;
    margin-bottom: 6px;
  }

  span {
    color: #cbd5e1;
    font-size: 13px;
    line-height: 1.45;
  }
`;

const DemoWrap = styled.section`
  max-width: 980px;
  margin: 0 auto;
`;

const DemoLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Badge = styled.span`
  display: inline-block;
  background: #fef3c7;
  color: #92400e;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
  padding: 4px 8px;
  border-radius: 999px;
`;

export function DemoOnboardingPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useDemoRadarQuery();

  return (
    <Page>
      {isLoading && <CircularProgress />}
      {isError && <Alert severity="error">Failed to load demo data.</Alert>}

      {data && (
        <>
          <Hero>
            <Badge>LIVE DEMO · FAKE DATA</Badge>
            <Title style={{ marginTop: 12 }}>{data.headline}</Title>
            <Props>
              {data.valueProps.map((prop) => (
                <Prop key={prop.title}>
                  <strong>{prop.title}</strong>
                  <span>{prop.body}</span>
                </Prop>
              ))}
            </Props>
            <div style={{ marginTop: 20 }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => router.push('/radar')}
              >
                Enter Radar
              </Button>
            </div>
          </Hero>

          <DemoWrap>
            <DemoLabel>
              <h2 style={{ margin: 0, fontSize: 18 }}>Sample overnight triggers</h2>
              <span style={{ color: '#64748b', fontSize: 13 }}>
                Same shape as production materialized views
              </span>
            </DemoLabel>
            <List>
              {data.sampleTriggers.map((trigger) => (
                <TriggerCard key={trigger.id} trigger={trigger} />
              ))}
            </List>
          </DemoWrap>
        </>
      )}
    </Page>
  );
}
