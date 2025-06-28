import type { Metadata } from "next";
import "./globals.css";
import { Outfit, Funnel_Sans } from "next/font/google";
import { PortfolioProvider } from "./context/PortfolioContext";

const funnel = Funnel_Sans({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-funnel",
});
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Samuel Razali",
  description: "Samuel Razali's Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${outfit.variable} ${funnel.variable}`}>
        <PortfolioProvider>
          {children}
        </PortfolioProvider>
      </body>
    </html>
  );
}
