'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { TerritoryRequestForm } from '@/components/territory/TerritoryRequestForm';

type TerritoryRequestModalProps = {
  open: boolean;
  onClose: () => void;
};

export function TerritoryRequestModal({
  open,
  onClose,
}: TerritoryRequestModalProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pr: 1,
        }}
      >
        Request a new territory
        <IconButton aria-label="Close" onClick={onClose} size="small">
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pb: 3 }}>
        <TerritoryRequestForm
          submitLabel="Request a new territory"
          onSuccess={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
