import './globals.css';

export const metadata = {
  title: 'Speedmaster 38 — Precision in Motion',
  description: 'Independent interactive concept celebrating the 2026 OMEGA Speedmaster 38 mm black dial.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}