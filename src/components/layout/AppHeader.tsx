"use client";

import { Search } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import styled from "styled-components";
import { useAuth } from "@/components/auth/AuthProvider";

const Bar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 0 8px;
  background: transparent;

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: stretch;
    padding: 14px 0 8px;
  }
`;

const Titles = styled.div`
  min-width: 0;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 26px;
  font-weight: 750;
  letter-spacing: -0.02em;
  color: #0f172a;
`;

const Subtitle = styled.p`
  margin: 4px 0 0;
  color: #64748b;
  font-size: 13px;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 720px) {
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
  }
`;

const SearchBox = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 280px;
  max-width: 100%;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid #d0d7e2;
  background: #fff;
  color: #94a3b8;
  cursor: text;

  @media (max-width: 720px) {
    width: 100%;
  }

  &:focus-within {
    border-color: #94a3b8;
    box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.2);
  }
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  font: inherit;
  font-size: 14px;
  color: #0f172a;

  &::placeholder {
    color: #94a3b8;
  }
`;

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
};

export function AppHeader({
  title,
  subtitle,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search companies or roles",
}: AppHeaderProps) {
  const { user } = useAuth();
  const showSearch = typeof onSearchChange === "function";

  return (
    <Bar>
      <Titles>
        <Title>{title}</Title>
        {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
      </Titles>
      <Right>
        {showSearch ? (
          <SearchBox>
            <Search fontSize="small" aria-hidden />
            <SearchInput
              type="search"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              autoComplete="off"
            />
          </SearchBox>
        ) : null}
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: "#1e3a5f",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {user?.initials ?? "JD"}
        </Avatar>
      </Right>
    </Bar>
  );
}
