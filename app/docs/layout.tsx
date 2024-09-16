import { MaybeLayout } from "@/components/utils/MaybeLayout.tsx";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "fimidara — docs",
  description: "fimidara docs page",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MaybeLayout>{children}</MaybeLayout>;
}
