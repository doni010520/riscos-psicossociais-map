import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Riscos Psicossociais MAP',
  description: 'Avaliação anônima de riscos psicossociais no ambiente de trabalho',
  keywords: 'riscos psicossociais, saúde ocupacional, MAP, questionário anônimo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
