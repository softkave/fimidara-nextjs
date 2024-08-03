"use client";

import UserContainer from "@/components/app/user/UserContainer";
import WorkspaceList from "@/components/app/workspaces/WorkspaceList";
import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import type { NextPage } from "next";

export interface IWorkspacesPageProps {}

const Workspaces: NextPage<IWorkspacesPageProps> = () => {
  return usePageAuthRequired({
    render: () => {
      return (
        <UserContainer
          render={(session) => <WorkspaceList user={session.user} />}
        />
      );
    },
  });
};

export default Workspaces;
