import { useUserLoggedIn } from "../lib/hooks/useUserLoggedIn";
import LoggedInHeader, { ILoggedInHeaderProps } from "./app/LoggedInHeader";
import WebHeader, { IWebHeaderProps } from "./web/WebHeader";

export interface IFimidaraHeaderProps {
  headerProps?: Extract<IWebHeaderProps, ILoggedInHeaderProps>;
}

export default function FimidaraHeader(props: IFimidaraHeaderProps) {
  const isLoggedIn = useUserLoggedIn();
  const headerProps = props.headerProps ?? {};
  if (isLoggedIn) {
    return <LoggedInHeader {...headerProps} />;
  } else {
    return <WebHeader {...headerProps} />;
  }
}
