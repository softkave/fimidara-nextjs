"use client";

import { LoginResult } from "@/lib/api-internal/endpoints/privateTypes.ts";
import React from "react";
import { useAssertGetUser } from "../../hooks/useAssertGetUser";

export interface UserContainerProps {
  render: (data: LoginResult) => React.ReactElement;
}

export default function UserContainer(props: UserContainerProps) {
  const { render } = props;
  const user = useAssertGetUser();

  const session = user.assertGet();
  return render(session);
}
