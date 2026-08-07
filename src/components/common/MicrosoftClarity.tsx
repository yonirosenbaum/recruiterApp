"use client";

import Clarity from "@microsoft/clarity";
import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim() ?? "";

/**
 * Initializes Microsoft Clarity once, then identifies authenticated users
 * so session replays can be filtered by account.
 */
export function MicrosoftClarity() {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!projectId || typeof window === "undefined") return;
    Clarity.init(projectId);
  }, []);

  useEffect(() => {
    if (!projectId || !isAuthenticated || !user) return;
    Clarity.identify(user.id, undefined, undefined, user.fullName);
    Clarity.setTag("role", user.role);
    Clarity.setTag("agency", user.agencyName);
  }, [isAuthenticated, user]);

  return null;
}
