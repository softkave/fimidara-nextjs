import { useUserLoggedIn } from "@/lib/hooks/session/useUserLoggedIn.ts";
import { AppLayout } from "./AppLayout.tsx";
import { WebLayout } from "./WebLayout.tsx";

export interface IMaybeLayoutProps {
  children?: React.ReactNode;
  isDocs: boolean;
  shouldRedirectToWorkspace: boolean;
}

export const MaybeLayout = (props: IMaybeLayoutProps) => {
  const { children, isDocs, shouldRedirectToWorkspace } = props;
  const { isLoggedIn } = useUserLoggedIn();

  if (isLoggedIn === undefined) {
    return null;
  }

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
