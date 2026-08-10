'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Alert, Button, TextField } from '@mui/material';
import { useAuth } from '@/components/auth/AuthProvider';
import { useSignupMutation } from '@/lib/query/hooks';

const Page = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at 15% 20%, rgba(37, 99, 235, 0.2), transparent 40%),
    radial-gradient(circle at 85% 75%, rgba(245, 158, 11, 0.14), transparent 35%),
    linear-gradient(160deg, #0f172a 0%, #1e293b 45%, #0f2744 100%);
`;

const Card = styled.div`
  width: min(460px, 100%);
  background: #fff;
  border-radius: 18px;
  padding: 28px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
`;

const Logo = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(145deg, #f59e0b, #ea580c);
  color: #fff;
  font-weight: 800;
  display: grid;
  place-items: center;
`;

const Title = styled.h1`
  margin: 0 0 6px;
  font-size: 24px;
  letter-spacing: -0.02em;
`;

const Sub = styled.p`
  margin: 0 0 20px;
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
  color: #64748b;
  text-align: center;

  a {
    color: #2563eb;
    font-weight: 650;
    text-decoration: none;
  }
`;

export function SignupPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const signup = useSignupMutation();
  const [fullName, setFullName] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fromQuery = new URLSearchParams(window.location.search).get('email');
    if (fromQuery) setEmail(fromQuery);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const session = await signup.mutateAsync({
      fullName,
      agencyName,
      email,
      password,
    });
    setSession(session);
    router.push('/onboarding/request-territory');
  };

  return (
    <Page>
      <Card>
        <Brand>
          <Logo>TD</Logo>
          <div>
            <strong>Tipoff Daily</strong>
            <div style={{ fontSize: 12, color: '#64748b' }}>Agency onboarding</div>
          </div>
        </Brand>
        <Title>Create your account</Title>
        <Sub>
          Next you&apos;ll request an exclusive city × vertical territory. Only
          the agency that holds a slot sees that market&apos;s tipoffs.
        </Sub>
        <Form onSubmit={onSubmit}>
          <TextField
            label="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Agency name"
            value={agencyName}
            onChange={(e) => setAgencyName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Work email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          {signup.isError && (
            <Alert severity="error">{(signup.error as Error).message}</Alert>
          )}
          <Button type="submit" variant="contained" size="large" disabled={signup.isPending}>
            {signup.isPending ? 'Creating…' : 'Continue'}
          </Button>
        </Form>
        <Foot>
          Already have an account? <Link href="/login">Sign in</Link>
        </Foot>
      </Card>
    </Page>
  );
}
