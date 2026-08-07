'use client';

import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Button } from '@mui/material';
import { TerritoryRequestForm } from '@/components/territory/TerritoryRequestForm';

const Page = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  background: #eef1f6;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.section`
  padding: 48px 40px;
  background: linear-gradient(160deg, #0f2744, #1e3a5f);
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const FormPanel = styled.section`
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e8edf5;
  padding: 24px;
  max-width: 480px;
`;

const Title = styled.h1`
  margin: 0 0 12px;
  font-size: 32px;
  letter-spacing: -0.03em;
`;

const Body = styled.p`
  margin: 0;
  color: #cbd5e1;
  line-height: 1.55;
  max-width: 420px;
`;

const Steps = styled.ol`
  margin: 24px 0 0;
  padding-left: 18px;
  color: #e2e8f0;
  line-height: 1.7;
`;

const Skip = styled.div`
  margin-top: 16px;
`;

export function RequestTerritoryOnboardingPage() {
  const router = useRouter();

  return (
    <Page>
      <Panel>
        <Title>Claim your exclusive territory</Title>
        <Body>
          Hiring signals only stay valuable when competitors don&apos;t share them.
          Choose an open area and vertical — one agency slot per pair.
        </Body>
        <Steps>
          <li>Request a territory–vertical slot</li>
          <li>Explore a live demo with sample overnight scans</li>
          <li>Go live when your slot is approved</li>
        </Steps>
      </Panel>
      <FormPanel>
        <Card>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Request a new territory</h2>
          <TerritoryRequestForm
            submitLabel="Request a new territory"
            onSuccess={() => router.push('/onboarding/demo')}
          />
          <Skip>
            <Button onClick={() => router.push('/onboarding/demo')}>
              Skip for now — see the demo
            </Button>
          </Skip>
        </Card>
      </FormPanel>
    </Page>
  );
}
