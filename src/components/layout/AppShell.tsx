"use client";

import { useState } from "react";
import styled from "styled-components";
import { Sidebar } from "@/components/layout/Sidebar";
import { NoTerritoryBanner } from "@/components/territory/NoTerritoryBanner";
import { TerritoryRequestModal } from "@/components/territory/TerritoryRequestModal";

const Frame = styled.div`
  display: flex;
  min-height: 100vh;
  background: #eef1f6;
`;

const Main = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

const Content = styled.main`
  flex: 1;
  padding: 8px 28px 28px;

  @media (max-width: 720px) {
    padding: 8px 12px 24px;
  }
`;

const Disclaimer = styled.p`
  text-align: center;
  color: #94a3b8;
  font-size: 11px;
  margin: 24px 0 0;
`;

export function AppShell({ children }: { children: React.ReactNode }) {
  const [territoryOpen, setTerritoryOpen] = useState(false);

  return (
    <Frame>
      <Sidebar onRequestTerritory={() => setTerritoryOpen(true)} />
      <Main>
        <Content>
          <NoTerritoryBanner
            onRequestTerritory={() => setTerritoryOpen(true)}
          />
          {children}
          <Disclaimer>
            Signals derived from public postings — never republished verbatim.
            Company and role data only; no personal data stored.
          </Disclaimer>
        </Content>
      </Main>
      <TerritoryRequestModal
        open={territoryOpen}
        onClose={() => setTerritoryOpen(false)}
      />
    </Frame>
  );
}
