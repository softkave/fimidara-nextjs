"use client";

import WorkspaceComponent from "@/components/app/workspaces/WorkspaceComponent.tsx";
import WorkspaceContainer from "@/components/app/workspaces/WorkspaceContainer.tsx";
import WorkspaceForm from "@/components/app/workspaces/WorkspaceForm";
import { IWorkspaceComponentProps } from "@/components/app/workspaces/utils";
import { Separator } from "@/components/ui/separator.tsx";
import { NextPage } from "next";
import { use } from "react";

interface IEditWorkspacePageProps extends IWorkspaceComponentProps {}

const EditWorkspacePage: NextPage<IEditWorkspacePageProps> = (props) => {
  const { workspaceId } = use(props.params);
  return (
    <WorkspaceContainer
      workspaceId={workspaceId}
      render={(workspace) => (
        <div className="space-y-8">
          <Separator />
          <h4>Workspace Details</h4>
          <WorkspaceComponent workspace={workspace} />
          <Separator />
          <h4>Workspace Form</h4>
          <WorkspaceForm workspace={workspace} />
        </div>
      )}
    />
  );
};

export default EditWorkspacePage;
