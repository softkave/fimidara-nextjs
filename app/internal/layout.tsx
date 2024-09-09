import { AppLayout } from "@/components/utils/AppLayout.tsx";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "fimidara — internal ops",
  description: "fimidara internal ops page",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppLayout>{children}</AppLayout>;
}
