'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LapsedClientsPage } from '@/components/lapsed/LapsedClientsPage';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/watchlist');
  }, [router]);

  return <LapsedClientsPage />;
}
