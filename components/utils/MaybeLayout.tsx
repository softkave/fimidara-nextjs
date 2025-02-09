import { useServerUserLoggedIn } from "@/lib/hooks/session/useServerUserLoggedIn.ts";
import { AppLayout } from "./AppLayout.tsx";
import { WebLayout } from "./WebLayout.tsx";

export interface IMaybeLayoutProps {
  children?: React.ReactNode;
  isDocs: boolean;
  shouldRedirectToWorkspace: boolean;
}

export const MaybeLayout = async (props: IMaybeLayoutProps) => {
  const { children, isDocs, shouldRedirectToWorkspace } = props;
  const isLoggedIn = await useServerUserLoggedIn();

  return isLoggedIn ? (
    <AppLayout>{children}</AppLayout>
  ) : (
    <WebLayout
      isDocs={isDocs}
      shouldRedirectToWorkspace={shouldRedirectToWorkspace}
    >
      {children}
    </WebLayout>
  );
};
