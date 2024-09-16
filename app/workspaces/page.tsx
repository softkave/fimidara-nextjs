"use client";

import UserContainer from "@/components/app/user/UserContainer";
import WorkspaceList from "@/components/app/workspaces/WorkspaceList";
import type { NextPage } from "next";

export interface IWorkspacesPageProps {}

const Workspaces: NextPage<IWorkspacesPageProps> = () => {
  return (
    <UserContainer
      render={(session) => <WorkspaceList user={session.user} />}
    />
  );
};

export default Workspaces;
