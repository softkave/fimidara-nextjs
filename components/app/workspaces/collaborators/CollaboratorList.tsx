import ItemList from "@/components/utils/list/ItemList";
import ThumbnailContent from "@/components/utils/page/ThumbnailContent";
import { appClasses } from "@/components/utils/theme";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { Typography } from "antd";
import { Collaborator } from "fimidara";
import { noop } from "lodash";
import Link from "next/link";
import React from "react";
import CollaboratorMenu from "./CollaboratorMenu";

export interface CollaboratorListProps {
  workspaceId: string;
  collaborators: Collaborator[];
  renderItem?: (item: Collaborator) => React.ReactNode;
}

const CollaboratorList: React.FC<CollaboratorListProps> = (props) => {
  const { workspaceId, collaborators, renderItem } = props;

  const internalRenderItem = React.useCallback(
    (item: Collaborator) => (
      <ThumbnailContent
        key={item.resourceId}
        main={
          <div className={appClasses.thumbnailMain}>
            <Link
              href={appWorkspacePaths.collaborator(
                workspaceId,
                item.resourceId
              )}
            >
              {item.firstName + " " + item.lastName}
            </Link>
            {item.email && (
              <Typography.Text type="secondary">{item.email}</Typography.Text>
            )}
          </div>
        }
        menu={
          <CollaboratorMenu
            key="menu"
            collaborator={item}
            workspaceId={workspaceId}
            onCompleteRemove={noop}
          />
        }
      />
    ),
    [workspaceId]
  );

  return (
    <ItemList
      bordered
      items={collaborators}
      renderItem={renderItem || internalRenderItem}
      getId={(item: Collaborator) => item.resourceId}
      emptyMessage="No collaborators yet."
    />
  );
};

export default CollaboratorList;
