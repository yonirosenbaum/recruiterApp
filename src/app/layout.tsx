import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import { AppProviders } from '@/components/common/AppProviders';
import './globals.css';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Tipoff Daily',
  description:
    'Exclusive hiring tipoffs from public job ads — one agency per city × vertical territory.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
