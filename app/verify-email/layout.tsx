import { WebLayout } from "@/components/utils/WebLayout.tsx";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "fimidara — verify email",
  description: "fimidara verify email page",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WebLayout isDocs={false} shouldRedirectToWorkspace={false}>
      {children}
    </WebLayout>
  );
}
