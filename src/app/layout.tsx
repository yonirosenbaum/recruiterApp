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
  title: 'Hiring-Signal Radar',
  description: 'Exclusive BD triggers from careers-site hiring signals.',
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
