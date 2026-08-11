'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styled from 'styled-components';

const ink = '#121212';
const muted = '#4a4a4a';
const rule = '#1a1a1a';
const paper = '#f3f1eb';
const accent = '#b42318';
const tint = '#e8d9c8';

const Page = styled.main`
  min-height: 100vh;
  color: ${ink};
  background-color: ${paper};
  background-image:
    linear-gradient(rgba(18, 18, 18, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(18, 18, 18, 0.035) 1px, transparent 1px);
  background-size: 28px 28px;
  font-family: var(--font-landing-body), 'Source Serif 4', Georgia, serif;
`;

const Shell = styled.div`
  width: min(1080px, calc(100% - 32px));
  margin: 0 auto;
  padding: 28px 0 64px;
`;

const KickerRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${muted};
`;

const Masthead = styled.h1`
  margin: 10px 0 14px;
  text-align: center;
  font-family: var(--font-landing-display), 'Libre Baskerville', Georgia, serif;
  font-size: clamp(2.6rem, 8vw, 4.6rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 0.95;
`;

const Folio = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  align-items: center;
  padding: 10px 0;
  border-top: 1.5px solid ${rule};
  border-bottom: 1.5px solid ${rule};
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const FolioLeft = styled.span`
  justify-self: start;
`;

const FolioCenter = styled.span`
  justify-self: center;
  text-align: center;
`;

const FolioRight = styled.span`
  justify-self: end;
  text-align: right;
`;

const Hero = styled.section`
  padding: 28px 0 8px;
`;

const Eyebrow = styled.p`
  margin: 0 0 10px;
  color: ${accent};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const Headline = styled.h2`
  margin: 0 0 14px;
  max-width: 18ch;
  font-family: var(--font-landing-display), 'Libre Baskerville', Georgia, serif;
  font-size: clamp(1.85rem, 5vw, 3.1rem);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.02em;
`;

const Deck = styled.p`
  margin: 0 0 16px;
  max-width: 62ch;
  font-size: clamp(1.02rem, 2.2vw, 1.2rem);
  line-height: 1.45;
  color: ${ink};
`;

const Byline = styled.p`
  margin: 0;
  padding-bottom: 16px;
  border-bottom: 1px solid ${rule};
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${muted};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(260px, 0.9fr);
  gap: 28px;
  align-items: start;
  padding-top: 22px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

const SignupFirst = styled.div`
  @media (max-width: 820px) {
    order: -1;
  }
`;

const Leads = styled.section``;

const SectionLabel = styled.p`
  margin: 0 0 14px;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${muted};
`;

const Lead = styled.article`
  padding: 14px 0;
  border-bottom: 1px solid rgba(18, 18, 18, 0.18);

  &:first-of-type {
    border-top: 1px solid rgba(18, 18, 18, 0.18);
  }
`;

const LeadTitle = styled.h3`
  margin: 0 0 6px;
  font-family: var(--font-landing-display), 'Libre Baskerville', Georgia, serif;
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.25;
`;

const LeadBody = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.45;
  color: ${muted};
`;

const LeadFoot = styled.p`
  margin: 16px 0 0;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${muted};
`;

const SignupCard = styled.aside`
  border: 1.5px solid ${ink};
  background: #faf9f6;
  padding: 18px 16px 16px;
`;

const SignupMeta = styled.p`
  margin: 0 0 6px;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${muted};
`;

const SignupTitle = styled.h3`
  margin: 0 0 8px;
  font-family: var(--font-landing-display), 'Libre Baskerville', Georgia, serif;
  font-size: 1.55rem;
  line-height: 1.15;
`;

const SignupCopy = styled.p`
  margin: 0 0 14px;
  font-size: 0.95rem;
  line-height: 1.4;
  color: ${muted};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  width: 100%;
  border: 1.5px solid ${ink};
  background: #fff;
  color: ${ink};
  padding: 12px 12px;
  font: inherit;
  font-size: 0.95rem;

  &::placeholder {
    color: #8a8a8a;
  }

  &:focus {
    outline: 2px solid ${ink};
    outline-offset: 1px;
  }
`;

const PrimaryButton = styled.button`
  border: none;
  background: ${ink};
  color: #fff;
  padding: 13px 14px;
  font: inherit;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;

  &:hover {
    background: #000;
  }
`;

const Privacy = styled.p`
  margin: 10px 0 0;
  font-size: 12px;
  color: ${muted};
  line-height: 1.35;
`;

const LiveLink = styled.div`
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(18, 18, 18, 0.15);

  a {
    color: #1d4ed8;
    font-weight: 700;
    text-decoration: none;
  }

  p {
    margin: 4px 0 0;
    font-size: 12px;
    color: ${muted};
  }
`;

const ReportBand = styled.section`
  margin-top: 32px;
  padding: 22px 0;
  border-top: 1.5px solid ${rule};
  border-bottom: 1.5px solid ${rule};
`;

const ReportTitle = styled.h3`
  margin: 0 0 8px;
  font-family: var(--font-landing-display), 'Libre Baskerville', Georgia, serif;
  font-size: 1.55rem;
  line-height: 1.15;
`;

const ReportBody = styled.p`
  margin: 0 0 12px;
  max-width: 62ch;
  font-size: 0.98rem;
  line-height: 1.45;
  color: ${muted};
`;

const ReportLink = styled(Link)`
  color: #1d4ed8;
  font-weight: 700;
  text-decoration: none;
`;

const Scarcity = styled.section`
  margin-top: 28px;
  padding: 18px 16px;
  background: ${tint};
  border: 1px solid rgba(18, 18, 18, 0.12);
`;

const ScarcityTitle = styled.h3`
  margin: 0 0 8px;
  font-family: var(--font-landing-display), 'Libre Baskerville', Georgia, serif;
  font-size: 1.35rem;
`;

const ScarcityBody = styled.p`
  margin: 0;
  font-size: 0.98rem;
  line-height: 1.45;
`;

const FinePrint = styled.section`
  margin-top: 28px;
  padding-top: 18px;
  border-top: 1.5px solid ${rule};
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

const FineCol = styled.div`
  h4 {
    margin: 0 0 8px;
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  p {
    margin: 0;
    font-size: 0.92rem;
    line-height: 1.45;
    color: ${muted};
  }
`;

const Founder = styled.section`
  margin-top: 28px;
  padding-top: 18px;
  border-top: 1.5px solid ${rule};
`;

const FounderGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 14px;
  align-items: start;
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #1e3a5f;
  color: #fff;
  display: grid;
  place-items: center;
  font-family: var(--font-landing-display), Georgia, serif;
  font-weight: 700;
`;

const DropCap = styled.p`
  margin: 0 0 10px;
  font-size: 1.02rem;
  line-height: 1.5;

  &::first-letter {
    float: left;
    font-family: var(--font-landing-display), Georgia, serif;
    font-size: 3.1rem;
    line-height: 0.8;
    padding: 6px 8px 0 0;
    font-weight: 700;
  }
`;

const Signoff = styled.p`
  margin: 0;
  font-size: 0.92rem;
  color: ${muted};
`;

const CtaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
`;

const GhostButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid ${ink};
  background: transparent;
  color: ${ink};
  padding: 12px 16px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
`;

const SolidLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid ${ink};
  background: ${ink};
  color: #fff;
  padding: 12px 16px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
`;

const Nav = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  margin-bottom: 8px;
  font-size: 13px;

  a {
    color: ${muted};
    text-decoration: none;
    font-weight: 600;
  }
`;

function editionDate() {
  return new Intl.DateTimeFormat('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Australia/Sydney',
  }).format(new Date());
}

function currentQuarter() {
  const parts = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Sydney',
    month: 'numeric',
    year: 'numeric',
  }).formatToParts(new Date());
  const month = Number(parts.find((p) => p.type === 'month')?.value ?? 1);
  const year = Number(parts.find((p) => p.type === 'year')?.value ?? 2026);
  return `Q${Math.ceil(month / 3)} ${year}`;
}

