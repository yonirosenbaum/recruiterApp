"use client";

import { NotificationsNone, Search } from "@mui/icons-material";
import { Avatar, IconButton, InputAdornment, TextField } from "@mui/material";
import styled from "styled-components";
import { useAuth } from "@/components/auth/AuthProvider";

const Bar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 28px 8px;
  background: transparent;

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: stretch;
    padding: 14px 14px 8px;
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

type AppHeaderProps = {
  title: string;
  subtitle?: string;
};

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  const { user } = useAuth();

  return (
    <Bar>
      <Titles>
        <Title>{title}</Title>
        {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
      </Titles>
      <Right>
        <TextField
          size="small"
          placeholder="Search companies or roles"
          sx={{
            width: { xs: "100%", sm: 260 },
            "& .MuiOutlinedInput-root": {
              borderRadius: 999,
              background: "#fff",
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <IconButton aria-label="Notifications">
          <NotificationsNone />
        </IconButton>
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
