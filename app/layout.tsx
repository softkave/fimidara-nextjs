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
              fontFamilyCode: "var(--font-code), monospace",
              colorText: "var(--text-color-hex)",
              colorTextHeading: "var(--text-color-hex)",
              colorPrimary: "var(--primary-hex)",
              colorBgContainerDisabled: "var(--background-hex)",
              colorBgContainer: "var(--background-hex)",
              colorBgElevated: "var(--background-hex)",
              colorBorder: "var(--border-hex)",
              colorSplit: "var(--border-hex)",
              colorTextDisabled: "var(--text-disabled-color-hex)",
              colorTextDescription: "var(--text-secondary-color-hex)",
              colorTextQuaternary: "var(--text-secondary-color-hex)",
            },
            components: {
              Menu: {
                itemBg: "var(--background-hex)",
                popupBg: "var(--background-hex)",
                itemSelectedBg: "var(--selected-bg)",
                itemSelectedColor: "var(--text-color-hex)",
              },
              Button: {
                defaultBg: "var(--background-hex)",
                defaultShadow: "none",
                primaryShadow: "none",
              },
              Input: {
                activeShadow: "none",
              },
              Select: {
                optionSelectedColor: "var(--text-color-hex)",
                optionSelectedBg: "var(--selected-bg)",
                optionActiveBg: "var(--selected-bg)",
              },
              Table: {
                borderColor: "var(--border-hex)",
                headerBg: "var(--background-hex)",
                rowHoverBg: "var(--selected-bg)",
              },
              Tabs: {
                inkBarColor: "var(--border-hex)",
                itemActiveColor: "var(--text-color-hex)",
                itemColor: "var(--text-color-hex)",
                itemHoverColor: "var(--text-color-hex)",
                itemSelectedColor: "var(--text-color-hex)",
              },
            },
          }}
        >
          <InitApp>{children}</InitApp>
        </ConfigProvider>
      </body>
    </html>
  );
}
