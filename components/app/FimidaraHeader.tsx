import { useUserLoggedIn } from "@/lib/hooks/sessionHook";
import { isInternalPath } from "@/lib/utils/routes";
import { useRouter } from "next/router";
import AppInternalHeader from "../internal/AppInternalHeader";
import { StyleableComponentProps } from "../utils/styling/types";
import WebHeader from "../web/WebHeader";
import AppHeader from "./AppHeader";

export interface IFimidaraHeaderProps extends StyleableComponentProps {}

export default function FimidaraHeader(props: IFimidaraHeaderProps) {
  const { isLoggedIn } = useUserLoggedIn();
  const router = useRouter();

  if (isLoggedIn === undefined) return null;
  if (isInternalPath(router.asPath)) return <AppInternalHeader />;
  if (isLoggedIn) return <AppHeader {...props} />;
  return <WebHeader {...props} />;
}
