import type { Metadata } from 'next';
import { Libre_Baskerville, Source_Serif_4 } from 'next/font/google';
import { QuarterlyReportPage } from '@/components/report/TipoffReportPage';

const display = Libre_Baskerville({
  variable: '--font-landing-display',
  subsets: ['latin'],
  weight: ['400', '700'],
});

const body = Source_Serif_4({
  variable: '--font-landing-body',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Quarterly Tipoff Report — Tipoff Daily',
  description:
    'National hiring by vertical for the quarter, from Australian public job ads.',
  openGraph: {
    title: 'Quarterly Tipoff Report — Tipoff Daily',
    description:
      'The Australian hiring market by vertical, measured from the ads employers published.',
    type: 'article',
  },
};

export default async function PublicQuarterlyReportPage({
  searchParams,
}: {
  searchParams: Promise<{ edition?: string; print?: string }>;
}) {
  const { edition } = await searchParams;
  return (
    <div className={`${display.variable} ${body.variable}`}>
      <QuarterlyReportPage edition={edition} />
    </div>
  );
}
