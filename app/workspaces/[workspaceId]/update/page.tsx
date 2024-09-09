"use client";

import UploadWorkspaceAvatar from "@/components/app/workspaces/UploadWorkspaceAvatar";
import WorkspaceComponent from "@/components/app/workspaces/WorkspaceComponent.tsx";
import WorkspaceContainer from "@/components/app/workspaces/WorkspaceContainer.tsx";
import WorkspaceForm from "@/components/app/workspaces/WorkspaceForm";
import { IWorkspaceComponentProps } from "@/components/app/workspaces/utils";
import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { NextPage } from "next";

interface IEditWorkspacePageProps extends IWorkspaceComponentProps {}

const EditWorkspacePage: NextPage<IEditWorkspacePageProps> = (props) => {
  const { workspaceId } = props.params;
  return usePageAuthRequired({
    render: () => (
      <WorkspaceContainer
        workspaceId={workspaceId}
        render={(workspace) => (
          <div className="space-y-8">
            <UploadWorkspaceAvatar workspaceId={workspace.resourceId} />
            <Separator />
            <h4>Workspace Details</h4>
            <WorkspaceComponent workspace={workspace} />
            <Separator />
            <h4>Workspace Form</h4>
            <WorkspaceForm workspace={workspace} />
          </div>
        )}
      />
    ),
  });
};

export default EditWorkspacePage;
