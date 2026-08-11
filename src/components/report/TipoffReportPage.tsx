"use client";

import Link from "next/link";
import { useEffect } from "react";
import styled from "styled-components";
import { usePublicTipoffReportQuery } from "@/lib/query/hooks";
import type {
  MarketIntelCompanyRow,
  MarketIntelReport,
  PublicTipoffReport,
} from "@/types/api";

const ink = "#121212";
const muted = "#4a4a4a";
const rule = "#1a1a1a";
const paper = "#f3f1eb";
const accent = "#b42318";
const tint = "#e8d9c8";

const Page = styled.main<{ $embedded?: boolean }>`
  min-height: ${({ $embedded }) => ($embedded ? "auto" : "100vh")};
  color: ${ink};
  background-color: ${paper};
  background-image:
    linear-gradient(rgba(18, 18, 18, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(18, 18, 18, 0.035) 1px, transparent 1px);
  background-size: 28px 28px;
  font-family: var(--font-landing-body), "Source Serif 4", Georgia, serif;
  ${({ $embedded }) =>
    $embedded
      ? `
    border: 1.5px solid ${rule};
    margin-top: 8px;
  `
      : ""}

  @media print {
    background: #fff;
    background-image: none;
    border: none;
  }
`;

const Shell = styled.div<{ $embedded?: boolean }>`
  width: min(820px, calc(100% - 32px));
  margin: 0 auto;
  padding: ${({ $embedded }) => ($embedded ? "20px 0 40px" : "28px 0 72px")};

  @media print {
    width: 100%;
    padding: 0;
  }
`;

const Nav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 14px;
  margin-bottom: 8px;
  font-size: 13px;

  a {
    color: ${muted};
    text-decoration: none;
    font-weight: 600;
  }

  @media print {
    display: none;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 14px;
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

const Masthead = styled.p`
  margin: 10px 0 14px;
  text-align: center;
  font-family: var(--font-landing-display), "Libre Baskerville", Georgia, serif;
  font-size: clamp(2.2rem, 7vw, 3.6rem);
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

const Hero = styled.header`
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

const Headline = styled.h1`
  margin: 0 0 14px;
  font-family: var(--font-landing-display), "Libre Baskerville", Georgia, serif;
  font-size: clamp(1.85rem, 4.6vw, 2.85rem);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.02em;
`;

const Deck = styled.p`
  margin: 0 0 16px;
  font-size: clamp(1.02rem, 2.2vw, 1.18rem);
  line-height: 1.45;
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

const Headlines = styled.ol`
  margin: 22px 0 0;
  padding: 16px 16px 16px 36px;
  background: ${tint};
  border: 1px solid rgba(18, 18, 18, 0.12);
  font-size: 0.98rem;
  line-height: 1.45;

  li + li {
    margin-top: 8px;
  }
`;

const Section = styled.section`
  margin-top: 28px;
  padding-top: 18px;
  border-top: 1.5px solid ${rule};
`;

const SectionLabel = styled.h2`
  margin: 0 0 12px;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${muted};
  font-weight: 700;
`;

const SectionLede = styled.p`
  margin: 0 0 14px;
  font-size: 0.95rem;
  line-height: 1.45;
  color: ${muted};
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const Row = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid rgba(18, 18, 18, 0.16);

  &:first-of-type {
    border-top: 1px solid rgba(18, 18, 18, 0.16);
  }
`;

const RowName = styled.div`
  font-weight: 700;
  font-size: 1.02rem;
  line-height: 1.3;
`;

const RowMeta = styled.div`
  margin-top: 3px;
  font-size: 0.88rem;
  color: ${muted};
`;

const Stat = styled.span`
  font-weight: 700;
  color: ${accent};
  white-space: nowrap;
`;

const BenchLink = styled(Link)`
  display: block;
  color: inherit;
  text-decoration: none;

  &:hover ${RowName} {
    text-decoration: underline;
  }
`;

const Empty = styled.p`
  margin: 18px 0 0;
  font-size: 1rem;
  line-height: 1.5;
  color: ${muted};
`;

const Method = styled.section`
  margin-top: 32px;
  padding-top: 18px;
  border-top: 1.5px solid ${rule};
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }

  h3 {
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

const Cta = styled.aside`
  margin-top: 28px;
  padding: 20px 18px;
  border: 1.5px solid ${ink};
  background: #faf9f6;

  @media print {
    display: none;
  }
`;

const CtaTitle = styled.h2`
  margin: 0 0 8px;
  font-family: var(--font-landing-display), "Libre Baskerville", Georgia, serif;
  font-size: 1.55rem;
  line-height: 1.15;
`;

const CtaCopy = styled.p`
  margin: 0 0 16px;
  font-size: 0.98rem;
  line-height: 1.45;
  color: ${muted};
`;

const CtaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
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

const PrintBtn = styled.button`
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  color: ${muted};
  cursor: pointer;

  @media print {
    display: none;
  }
`;

const Status = styled.p`
  margin: 28px 0 0;
  font-size: 1.05rem;
  color: ${muted};
`;

function formatAud(n: number | null): string {
  if (n == null) return "n/a";
  const sign = n > 0 ? "+" : "";
  return `${sign}$${Math.round(n).toLocaleString("en-AU")}`;
}

function editionDate(iso?: string) {
  return new Intl.DateTimeFormat("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Australia/Sydney",
  }).format(iso ? new Date(iso) : new Date());
}

