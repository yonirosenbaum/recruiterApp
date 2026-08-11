import type { Metadata } from 'next';
import { Libre_Baskerville, Source_Serif_4 } from 'next/font/google';
import { TipoffReportPage } from '@/components/report/TipoffReportPage';

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
  title: 'National Tipoff Report — Tipoff Daily',
  description:
    'National hiring, fill times, and salary movement from Australian public job ads. The edition directors forward.',
  openGraph: {
    title: 'National Tipoff Report — Tipoff Daily',
    description:
      'The Australian hiring market, measured from the ads employers published.',
    type: 'article',
  },
};

export default function PublicTipoffReportPage() {
  return (
    <div className={`${display.variable} ${body.variable}`}>
      <TipoffReportPage />
    </div>
  );
}
