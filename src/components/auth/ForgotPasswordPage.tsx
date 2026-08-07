'use client';

import Link from 'next/link';
import { useState } from 'react';
import styled from 'styled-components';
import { Alert, Button, TextField } from '@mui/material';
import { useForgotPasswordMutation } from '@/lib/query/hooks';

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

const Sub = styled.p`
  margin: 0 0 18px;
  color: #64748b;
  font-size: 14px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Foot = styled.p`
  margin: 16px 0 0;
  font-size: 13px;
  text-align: center;
  color: #64748b;

  a {
    color: #2563eb;
    font-weight: 650;
    text-decoration: none;
  }
`;

export function ForgotPasswordPage() {
  const forgot = useForgotPasswordMutation();
  const [email, setEmail] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await forgot.mutateAsync({ email });
  };

  return (
    <Page>
      <Card>
        <Title>Reset password</Title>
        <Sub>
          Enter your work email and we&apos;ll send a link to reset your
          password.
        </Sub>
        <Form onSubmit={onSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          {forgot.isError && (
            <Alert severity="error">{(forgot.error as Error).message}</Alert>
          )}
          {forgot.isSuccess && (
            <Alert severity="success">{forgot.data.message}</Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={forgot.isPending}
          >
            {forgot.isPending ? 'Sending…' : 'Send reset link'}
          </Button>
        </Form>
        <Foot>
          <Link href="/login">Back to sign in</Link>
        </Foot>
      </Card>
    </Page>
  );
}
