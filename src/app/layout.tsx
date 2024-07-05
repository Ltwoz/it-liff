import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LiffProvider } from "@/providers/liff-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { ToastProvider } from "@/providers/toaster-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CMTC IT",
  description: "CMTC IT Line Bot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LiffProvider liffId={process.env.NEXT_PUBLIC_LIFF_ID || ""}>
          <AuthProvider>
            <ToastProvider />
            {children}
          </AuthProvider>
        </LiffProvider>
      </body>
    </html>
  );
}
