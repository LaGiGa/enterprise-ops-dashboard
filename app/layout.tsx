import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Enterprise Ops Dashboard - Full Stack Core',
  description: 'Painel de Gestão Operacional e Métricas Corporativas com CRUD relacional, paginação server-side via URL, filtros complexos e gráficos analíticos Recharts.',
  openGraph: {
    title: 'Enterprise Ops Dashboard - Full Stack Core',
    description: 'Painel de Gestão Operacional e Métricas Corporativas com CRUD relacional, paginação server-side via URL, filtros complexos e gráficos analíticos Recharts.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Enterprise Ops Dashboard - Full Stack Core',
    description: 'Painel de Gestão Operacional e Métricas Corporativas com CRUD relacional, paginação server-side via URL, filtros complexos e gráficos analíticos Recharts.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-zinc-50/70 text-zinc-900 antialiased" suppressHydrationWarning>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
