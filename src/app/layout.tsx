import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Firmatic — Verifică. Facturează. Controlează.",
  description:
    "Platforma inteligentă pentru verificarea firmelor, facturare e-Factura și monitorizare afaceri din România.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className={`${poppins.variable} antialiased`}>{children}</body>
    </html>
  );
}
