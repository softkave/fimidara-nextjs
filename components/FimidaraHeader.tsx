import { useUserLoggedIn } from "../lib/hooks/useUserLoggedIn";
import LoggedInHeader from "./app/LoggedInHeader";
import WebHeader, { IWebHeaderProps } from "./web/WebHeader";

export interface IFimidaraHeaderProps {
  webHeaderProps?: IWebHeaderProps;
}

export default function FimidaraHeader(props: IFimidaraHeaderProps) {
  const isLoggedIn = useUserLoggedIn();
  if (isLoggedIn) {
    return <LoggedInHeader />;
  } else {
    const webHeaderProps = props.webHeaderProps || {};
    return <WebHeader {...webHeaderProps} />;
  }
}
