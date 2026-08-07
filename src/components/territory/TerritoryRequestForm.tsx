'use client';

import { useState } from 'react';
import styled from 'styled-components';
import {
  Alert,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';
import {
  useRequestTerritoryMutation,
  useTerritoryOptionsQuery,
} from '@/lib/query/hooks';
import {
  TerritoryVerticalSelect,
  type TerritorySelection,
} from '@/components/territory/TerritoryVerticalSelect';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Hint = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.5;
`;

type TerritoryRequestFormProps = {
  submitLabel?: string;
  onSuccess?: () => void;
  showNotes?: boolean;
};

export function TerritoryRequestForm({
  submitLabel = 'Request a new territory',
  onSuccess,
  showNotes = true,
}: TerritoryRequestFormProps) {
  const { data, isLoading, isError } = useTerritoryOptionsQuery('requestable');
  const mutation = useRequestTerritoryMutation();
  const [selection, setSelection] = useState<TerritorySelection>({
    areaId: '',
    verticalId: '',
  });
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutation.mutateAsync({
      areaId: selection.areaId,
      verticalId: selection.verticalId,
      notes: notes || undefined,
    });
    onSuccess?.();
  };

  if (isLoading) {
    return <CircularProgress size={28} />;
  }

  if (isError || !data) {
    return <Alert severity="error">Could not load requestable territories.</Alert>;
  }

  if (data.combinations.length === 0) {
    return (
      <Alert severity="info">
        No open territory slots are available to request right now.
      </Alert>
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Hint>
        Pick an open area and vertical. Requests stay pending until a super
        admin approves — slots are never auto-assigned.
      </Hint>

      <TerritoryVerticalSelect
        options={data}
        value={selection}
        onChange={setSelection}
      />

      {showNotes && (
        <TextField
          label="Notes (optional)"
          multiline
          minRows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          fullWidth
        />
      )}

      {mutation.isError && (
        <Alert severity="error">
          {(mutation.error as Error).message || 'Request failed'}
        </Alert>
      )}

      {mutation.isSuccess && (
        <Alert severity="success">
          Request submitted. An admin must confirm before this slot is allocated.
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        disabled={
          !selection.areaId || !selection.verticalId || mutation.isPending
        }
      >
        {mutation.isPending ? 'Submitting…' : submitLabel}
      </Button>
    </Form>
  );
}
