import { WebLayout } from "@/components/utils/WebLayout.tsx";
import { WebFooter } from "@/components/web/web-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "fimidara — forgot password",
  description: "fimidara forgot password page",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WebLayout
      isDocs={false}
      shouldRedirectToWorkspace={true}
      contentClassName="space-y-32 max-w-full p-0"
    >
      <div className="pt-16">{children}</div>
      <WebFooter className="p-6 pb-4 md:p-8 md:pb-4" />
    </WebLayout>
  );
}