const SAMPLE_LEADS = [
  {
    title: 'Struggling role — open well past fill time',
    body: 'Same posting still live after the 45-day threshold. Tipoff ranks it higher as days-open and multi-board sightings stack.',
  },
  {
    title: 'Requirement softening on a repost',
    body: 'Description revisions drop hard requirements or years-of-experience. Heat rises when the ad quietly gets easier to fill.',
  },
  {
    title: 'Ghost and return',
    body: 'A role goes dark, then the same fingerprint reappears weeks later — often a fallen offer or restart. Only your territory sees that tipoff.',
  },
] as const;

export function LandingPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = email.trim()
      ? `?email=${encodeURIComponent(email.trim())}`
      : '';
    router.push(`/signup${q}`);
  };

  return (
    <Page>
      <Shell>
        <Nav>
          <Link href="/report">Report</Link>
          <Link href="/login">Log in</Link>
          <Link href="/signup">Sign up</Link>
        </Nav>

        <KickerRow>
          <span>Public job-ad intelligence</span>
          <span>Est. 2026</span>
        </KickerRow>

        <Masthead>Tipoff Daily</Masthead>

        <Folio>
          <FolioLeft>Australia</FolioLeft>
          <FolioCenter>{editionDate()}</FolioCenter>
          <FolioRight>Vol. 1 · Week 1</FolioRight>
        </Folio>

        <Hero>
          <Eyebrow>Hiring signals · Exclusive territories</Eyebrow>
          <Headline>
            Employers who can&apos;t fill roles — ranked for one agency per
            market.
          </Headline>
          <Deck>
            Tipoff Daily watches public job ads across aggregators and career
            boards, then scores heat: long-open roles, reposts, requirement
            softening, clusters, and ghost returns. You claim one city ×
            vertical territory. That list is yours alone — radar, digests, and
            outreach tracking included.
          </Deck>
          <Byline>Built in Sydney · Updated overnight · Territory-scoped</Byline>
        </Hero>

        <Grid>
          <Leads>
            <SectionLabel>Sample signal shapes</SectionLabel>
            {SAMPLE_LEADS.map((lead) => (
              <Lead key={lead.title}>
                <LeadTitle>{lead.title}</LeadTitle>
                <LeadBody>{lead.body}</LeadBody>
              </Lead>
            ))}
            <LeadFoot>
              Full ranked triggers appear in your territory after you claim a
              slot
            </LeadFoot>
          </Leads>

          <SignupFirst>
            <SignupCard>
              <SignupMeta>Free · Claim a territory</SignupMeta>
              <SignupTitle>Get tipoffs only you can see.</SignupTitle>
              <SignupCopy>
                Create an account, request a city × vertical slot, and open the
                live radar for that market. We don&apos;t email the same list to
                every agency.
              </SignupCopy>
              <Form onSubmit={onSubmit}>
                <Input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@youragency.com.au"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <PrimaryButton type="submit">
                  Claim your territory
                </PrimaryButton>
              </Form>
              <Privacy>
                No spam list blast. One exclusive slot per territory — when
                it&apos;s held, it&apos;s held.
              </Privacy>
              <LiveLink>
                <Link href="/login">Open the live radar →</Link>
                <p>Log in for today&apos;s ranked tipoffs in your allocation.</p>
              </LiveLink>
            </SignupCard>
          </SignupFirst>
        </Grid>

        <ReportBand>
          <SectionLabel>The quarterly edition</SectionLabel>
          <ReportTitle>Tipoff Report</ReportTitle>
          <ReportBody>
            National hiring, fill times, and salary movement from public ads —
            the page directors forward, and the live demo of the benchmarks
            themselves.
          </ReportBody>
          <ReportLink href="/report/quarterly">
            Read the {currentQuarter()} report →
          </ReportLink>
        </ReportBand>

        <Scarcity>
          <ScarcityTitle>One agency per territory.</ScarcityTitle>
          <ScarcityBody>
            A territory is a city × industry pair (for example Sydney × Legal or
            Melbourne × Construction). Only the agency that holds the slot sees
            that radar and digest. Competitors in the same market don&apos;t get
            your tipoffs — and we won&apos;t invent &ldquo;already taken&rdquo;
            claims. Check open slots when you sign up, then request the one you
            want.
          </ScarcityBody>
        </Scarcity>

        <FinePrint>
          <FineCol>
            <h4>Where the data comes from</h4>
            <p>
              Public job ads from aggregators and employer career pages. No
              scraped personal contacts — just roles employers already published.
            </p>
          </FineCol>
          <FineCol>
            <h4>What it isn&apos;t</h4>
            <p>
              Not a CRM. Not a mass-mail tool. Tipoff Daily ranks hiring heat and
              scopes it to your exclusive territory so BD stays targeted.
            </p>
          </FineCol>
          <FineCol>
            <h4>Who it&apos;s for</h4>
            <p>
              Agency owners and billing consultants who want overnight tipoffs in
              one defended market — not another shared job board feed.
            </p>
          </FineCol>
        </FinePrint>

        <Founder>
          <SectionLabel>From the founder</SectionLabel>
          <FounderGrid>
            <Avatar>JR</Avatar>
            <div>
              <DropCap>
                I&apos;m building Tipoff Daily so recruiters stop chasing the same
                Seek shortlist. Everything here comes from ads employers published
                themselves. Claim a territory, and the tipoffs in that market are
                yours.
              </DropCap>
              <Signoff>Jonathan · Founder, Sydney</Signoff>
            </div>
          </FounderGrid>
          <CtaRow>
            <SolidLink href="/signup">Claim your territory →</SolidLink>
            <GhostButton href="/login">Open the radar</GhostButton>
          </CtaRow>
        </Founder>
      </Shell>
    </Page>
  );
}
