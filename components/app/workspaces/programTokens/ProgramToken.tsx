import { Space } from "antd";
import React from "react";
import PageLoading from "../../../utils/PageLoading";
import PageError from "../../../utils/PageError";
import assert from "assert";
import ComponentHeader from "../../../utils/ComponentHeader";
import { useRouter } from "next/router";
import { appWorkspacePaths } from "../../../../lib/definitions/system";
import { useSWRConfig } from "swr";
import useProgramToken from "../../../../lib/hooks/workspaces/useProgramToken";
import { getUseWorkspaceProgramTokenListHookKey } from "../../../../lib/hooks/workspaces/useWorkspaceProgramTokenList";
import LabeledNode from "../../../utils/LabeledNode";
import ProgramTokenMenu from "./ProgramTokenMenu";
import AssignedPermissionGroupList from "../permissionGroups/AssignedPermissionGroupList";
import { appClasses } from "../../../utils/theme";
import { getBaseError } from "../../../../lib/utilities/errors";

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
