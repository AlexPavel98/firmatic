import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Firmatic — Verifică. Facturează. Controlează.",
  description:
    "Platforma inteligentă pentru verificarea firmelor, facturare e-Factura și monitorizare afaceri din România.",
  keywords: [
    "verificare firme",
    "e-factura",
    "facturare online",
    "ANAF",
    "CUI",
    "firma romania",
    "smartbill alternativa",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
