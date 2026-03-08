import type { Metadata } from "next";
import { Space_Grotesk, Nunito } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
      <body
        className={`${spaceGrotesk.variable} ${nunito.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
