import type { Metadata } from 'next';
import './globals.css';
import VengenceBackground from '@/components/ui/VengenceBackground';

export const metadata: Metadata = {
  title: 'InfraTwin AI • Autonomous Road Infrastructure Auditing Platform',
  description: 'AI-powered road infrastructure auditing, 3D depth spatial twin, BOQ generation, and contractor SLA fraud detection for Indian smart cities.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#0a0e17] text-slate-100 font-sans antialiased relative selection:bg-cyan-500 selection:text-slate-950">
        <VengenceBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
