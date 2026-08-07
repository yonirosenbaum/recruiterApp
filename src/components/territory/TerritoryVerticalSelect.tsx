'use client';

import { useEffect, useMemo } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import type { TerritoriesOptions } from '@/types/api';

export type TerritorySelection = {
  areaId: string;
  verticalId: string;
};

type TerritoryVerticalSelectProps = {
  options: TerritoriesOptions | undefined;
  value: TerritorySelection;
  onChange: (next: TerritorySelection) => void;
  disabled?: boolean;
  areaLabel?: string;
  verticalLabel?: string;
  /** When true, only show verticals valid for the selected area */
  cascadeVerticals?: boolean;
};

/**
 * Reusable area + vertical selectors driven by gated `/territories/options`.
 */
export function TerritoryVerticalSelect({
  options,
  value,
  onChange,
  disabled,
  areaLabel = 'Area',
  verticalLabel = 'Vertical',
  cascadeVerticals = true,
}: TerritoryVerticalSelectProps) {
  const areas = options?.areas ?? [];

  const verticalsForArea = useMemo(() => {
    if (!options) return [];
    if (!cascadeVerticals || !value.areaId) {
      return options.verticals;
    }
    const ids = new Set(
      options.combinations
        .filter((c) => c.areaId === value.areaId)
        .map((c) => c.verticalId),
    );
    return options.verticals.filter((v) => ids.has(v.id));
  }, [options, value.areaId, cascadeVerticals]);

  useEffect(() => {
    if (
      value.verticalId &&
      cascadeVerticals &&
      verticalsForArea.length > 0 &&
      !verticalsForArea.some((v) => v.id === value.verticalId)
    ) {
      onChange({ areaId: value.areaId, verticalId: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only reset when area/vertical options change
  }, [value.areaId, value.verticalId, verticalsForArea, cascadeVerticals]);

  return (
    <Stack spacing={2}>
      <FormControl fullWidth required disabled={disabled}>
        <InputLabel id="territory-area-label">{areaLabel}</InputLabel>
        <Select
          labelId="territory-area-label"
          label={areaLabel}
          value={value.areaId}
          onChange={(e) =>
            onChange({ areaId: e.target.value, verticalId: '' })
          }
        >
          {areas.map((area) => (
            <MenuItem key={area.id} value={area.id}>
              {area.name} ({area.state})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl
        fullWidth
        required
        disabled={disabled || (cascadeVerticals && !value.areaId)}
      >
        <InputLabel id="territory-vertical-label">{verticalLabel}</InputLabel>
        <Select
          labelId="territory-vertical-label"
          label={verticalLabel}
          value={value.verticalId}
          onChange={(e) =>
            onChange({ ...value, verticalId: e.target.value })
          }
        >
          {verticalsForArea.map((vertical) => (
            <MenuItem key={vertical.id} value={vertical.id}>
              {vertical.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
