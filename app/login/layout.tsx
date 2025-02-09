import { WebLayout } from "@/components/utils/WebLayout.tsx";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "fimidara — login",
  description: "fimidara login page",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WebLayout isDocs={false} shouldRedirectToWorkspace={true}>
      {children}
    </WebLayout>
  );
}
