"use client";

import { useEffect, useState } from "react";
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
  const [collapsed, setCollapsed] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 720 : false,
  );
  const [territoryOpen, setTerritoryOpen] = useState(false);

  useEffect(() => {
    // Mobile: keep the sidebar icon-only so the main content has space.
    const apply = () => {
      if (window.innerWidth <= 720) setCollapsed(true);
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  return (
    <Frame>
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        onRequestTerritory={() => setTerritoryOpen(true)}
      />
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
