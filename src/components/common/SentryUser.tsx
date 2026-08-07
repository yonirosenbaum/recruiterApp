"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

/** Attach authenticated user context to Sentry events. */
export function SentryUser() {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN?.trim()) return;

    if (isAuthenticated && user) {
      Sentry.setUser({
        id: user.id,
        email: user.email,
        username: user.fullName,
      });
      Sentry.setTag("role", user.role);
      Sentry.setTag("agency", user.agencyName);
      return;
    }

    Sentry.setUser(null);
  }, [isAuthenticated, user]);

  return null;
}
