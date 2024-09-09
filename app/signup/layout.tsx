import { WebLayout } from "@/components/utils/WebLayout.tsx";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "fimidara — signup",
  description: "fimidara signup page",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <WebLayout>{children}</WebLayout>;
}
