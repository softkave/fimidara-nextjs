import { Space } from "antd";
import assert from "assert";
import { useRouter } from "next/router";
import React from "react";
import { useSWRConfig } from "swr";
import { appWorkspacePaths } from "../../../../lib/definitions/system";
import useProgramToken from "../../../../lib/hooks/workspaces/useProgramToken";
import { getUseWorkspaceProgramTokenListHookKey } from "../../../../lib/hooks/workspaces/useWorkspaceProgramTokenList";
import { getBaseError } from "../../../../lib/utils/errors";
import ComponentHeader from "../../../utils/ComponentHeader";
import LabeledNode from "../../../utils/LabeledNode";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import { appClasses } from "../../../utils/theme";
import AssignedPermissionGroupList from "../permissionGroups/AssignedPermissionGroupList";
import ProgramTokenMenu from "./ProgramTokenMenu";

export interface IProgramTokenProps {
  tokenId: string;
}

function ProgramToken(props: IProgramTokenProps) {
  const { tokenId } = props;
  const router = useRouter();
  const { error, isLoading, data, mutate } = useProgramToken(tokenId);
  const { mutate: cacheMutate } = useSWRConfig();
  // const onRemovePermissionGroup = React.useCallback(
  //   async (permissionGroupId: string) => {
  //     assert(data?.token, new Error("Token not found"));
  //     const updatedPermissionGroups = data.token.permissionGroups.filter(
  //       (item) => item.permissionGroupId !== permissionGroupId
  //     );

  //     const result = await ProgramAccessTokenAPI.updateToken({
  //       tokenId,
  //       token: { permissionGroups: updatedPermissionGroups },
  //     });

  //     mutate(result, false);
  //   },
  //   [data, tokenId]
  // );

  const onCompleteDeleteToken = React.useCallback(async () => {
    assert(data?.token, new Error("Token not found"));
    cacheMutate(getUseWorkspaceProgramTokenListHookKey(data.token.workspaceId));
    router.push(appWorkspacePaths.collaboratorList(data.token.workspaceId));
  }, [data, cacheMutate, router]);

  if (error) {
    return (
      <PageError
        messageText={
          getBaseError(error) || "Error fetching program access token"
        }
      />
    );
  } else if (isLoading || !data) {
    return <PageLoading messageText="Loading program access token..." />;
  }

  const token = data.token;
  return (
    <div className={appClasses.main}>
      <Space direction="vertical" size={32} style={{ width: "100%" }}>
        <ComponentHeader title={token.name}>
          <ProgramTokenMenu
            token={token}
            onCompleteDelete={onCompleteDeleteToken}
          />
        </ComponentHeader>
        <LabeledNode
          nodeIsText
          copyable
          direction="vertical"
          label="Resource ID"
          node={token.resourceId}
        />
        {token.description && (
          <LabeledNode
            nodeIsText
            direction="vertical"
            label="Description"
            node={token.description}
          />
        )}
        <LabeledNode
          nodeIsText
          copyable
          direction="vertical"
          label="Token"
          node={token.tokenStr}
        />
        <AssignedPermissionGroupList
          workspaceId={token.workspaceId}
          permissionGroups={token.permissionGroups}
        />
      </Space>
    </div>
  );
}

export default ProgramToken;
