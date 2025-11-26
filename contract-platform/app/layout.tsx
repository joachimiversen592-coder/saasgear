import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ContractOS - Legal Contract Management',
  description: 'Modern contract management platform for startups',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
