import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="rtl">
      <body className={`${rubikText.className} h-screen`}>{children}</body>
    </html>
  );
}
