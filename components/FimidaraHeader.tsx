import { useUserLoggedIn } from "../lib/hooks/useUserLoggedIn";
import AppHeader, { IAppHeaderProps } from "./app/AppHeader";
import WebHeader, { IWebHeaderProps } from "./web/WebHeader";

export interface IFimidaraHeaderProps {
  headerProps?: Extract<IWebHeaderProps, IAppHeaderProps>;
}

export default function FimidaraHeader(props: IFimidaraHeaderProps) {
  const { isLoggedIn } = useUserLoggedIn();
  const headerProps = props.headerProps ?? {};
  if (isLoggedIn) {
    return <AppHeader {...headerProps} />;
  } else {
    return <WebHeader {...headerProps} />;
  }
}
