"use client";

import {
  AdminPanelSettings,
  Business,
  ExpandLess,
  ExpandMore,
  History,
  Logout,
  MailOutlined,
  MapOutlined,
  QueryStats,
  Radar as RadarIcon,
  Sensors,
} from "@mui/icons-material";
import { Badge, Collapse } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  useCoverageQuery,
  useLapsedClientsQuery,
  useRadarQuery,
} from "@/lib/query/hooks";
import { colors } from "@/theme/theme";

const Shell = styled.aside`
  width: 260px;
  min-width: 260px;
  background: ${colors.sidebar};
  color: #cbd5e1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 18px 16px;
`;

const Logo = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(145deg, #f59e0b, #ea580c);
  color: #fff;
  font-weight: 800;
  font-size: 13px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
`;

const BrandText = styled.div`
  line-height: 1.2;
`;

const BrandTitle = styled.div`
  color: #f8fafc;
  font-size: 13px;
  font-weight: 700;
`;

const BrandSub = styled.div`
  color: #94a3b8;
  font-size: 11px;
`;

const Nav = styled.nav`
  flex: 1;
  padding: 8px 10px;
  overflow-y: auto;
`;

const ParentBtn = styled.button<{ $active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 0;
  background: ${({ $active }) =>
    $active ? colors.sidebarActive : "transparent"};
  color: ${({ $active }) => ($active ? "#fff" : "#cbd5e1")};
  border-radius: 10px;
  padding: 10px 12px;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 650;

  &:hover {
    background: ${colors.sidebarHover};
    color: #fff;
  }
`;

const SubLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 2px 0 2px 8px;
  padding: 9px 12px 9px 14px;
  border-radius: 10px;
  text-decoration: none;
  color: ${({ $active }) => ($active ? "#fff" : "#94a3b8")};
  background: ${({ $active }) =>
    $active ? colors.sidebarActive : "transparent"};
  font-size: 13px;
  font-weight: 550;

  &:hover {
    background: ${colors.sidebarHover};
    color: #fff;
  }
`;

const Footer = styled.div`
  padding: 12px;
  border-top: 1px solid rgba(148, 163, 184, 0.12);
`;

const TerritoryCard = styled.button`
  width: 100%;
  text-align: left;
  border: 1px solid rgba(59, 130, 246, 0.35);
  background: rgba(37, 99, 235, 0.15);
  color: #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  margin-bottom: 10px;

  strong {
    display: block;
    font-size: 12px;
    color: #93c5fd;
    margin-bottom: 4px;
  }

  span {
    display: block;
    font-size: 12px;
    line-height: 1.4;
    color: #cbd5e1;
  }
`;

const LogoutBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(248, 113, 113, 0.35);
  background: transparent;
  color: #fca5a5;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;

  &:hover {
    background: rgba(220, 38, 38, 0.18);
    color: #fecaca;
  }
`;

const HIRING_SIGNAL_PATHS = [
  "/radar",
  "/digest",
  "/lapsed",
  "/watchlist",
  "/companies",
  "/coverage",
] as const;

type SidebarProps = {
  onRequestTerritory: () => void;
};

export function Sidebar({ onRequestTerritory }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearSession } = useAuth();
  const queryClient = useQueryClient();
  const underHiringSignals = HIRING_SIGNAL_PATHS.some((p) =>
    pathname.startsWith(p),
  );
  const [open, setOpen] = useState(underHiringSignals);
  const { data: radar } = useRadarQuery();
  const { data: lapsed } = useLapsedClientsQuery();
  const { data: coverage } = useCoverageQuery();
  const badgeCount = radar?.metrics.newTriggersToday ?? 0;
  const lapsedBadge = lapsed?.counts.firing ?? 0;
  const territory = coverage?.sidebarTerritory;
  const isAdmin = user?.role === "SUPER_ADMIN";

  const handleLogout = () => {
    clearSession();
    queryClient.clear();
    router.replace("/login");
  };

  const items = [
    {
      href: "/radar",
      label: "Radar",
      icon: <RadarIcon fontSize="small" />,
      badge: badgeCount,
    },
    {
      href: "/watchlist",
      label: "Watchlist",
      icon: <History fontSize="small" />,
      badge: lapsedBadge,
    },
    {
      href: "/digest",
      label: "Digest",
      icon: <MailOutlined fontSize="small" />,
    },
    {
      href: "/companies",
      label: "Companies",
      icon: <Business fontSize="small" />,
    },
    {
      href: "/coverage",
      label: "Coverage",
      icon: <MapOutlined fontSize="small" />,
    },
  ];

  return (
    <Shell>
      <Brand>
        <Logo>HR</Logo>
        <BrandText>
          <BrandTitle>Tipoff Daily</BrandTitle>
          <BrandSub>{user?.agencyName ?? "Agency"}</BrandSub>
        </BrandText>
      </Brand>

      <Nav>
        <ParentBtn
          type="button"
          $active={underHiringSignals}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <Sensors fontSize="small" />
          <span style={{ flex: 1, textAlign: "left" }}>Hiring Signals</span>
          {open ? (
            <ExpandLess fontSize="small" />
          ) : (
            <ExpandMore fontSize="small" />
          )}
        </ParentBtn>

        <Collapse in={open} timeout="auto" unmountOnExit>
          {items.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <SubLink key={item.href} href={item.href} $active={active}>
                {item.icon}
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge ? (
                  <Badge
                    badgeContent={item.badge}
                    color="warning"
                    sx={{
                      "& .MuiBadge-badge": {
                        position: "static",
                        transform: "none",
                        fontWeight: 700,
                      },
                    }}
                  />
                ) : null}
              </SubLink>
            );
          })}
        </Collapse>

        <SubLink
          href="/benchmarks"
          $active={pathname.startsWith("/benchmarks")}
          style={{ marginTop: 10, marginLeft: 0 }}
        >
          <QueryStats fontSize="small" />
          <span style={{ flex: 1 }}>Benchmarks</span>
        </SubLink>

        {isAdmin && (
          <SubLink
            href="/admin"
            $active={pathname.startsWith("/admin")}
            style={{ marginTop: 4, marginLeft: 0 }}
          >
            <AdminPanelSettings fontSize="small" />
            <span style={{ flex: 1 }}>Admin</span>
          </SubLink>
        )}
      </Nav>

      <Footer>
        {territory && (
          <TerritoryCard
            type="button"
            onClick={() => {
              if (isAdmin) {
                router.push("/admin");
                return;
              }
              onRequestTerritory();
            }}
          >
            <strong>{territory.label}</strong>
            <span>
              {territory.summary}. {territory.hint}
            </span>
          </TerritoryCard>
        )}
        <LogoutBtn
          type="button"
          onClick={handleLogout}
          title="Log out"
          aria-label="Log out"
        >
          <Logout fontSize="small" />
          <span style={{ flex: 1, textAlign: "left" }}>Log out</span>
        </LogoutBtn>
      </Footer>
    </Shell>
  );
}
