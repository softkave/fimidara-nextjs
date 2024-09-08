"use client";

import ItemList from "@/components/utils/list/ItemList";
import ThumbnailContent from "@/components/utils/page/ThumbnailContent";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { getResourceId } from "@/lib/utils/resource";
import { CollaborationRequestForWorkspace } from "fimidara";
import { noop } from "lodash-es";
import Link from "next/link";
import React from "react";
import WorkspaceRequestMenu from "./WorkspaceRequestMenu";

export interface IWorkspaceRequestListProps {
  workspaceId: string;
  requests: CollaborationRequestForWorkspace[];
}

const WorkspaceRequestList: React.FC<IWorkspaceRequestListProps> = (props) => {
  const { workspaceId, requests } = props;

  return (
    <ItemList
      bordered
      items={requests}
      renderItem={(item: CollaborationRequestForWorkspace) => (
        <ThumbnailContent
          key={item.resourceId}
          main={
            <div className="flex flex-col justify-center">
              <Link
                href={appWorkspacePaths.request(workspaceId, item.resourceId)}
              >
                {item.recipientEmail}
              </Link>
              {item.status && (
                <code className="text-secondary mt-2">{item.status}</code>
              )}
            </div>
          }
          menu={
            <div className="flex flex-col justify-center h-full">
              <WorkspaceRequestMenu
                request={item}
                onCompleteDeleteRequest={noop}
              />
            </div>
          }
        />
      )}
      getId={getResourceId}
      emptyMessage="No collaboration requests sent yet. Click the plus button to add collaborators"
    />
  );
};

export default WorkspaceRequestList;
