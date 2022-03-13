import { Space, Typography } from "antd";
import React from "react";
import PageLoading from "../../../utils/PageLoading";
import PageError from "../../../utils/PageError";
import AssignedPresetList from "./AssignedPresetList";
import assert from "assert";
import ComponentHeader from "../../../utils/ComponentHeader";
import { useRouter } from "next/router";
import { appOrgPaths } from "../../../../lib/definitions/system";
import { useSWRConfig } from "swr";
import usePermissionGroup from "../../../../lib/hooks/orgs/usePermissionGroup";
import PresetPermissionsGroupAPI from "../../../../lib/api/endpoints/presetPermissionsGroup";
import { getUseOrgPermissionGroupListHookKey } from "../../../../lib/hooks/orgs/useOrgPermissionGroupList";
import PermissionGroupMenu from "./PermissionGroupMenu";
import useProgramToken from "../../../../lib/hooks/orgs/useProgramToken";
import ProgramAccessTokenAPI from "../../../../lib/api/endpoints/programAccessToken";
import { getUseOrgProgramTokenListHookKey } from "../../../../lib/hooks/orgs/useOrgProgramTokenList";

export interface IProgramTokenProps {
  tokenId: string;
}

function ProgramToken(props: IProgramTokenProps) {
  const { tokenId } = props;
  const router = useRouter();
  const { error, isLoading, data, mutate } = useProgramToken(tokenId);
  const { mutate: cacheMutate } = useSWRConfig();
  const onRemovePermissionGroup = React.useCallback(
    async (presetId: string) => {
      assert(data?.token, new Error("Token not found"));
      const updatedPresets = data.token.presets.filter(
        (item) => item.presetId !== presetId
      );

      const result = await ProgramAccessTokenAPI.updateToken({
        tokenId,
        token: { presets: updatedPresets },
      });

      mutate(result, false);
    },
    [data, tokenId]
  );

  const onCompleteDeletePreset = React.useCallback(async () => {
    assert(data?.token, new Error("Token not found"));
    cacheMutate(getUseOrgProgramTokenListHookKey(data.token.organizationId));
    router.push(appOrgPaths.collaboratorList(data.token.organizationId));
  }, [data]);

  if (isLoading || !data) {
    return <PageLoading messageText="Loading program access tokens..." />;
  } else if (error) {
    return (
      <PageError
        messageText={error?.message || "Error fetching program access tokens"}
      />
    );
  }

  const token = data.token;
  return (
    <Space direction="vertical" size={"large"}>
      <ComponentHeader title={token.name}>
        <PermissionGroupMenu
          preset={token}
          onCompleteDelete={onCompleteDeletePreset}
        />
      </ComponentHeader>
      <Typography.Paragraph>{token.description}</Typography.Paragraph>
      <AssignedPresetList
        orgId={token.organizationId}
        presets={token.presets}
        onRemoveItem={onRemovePermissionGroup}
      />
    </Space>
  );
}

export default ProgramToken;
