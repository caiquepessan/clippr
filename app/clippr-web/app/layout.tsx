import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Clippr - Encontre a Barbearia Perfeita",
  description: "Descubra as melhores barbearias perto de você. Agende online, ganhe pontos de fidelidade e tenha a melhor experiência em cuidados masculinos.",
  keywords: ["barbearia", "corte de cabelo", "barba", "agendamento online", "São Paulo"],
  openGraph: {
    title: "Clippr - Encontre a Barbearia Perfeita",
    description: "Descubra as melhores barbearias perto de você.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
