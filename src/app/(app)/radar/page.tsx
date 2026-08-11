'use client';

import { Suspense } from 'react';
import { RadarPage } from '@/components/radar/RadarPage';

export default function Page() {
  return (
    <Suspense>
      <RadarPage />
    </Suspense>
  );
}
