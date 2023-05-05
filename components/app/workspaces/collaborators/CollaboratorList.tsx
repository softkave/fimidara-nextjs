import { appWorkspacePaths } from "@/lib/definitions/system";
import { getUseWorkspaceRequestListHookKey } from "@/lib/hooks/workspaces/useWorkspaceRequestList";
import { Collaborator } from "fimidara";
import Link from "next/link";
import React from "react";
import { useSWRConfig } from "swr";
import ItemList from "../../../utils/list/ItemList";
import ThumbnailContent from "../../../utils/page/ThumbnailContent";
import CollaboratorMenu from "./CollaboratorMenu";

export interface CollaboratorListProps {
  workspaceId: string;
  collaborators: Collaborator[];
  renderItem?: (item: Collaborator) => React.ReactNode;
}

const CollaboratorList: React.FC<CollaboratorListProps> = (props) => {
  const { workspaceId, collaborators, renderItem } = props;
  const { mutate } = useSWRConfig();
  const onCompleteRemoveUser = React.useCallback(async () => {
    mutate(getUseWorkspaceRequestListHookKey(workspaceId));
  }, [workspaceId, mutate]);

  const internalRenderItem = React.useCallback(
    (item: Collaborator) => (
      <ThumbnailContent
        key={item.resourceId}
        main={
          <div>
            <Link
              href={appWorkspacePaths.collaborator(
                workspaceId,
                item.resourceId
              )}
            >
              {item.firstName + " " + item.lastName}
            </Link>
            {item.email}
          </div>
        }
        menu={
          <CollaboratorMenu
            key="menu"
            collaborator={item}
            workspaceId={workspaceId}
            onCompleteRemove={onCompleteRemoveUser}
          />
        }
      />
    ),
    [onCompleteRemoveUser, workspaceId]
  );

  return (
    <ItemList
      items={collaborators}
      renderItem={renderItem || internalRenderItem}
      getId={(item: Collaborator) => item.resourceId}
    />
  );
};

export default CollaboratorList;
