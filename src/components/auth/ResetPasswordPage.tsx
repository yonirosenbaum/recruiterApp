'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import styled from 'styled-components';
import { Alert, Button, TextField } from '@mui/material';
import { useResetPasswordMutation } from '@/lib/query/hooks';

const Page = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: linear-gradient(160deg, #0f172a 0%, #1e293b 45%, #0f2744 100%);
`;

const Card = styled.div`
  width: min(420px, 100%);
  background: #fff;
  border-radius: 18px;
  padding: 28px;
`;

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();
  const reset = useResetPasswordMutation();
  const [token, setToken] = useState(params.get('token') ?? '');
  const [password, setPassword] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await reset.mutateAsync({ token, password });
    router.push('/login');
  };

  return (
    <Card>
      <Title>Choose a new password</Title>
      <Form onSubmit={onSubmit}>
        <TextField
          label="Reset token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="New password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
        />
        {reset.isError && (
          <Alert severity="error">{(reset.error as Error).message}</Alert>
        )}
        {reset.isSuccess && (
          <Alert severity="success">{reset.data.message}</Alert>
        )}
        <Button type="submit" variant="contained" disabled={reset.isPending}>
          {reset.isPending ? 'Updating…' : 'Update password'}
        </Button>
      </Form>
      <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13 }}>
        <Link href="/login" style={{ color: '#2563eb', fontWeight: 650 }}>
          Back to sign in
        </Link>
      </p>
    </Card>
  );
}

export function ResetPasswordPage() {
  return (
    <Page>
      <Suspense fallback={<Card>Loading…</Card>}>
        <ResetPasswordForm />
      </Suspense>
    </Page>
  );
}
