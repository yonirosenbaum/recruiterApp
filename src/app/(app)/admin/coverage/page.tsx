'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { Alert } from '@mui/material';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/layout/AppHeader';
import { AdminCoverageTable } from '@/components/admin/AdminCoverageTable';
import { useAuth } from '@/components/auth/AuthProvider';

const Card = styled.section`
  background: #fff;
  border: 1px solid #e8edf5;
  border-radius: 14px;
  padding: 18px 20px;
`;

const Back = styled(Link)`
  display: inline-block;
  margin-bottom: 12px;
  color: #64748b;
  font-size: 13px;
  text-decoration: none;

  &:hover {
    color: #0f172a;
  }
`;

export default function AdminCoveragePage() {
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

  return (
    <>
      <AppHeader
        title="City × vertical coverage"
        subtitle="Live jobs, all jobs, and distinct companies in each territory slot."
      />
      <Back href="/admin">← Admin</Back>
      <Card>
        <AdminCoverageTable />
      </Card>
    </>
  );
}
