import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Noto_Kufi_Arabic } from "next/font/google";
import { Rubik } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const notoBody = Noto_Kufi_Arabic({ weight: ["500"], subsets: ["arabic"] });
const rubikText = Rubik({ weight: ["500"], subsets: ["hebrew"] });

export const metadata: Metadata = {
  title: "מחשבון מחיר | סמארט פרגולה",
  description: "מחשבון מחיר סמארט פרגולה",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0098a7" },
    { media: "(prefers-color-scheme: dark)", color: "#0098a7" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="rtl">
      <body
        className={`${rubikText.className} bg-gradient-to-b from-primary to-secondary h-dvh flex justify-between`}
      >
        {children}
      </body>
    </html>
  );
}
