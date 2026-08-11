"use client";

import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  useMarkContactedMutation,
  useUndoOutreachMutation,
} from "@/lib/query/hooks";

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

const Hint = styled.span`
  font-size: 12px;
  color: #64748b;
`;

export type OutreachKindChoice = "CONTACTED" | "NOT_RELEVANT" | "PITCHED";

type OutreachActionsProps = {
  companyId: string;
  canonicalJobId?: string | null;
  hiringSignalId?: string | null;
  modes: Array<"called" | "not_relevant" | "pitched">;
  disabled?: boolean;
  size?: "small" | "medium";
};

const LABELS: Record<
  "called" | "not_relevant" | "pitched",
  { kind: OutreachKindChoice; text: string }
> = {
  called: { kind: "CONTACTED", text: "Contacted" },
  not_relevant: { kind: "NOT_RELEVANT", text: "Not relevant" },
  pitched: { kind: "PITCHED", text: "We pitched this" },
};

export function OutreachActions({
  companyId,
  canonicalJobId,
  hiringSignalId,
  modes,
  disabled = false,
  size = "small",
}: OutreachActionsProps) {
  const mark = useMarkContactedMutation();
  const undo = useUndoOutreachMutation();
  const [pendingUndoId, setPendingUndoId] = useState<string | null>(null);
  const [recorded, setRecorded] = useState<OutreachKindChoice | null>(null);

  useEffect(() => {
    if (!pendingUndoId) return;
    const timer = window.setTimeout(() => setPendingUndoId(null), 8000);
    return () => window.clearTimeout(timer);
  }, [pendingUndoId]);

  const onMark = async (kind: OutreachKindChoice) => {
    const result = await mark.mutateAsync({
      companyId,
      canonicalJobId: canonicalJobId || undefined,
      hiringSignalId: hiringSignalId || undefined,
      kind,
    });
    setRecorded(kind);
    setPendingUndoId(result.event.id);
  };

  const onUndo = async () => {
    if (!pendingUndoId) return;
    const id = pendingUndoId;
    setPendingUndoId(null);
    await undo.mutateAsync(id);
    setRecorded(null);
  };

  if (recorded) {
    const label =
      recorded === "CONTACTED"
        ? "Called"
        : recorded === "NOT_RELEVANT"
          ? "Not relevant"
          : "Pitched";
    return (
      <Row>
        <Hint>{label}</Hint>
        {pendingUndoId && (
          <>
            <Button
              variant="text"
              size={size}
              onClick={() => void onUndo()}
              disabled={undo.isPending}
            >
              Undo
            </Button>
            <Hint>Mis-tap? Undo for a few seconds</Hint>
          </>
        )}
      </Row>
    );
  }

  return (
    <Row>
      {modes.map((mode) => {
        const spec = LABELS[mode];
        return (
          <Button
            key={mode}
            variant={
              mode === "called" || mode === "pitched" ? "contained" : "outlined"
            }
            size={size}
            onClick={() => void onMark(spec.kind)}
            disabled={disabled || mark.isPending || undo.isPending}
          >
            {spec.text}
          </Button>
        );
      })}
    </Row>
  );
}