function endEmployers(rows: MarketIntelCompanyRow[]) {
  return rows.filter((r) => r.isAgency !== true);
}

function hasModules(data: MarketIntelReport) {
  return (
    data.ttfByRolePlace.length > 0 ||
    data.repostByEmployer.length > 0 ||
    data.salaryMovementByVertical.length > 0 ||
    endEmployers(data.hiring).length > 0 ||
    data.agencyActivity.length > 0 ||
    endEmployers(data.frozen).length > 0 ||
    endEmployers(data.thawed).length > 0
  );
}

function CompanyList({
  rows,
  countLabel,
}: {
  rows: MarketIntelCompanyRow[];
  countLabel: string;
}) {
  return (
    <div>
      {rows.map((r) => (
        <Row key={r.companyId}>
          <RowName>{r.companyName}</RowName>
          <RowMeta>
            {r.liveRoleCount} {countLabel}
            {r.note ? ` · ${r.note}` : ""}
          </RowMeta>
        </Row>
      ))}
    </div>
  );
}

export function TipoffReportPage({
  embedded = false,
  edition,
}: {
  embedded?: boolean;
  edition?: string;
}) {
  const { data, isLoading, isError } = usePublicTipoffReportQuery(edition);

  useEffect(() => {
    if (!data) return;
    const print =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("print") === "1";
    if (!print) return;
    const t = window.setTimeout(() => window.print(), 400);
    return () => window.clearTimeout(t);
  }, [data]);

  return (
    <Page $embedded={embedded}>
      <Shell $embedded={embedded}>
        <Nav>
          {embedded ? <span /> : <Link href="/">Tipoff Daily</Link>}
          <NavLinks>
            <PrintBtn type="button" onClick={() => window.print()}>
              Print
            </PrintBtn>
            {!embedded && (
              <>
                <Link href="/login">Log in</Link>
                <Link href="/signup">Sign up</Link>
              </>
            )}
          </NavLinks>
        </Nav>

        <KickerRow>
          <span>Public job-ad intelligence</span>
          <span>
            {data?.frozen ? "Frozen edition · " : ""}
            {data?.editionLabel ?? "Quarterly edition"}
          </span>
        </KickerRow>

        <Masthead>Tipoff Daily</Masthead>

        <Folio>
          <FolioLeft>Australia</FolioLeft>
          <FolioCenter>{editionDate(data?.generatedAt)}</FolioCenter>
          <FolioRight>
            {data ? `${data.lookbackDays}-day lookback` : "90-day lookback"}
          </FolioRight>
        </Folio>

        {isLoading && <Status>Going to press…</Status>}
        {isError && (
          <Status>This edition could not be loaded. Try again shortly.</Status>
        )}

        {data && <ReportBody data={data} />}
      </Shell>
    </Page>
  );
}

