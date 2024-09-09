import { AppLayout } from "@/components/utils/AppLayout.tsx";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "fimidara — workspace",
  description: "fimidara workspace page",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppLayout>{children}</AppLayout>;
}
