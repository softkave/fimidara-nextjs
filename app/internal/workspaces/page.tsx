"use client";

import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import FimidaraWorkspaces from "@/components/internal/workspaces/FimidaraWorkspaces";
import type { NextPage } from "next";

export interface IWorkspacesPageProps {}

const WorkspacesPage: NextPage<IWorkspacesPageProps> = () => {
  return usePageAuthRequired({
    render: () => <FimidaraWorkspaces />,
  });
};

export default WorkspacesPage;
