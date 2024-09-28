"use client";

import React from "react";
import { useUserNode } from "../../hooks/useUserNode";
import { LoginResult } from "@/lib/api-internal/endpoints/privateTypes.ts";

export interface UserContainerProps {
  render: (data: LoginResult) => React.ReactElement;
}

export default function UserContainer(props: UserContainerProps) {
  const { render } = props;
  const user = useUserNode();

  if (user.renderedNode) {
    return user.renderedNode;
  } else {
    const session = user.assertGet();
    return render(session);
  }
}
