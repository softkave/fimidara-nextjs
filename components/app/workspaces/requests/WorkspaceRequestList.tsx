import { appWorkspacePaths } from "@/lib/definitions/system";
import { useWorkspaceCollaborationRequestDeleteMutationHook } from "@/lib/hooks/mutationHooks";
import { getResourceId } from "@/lib/utils/resource";
import { message, Modal } from "antd";
import { CollaborationRequestForWorkspace } from "fimidara";
import { noop } from "lodash";
import Link from "next/link";
import React from "react";
import { errorMessageNotificatition } from "../../../utils/errorHandling";
import ItemList from "../../../utils/list/ItemList";
import ThumbnailContent from "../../../utils/page/ThumbnailContent";
import { SelectInfo } from "../../../utils/types";
import WorkspaceRequestMenu from "./WorkspaceRequestMenu";

export interface IWorkspaceRequestListProps {
  workspaceId: string;
  requests: CollaborationRequestForWorkspace[];
}

enum MenuKeys {
  DeleteItem = "delete-item",
  UpdateItem = "update-item",
}

const WorkspaceRequestList: React.FC<IWorkspaceRequestListProps> = (props) => {
  const { workspaceId, requests } = props;
  const deleteHook = useWorkspaceCollaborationRequestDeleteMutationHook({
    onSuccess(data, params) {
      message.success("Collaboration request scheduled for deletion.");
    },
    onError(e, params) {
      errorMessageNotificatition(e, "Error deleting collaboration request.");
    },
  });

  const onSelectMenuItem = React.useCallback(
    (info: SelectInfo, itemId: string) => {
      if (info.key === MenuKeys.DeleteItem) {
        Modal.confirm({
          title: "Are you sure you want to delete this collaboration request?",
          okText: "Yes",
          cancelText: "No",
          okType: "primary",
          okButtonProps: { danger: true },
          onOk: async () => {
            await deleteHook.runAsync({
              body: { requestId: itemId },
            });
          },
          onCancel() {
            // do nothing
          },
        });
      }
    },
    [deleteHook]
  );

  return (
    <ItemList
      items={requests}
      renderItem={(item: CollaborationRequestForWorkspace) => (
        <ThumbnailContent
          key={item.resourceId}
          main={
            <div>
              <Link
                href={appWorkspacePaths.request(workspaceId, item.resourceId)}
              >
                {item.recipientEmail}
              </Link>
              {item.status}
            </div>
          }
          menu={
            <WorkspaceRequestMenu
              request={item}
              onCompleteDeleteRequest={noop}
            />
          }
        />
      )}
      getId={getResourceId}
    />
  );
};

export default WorkspaceRequestList;
