"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { MicrosoftClarity } from "@/components/common/MicrosoftClarity";
import { SentryUser } from "@/components/common/SentryUser";
import { QueryProvider } from "@/lib/query/QueryProvider";
import StyledComponentsRegistry from "@/lib/registry";
import { theme } from "@/theme/theme";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryProvider>
          <AuthProvider>
            <MicrosoftClarity />
            <SentryUser />
            {children}
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
}
