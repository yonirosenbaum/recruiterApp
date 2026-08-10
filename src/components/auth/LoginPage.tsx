"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";
import { Alert, Button, TextField } from "@mui/material";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLoginMutation } from "@/lib/query/hooks";

const Page = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(
      circle at 10% 10%,
      rgba(37, 99, 235, 0.18),
      transparent 40%
    ),
    radial-gradient(
      circle at 90% 80%,
      rgba(245, 158, 11, 0.16),
      transparent 35%
    ),
    linear-gradient(160deg, #0f172a 0%, #1e293b 45%, #0f2744 100%);
`;

const Card = styled.div`
  width: min(420px, 100%);
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

export function LoginPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const login = useLoginMutation();
  const [email, setEmail] = useState("jd@meridian.com.au");
  const [password, setPassword] = useState("password");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const session = await login.mutateAsync({ email, password });
    setSession(session);
    router.push(session.user.role === "SUPER_ADMIN" ? "/admin" : "/radar");
  };

  return (
    <Page>
      <Card>
        <Brand>
          <Logo>HR</Logo>
          <div>
            <strong>Tipoff Daily</strong>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              Meridian Recruitment
            </div>
          </div>
        </Brand>
        <Title>Sign in</Title>
        <Sub>Access your exclusive BD triggers for your held territory.</Sub>
        <Form onSubmit={onSubmit}>
          <TextField
            label="Email"
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
          {login.isError && (
            <Alert severity="error">{(login.error as Error).message}</Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={login.isPending}
          >
            {login.isPending ? "Signing in…" : "Sign in"}
          </Button>
        </Form>
        <Foot>
          <Link href="/forgot-password">Forgot password?</Link>
          <br />
          New agency? <Link href="/signup">Create an account</Link>
        </Foot>
      </Card>

      <style jsx global>{`
        body {
          margin: 0;
        }
      `}</style>
    </Page>
  );
}
