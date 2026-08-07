'use client';

import { AdminPage } from '@/components/admin/AdminPage';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Alert } from '@mui/material';

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== 'SUPER_ADMIN') {
      router.replace('/radar');
    }
  }, [user, router]);

  if (user?.role !== 'SUPER_ADMIN') {
    return <Alert severity="warning">Super admin access required.</Alert>;
  }

  return <AdminPage />;
}