function ReportBody({ data }: { data: PublicTipoffReport }) {
  const hiring = endEmployers(data.hiring);
  const frozen = endEmployers(data.frozen);
  const thawed = endEmployers(data.thawed);
  const modules = hasModules(data);

  return (
    <>
      <Hero>
        <Eyebrow>
          Quarterly Tipoff Report · {data.editionLabel}
          {data.frozen ? " · archived snapshot" : ""}
        </Eyebrow>
        <Headline>
          The Australian hiring market, measured from the ads employers
          published.
        </Headline>
        <Deck>
          End-employer hiring is listed separately from agency ads. Fill times
          and salary movement only appear when the sample is real — the same
          gates that power the live benchmarks. This is the public edition:
          national, screenshot-friendly, and built to be forwarded.
        </Deck>
        <Byline>
          {data.periodLabel} · Generated {editionDate(data.generatedAt)} ·
          Public ads only
        </Byline>
      </Hero>

      {data.headlines.length > 0 && (
        <Headlines>
          {data.headlines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </Headlines>
      )}

      {!modules && (
        <Empty>
          This edition is still gathering closed-role sample. Modules appear as
          volume matures — n≥10 for rates and fill times, n≥20 for salary.
        </Empty>
      )}

      {(hiring.length > 0 || data.agencyActivity.length > 0) && (
        <Section>
          <TwoCol>
            {hiring.length > 0 && (
              <div>
                <SectionLabel>Who&apos;s hiring</SectionLabel>
                <SectionLede>
                  End-employers with live roles. Staffing firms are excluded.
                </SectionLede>
                <CompanyList rows={hiring} countLabel="open" />
              </div>
            )}
            {data.agencyActivity.length > 0 && (
              <div>
                <SectionLabel>Agency activity</SectionLabel>
                <SectionLede>
                  Recruitment firms advertising on public boards — competitor
                  volume, not client hiring.
                </SectionLede>
                <CompanyList rows={data.agencyActivity} countLabel="live ads" />
              </div>
            )}
          </TwoCol>
        </Section>
      )}

      {data.ttfByRolePlace.length > 0 && (
        <Section>
          <SectionLabel>Median days-to-fill</SectionLabel>
          <SectionLede>
            Closed public ads, role × place. City rows open the live benchmark
            slice — the same figures subscribers query inside the product.
          </SectionLede>
          {data.ttfByRolePlace.map((r) => {
            const body = (
              <>
                <RowName>
                  {r.title}{" "}
                  <span style={{ fontWeight: 400 }}>in {r.place}</span>
                </RowName>
                <RowMeta>
                  <Stat>{r.medianTtfDays}d</Stat> median · {r.sampleSize} closed
                  {r.placeKind === "region" ? " · region" : ""}
                  {r.slug ? " · open benchmark →" : ""}
                </RowMeta>
              </>
            );
            return (
              <Row key={`${r.placeKind}-${r.place}-${r.title}`}>
                {r.slug ? (
                  <BenchLink href={`/benchmarks/${r.slug}`}>{body}</BenchLink>
                ) : (
                  body
                )}
              </Row>
            );
          })}
        </Section>
      )}

      {data.featuredBenchmarks.length > 0 && (
        <Section>
          <SectionLabel>Featured fill-time slices</SectionLabel>
          <SectionLede>
            Public benchmarks, ranked by sample. Share a city × title page, or{" "}
            <Link href="/benchmarks/explore">browse the full index</Link>.
          </SectionLede>
          {data.featuredBenchmarks.map((row) => (
            <Row key={row.slug}>
              <BenchLink href={`/benchmarks/${row.slug}`}>
                <RowName>
                  {row.titleQuery}{" "}
                  <span style={{ fontWeight: 400 }}>in {row.areaName}</span>
                </RowName>
                <RowMeta>
                  <Stat>
                    {row.marketMedianTtfDays != null
                      ? `${row.marketMedianTtfDays}d median`
                      : "Open now"}
                  </Stat>
                  {row.sampleSize > 0 ? ` · ${row.sampleSize} closed` : ""}
                  {(row.openRoleCount ?? 0) > 0
                    ? ` · ${row.openRoleCount} open`
                    : ""}
                  {(row.salaryRoleCount ?? 0) > 0
                    ? ` · ${row.salaryRoleCount} roles with salary`
                    : ""}{" "}
                  · open benchmark →
                </RowMeta>
              </BenchLink>
            </Row>
          ))}
        </Section>
      )}

      {data.repostByEmployer.length > 0 && (
        <Section>
          <SectionLabel>Repost rates by employer</SectionLabel>
          <SectionLede>
            Share of live roles that look like a rewrite or re-list (n≥10 live).
          </SectionLede>
          {data.repostByEmployer.map((r) => (
            <Row key={r.companyId}>
              <RowName>{r.companyName}</RowName>
              <RowMeta>
                <Stat>{r.repostRatePercent}%</Stat> · {r.repostCount}/
                {r.liveCount} live
              </RowMeta>
            </Row>
          ))}
        </Section>
      )}

      {data.salaryMovementByVertical.length > 0 && (
        <Section>
          <SectionLabel>Salary movement by vertical</SectionLabel>
          <SectionLede>
            Midpoints from published bands, recent half of the lookback versus
            the prior half (n≥20 ads).
          </SectionLede>
          {data.salaryMovementByVertical.map((r) => (
            <Row key={r.verticalId}>
              <RowName>{r.verticalName}</RowName>
              <RowMeta>
                Now{" "}
                {r.recentMedian != null
                  ? `$${Math.round(r.recentMedian).toLocaleString("en-AU")}`
                  : "n/a"}{" "}
                · prior{" "}
                {r.priorMedian != null
                  ? `$${Math.round(r.priorMedian).toLocaleString("en-AU")}`
                  : "n/a"}{" "}
                · <Stat>{formatAud(r.delta)}</Stat>
              </RowMeta>
            </Row>
          ))}
        </Section>
      )}

      {(frozen.length > 0 || thawed.length > 0) && (
        <Section>
          <TwoCol>
            {frozen.length > 0 && (
              <div>
                <SectionLabel>Frozen</SectionLabel>
                <SectionLede>
                  End-employers that went quiet after closing roles.
                </SectionLede>
                <CompanyList rows={frozen} countLabel="closed" />
              </div>
            )}
            {thawed.length > 0 && (
              <div>
                <SectionLabel>Thawed</SectionLabel>
                <SectionLede>
                  Fresh listings after a quiet spell — hiring restarting.
                </SectionLede>
                <CompanyList rows={thawed} countLabel="open" />
              </div>
            )}
          </TwoCol>
        </Section>
      )}

      <Method>
        <div>
          <h3>How to read this</h3>
          <p>
            Who&apos;s hiring is end-employers only. Agency ads are competitor
            activity, not client demand. A figure is omitted until the sample
            clears the gate: n≥10 closed for fill time, n≥10 live for repost
            rates, n≥20 ads for salary.
          </p>
        </div>
        <div>
          <h3>Where the data comes from</h3>
          <p>
            Public job ads from aggregators and employer career pages over the
            last {data.lookbackDays} days. No scraped personal contacts — just
            roles employers already published. Territory-scoped tipoffs stay
            behind a claimed slot.
          </p>
        </div>
      </Method>

      <Cta>
        <CtaTitle>This is the public edition. The radar is exclusive.</CtaTitle>
        <CtaCopy>
          Directors forward this page. The overnight list — struggling roles,
          softening requirements, ghost returns — is one agency per city ×
          vertical. Claim a territory to see it.
        </CtaCopy>
        <CtaRow>
          <SolidLink href="/signup">Claim your territory →</SolidLink>
          <GhostButton href="/benchmarks/explore">
            Browse benchmarks
          </GhostButton>
        </CtaRow>
      </Cta>
    </>
  );
}
