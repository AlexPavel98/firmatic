import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
        className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
