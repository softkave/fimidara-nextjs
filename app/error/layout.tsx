import { WebLayout } from "@/components/utils/WebLayout.tsx";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "fimidara — error",
  description: "fimidara error page",
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
