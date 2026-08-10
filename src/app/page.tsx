import type { Metadata } from 'next';
import { Libre_Baskerville, Source_Serif_4 } from 'next/font/google';
import { LandingPage } from '@/components/landing/LandingPage';

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
  title: 'Tipoff Daily — Exclusive hiring tipoffs by territory',
  description:
    'Ranked hiring signals from public job ads. One agency per city × vertical territory.',
};

export default function HomePage() {
  return (
    <div className={`${display.variable} ${body.variable}`}>
      <LandingPage />
    </div>
  );
}
