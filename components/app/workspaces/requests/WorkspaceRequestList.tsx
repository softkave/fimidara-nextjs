import { getPublicFimidaraEndpointsUsingUserToken } from "@/lib/api/fimidaraEndpoints";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { getUseWorkspaceRequestListHookKey } from "@/lib/hooks/workspaces/useWorkspaceRequestList";
import { getResourceId } from "@/lib/utils/resource";
import { useRequest } from "ahooks";
import { message, Modal } from "antd";
import { CollaborationRequestForWorkspace } from "fimidara";
import Link from "next/link";
import React from "react";
import { useSWRConfig } from "swr";
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
  const { mutate } = useSWRConfig();
  const deleteItem = React.useCallback(
    async (itemId: string) => {
      try {
        const endpoints = getPublicFimidaraEndpointsUsingUserToken();
        const result = await endpoints.collaborationRequests.deleteRequest({
          body: { requestId: itemId },
        });

        mutate(getUseWorkspaceRequestListHookKey(workspaceId));
        message.success("Collaboration request sent.");
      } catch (error: any) {
        errorMessageNotificatition(
          error,
          "Error deleting collaboration request."
        );
      }
    },
    [workspaceId, mutate]
  );

  const deleteItemHelper = useRequest(deleteItem, { manual: true });
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
            await deleteItemHelper.runAsync(itemId);
          },
          onCancel() {
            // do nothing
          },
        });
      }
    },
    [deleteItemHelper]
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
          menu={<WorkspaceRequestMenu request={item} onCompleteDeleteRequest={() => {
            TODO: change mutate
          }} />}
        />
      )}
      getId={getResourceId}
    />
  );
};

export default WorkspaceRequestList;
