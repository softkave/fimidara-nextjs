import { Space } from "antd";
import React from "react";
import useClientToken from "../../../../lib/hooks/workspaces/useClientToken";
import PageLoading from "../../../utils/PageLoading";
import PageError from "../../../utils/PageError";
import LabeledNode from "../../../utils/LabeledNode";
import AssignedPermissionGroupList from "../permissionGroups/AssignedPermissionGroupList";
import assert from "assert";
import ComponentHeader from "../../../utils/ComponentHeader";
import ClientTokenMenu from "./ClientTokenMenu";
import { useRouter } from "next/router";
import { appWorkspacePaths } from "../../../../lib/definitions/system";
import { useSWRConfig } from "swr";
import { getUseWorkspaceClientTokenListHookKey } from "../../../../lib/hooks/workspaces/useWorkspaceClientTokenList";
import { appClasses } from "../../../utils/theme";
import { getBaseError } from "../../../../lib/utilities/errors";
import { formatDateTime } from "../../../../lib/utilities/dateFns";

export interface IClientTokenProps {
  tokenId: string;
}

/**
 * TODO: add created/last updated date and who, same for other pages
 */

function ClientToken(props: IClientTokenProps) {
  const { tokenId } = props;
  const router = useRouter();
  const { error, isLoading, data, mutate } = useClientToken(tokenId);
  const { mutate: cacheMutate } = useSWRConfig();
  // const onRemovePermissionGroup = React.useCallback(
  //   async (permissionGroupId: string) => {
  //     assert(data?.token, new Error("Token not found"));
  //     const updatedPermissionGroups = data?.token.permissionGroups.filter(
  //       (item) => item.permissionGroupId !== permissionGroupId
  //     );

  //     const result = await ClientAssignedTokenAPI.updateToken({
  //       tokenId,
  //       token: { permissionGroups: updatedPermissionGroups },
  //     });

  //     mutate(result, false);
  //   },
  //   [data, tokenId]
  // );

  const onCompeleteDeleteToken = React.useCallback(async () => {
    assert(data?.token, new Error("Token not found"));
    cacheMutate(getUseWorkspaceClientTokenListHookKey(data.token.workspaceId));
    router.push(
      data
        ? appWorkspacePaths.clientTokenList(data.token.workspaceId)
        : appWorkspacePaths.workspaces
    );
  }, [data, cacheMutate, router]);

  if (error) {
    return (
      <PageError
        messageText={
          getBaseError(error) || "Error fetching client assigned token"
        }
      />
    );
  }

  if (isLoading || !data) {
    return <PageLoading messageText="Loading client assigned token..." />;
  }

  const token = data.token;
  const expirationDate = token.expires && formatDateTime(token.expires);

  return (
    <div className={appClasses.main}>
      <Space direction="vertical" size={32} style={{ width: "100%" }}>
        <ComponentHeader copyable title={token.resourceId}>
          <ClientTokenMenu
            token={token}
            onCompleteDelete={onCompeleteDeleteToken}
          />
        </ComponentHeader>
        <LabeledNode
          nodeIsText
          copyable
          direction="vertical"
          label="Resource ID"
          node={token.resourceId}
        />
        {token.providedResourceId && (
          <LabeledNode
            nodeIsText
            copyable
            direction="vertical"
            label="Provided Resource ID"
            node={token.providedResourceId}
          />
        )}
        <LabeledNode
          nodeIsText
          copyable
          direction="vertical"
          label="Token"
          node={token.tokenStr}
        />
        {expirationDate && (
          <LabeledNode
            nodeIsText
            direction="vertical"
            label="Token Expires"
            node={expirationDate}
          />
        )}
        <AssignedPermissionGroupList
          workspaceId={token.workspaceId}
          permissionGroups={token.permissionGroups}
        />
      </Space>
    </div>
  );
}

export default ClientToken;
