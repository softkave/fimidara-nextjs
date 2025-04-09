import { Toaster } from "@/components/ui/toaster.tsx";
import { cn } from "@/components/utils.ts";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Source_Code_Pro, Space_Grotesk } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

// const geistSans = Geist({
//   variable: "--font-sans",
//   subsets: ["latin"],
// });

const codeFont = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-code",
});

export const metadata: Metadata = {
  title: "fimidara",
  description: "File storage service for developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          spaceGrotesk.variable,
          codeFont.variable,
          "flex",
          "flex-col"
        )}
      >
        <NextTopLoader />
        <SessionProvider>{children}</SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
