import type { Metadata } from "next";
import "./globals.css";
import { Funnel_Display, Outfit } from "next/font/google";

const funnel = Funnel_Display({
  subsets: ["latin"],
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
        {children}
      </body>
    </html>
  );
}
