import React from "react";
import useLoggedInStatus from "../lib/hooks/useLoggedInStatus";

export interface ILoggedInStatusInitProps {
  render: () => React.ReactElement;
}

export default function LoggedInStatusInit(props: ILoggedInStatusInitProps) {
  const { render } = props;
  const { isReady } = useLoggedInStatus();
  return isReady ? render() : null;
}
