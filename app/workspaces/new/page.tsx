"use client";

import WorkspaceForm from "@/components/app/workspaces/WorkspaceForm";
import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";

function WorkspaceFormPage() {
  return usePageAuthRequired({
    render: () => <WorkspaceForm />,
  });
}

export default WorkspaceFormPage;
