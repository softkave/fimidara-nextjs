import { cn } from "@/components/utils.ts";
import { InitApp } from "@/components/utils/InitApp.tsx";
import { ConfigProvider } from "antd";
import type { Metadata } from "next";
import { Source_Code_Pro, Work_Sans } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const defaultFont = Work_Sans({
  subsets: ["latin"],
  variable: "--font-default",
  weight: "400",
});
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
          defaultFont.variable,
          codeFont.variable,
          "flex",
          "flex-col"
        )}
      >
        <NextTopLoader />
        <ConfigProvider
          theme={{
            token: {
              fontFamily: `var(--font-default), "Segoe UI", -apple-system, BlinkMacSystemFont, 
                Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
                "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
              fontFamilyCode: `var(--font-code), monospace`,
              // colorTextBase: "rgb(var(--text-code-rgb))",
              // colorTextBase: "#262626",
            },
          }}
        >
          <InitApp>{children}</InitApp>
        </ConfigProvider>
      </body>
    </html>
  );
}
