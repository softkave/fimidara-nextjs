import { Space, Typography } from "antd";
import React from "react";
import PageLoading from "../../../utils/PageLoading";
import PageError from "../../../utils/PageError";
import assert from "assert";
import ComponentHeader from "../../../utils/ComponentHeader";
import { useRouter } from "next/router";
import { appOrgPaths } from "../../../../lib/definitions/system";
import { useSWRConfig } from "swr";
import useProgramToken from "../../../../lib/hooks/orgs/useProgramToken";
import ProgramAccessTokenAPI from "../../../../lib/api/endpoints/programAccessToken";
import { getUseOrgProgramTokenListHookKey } from "../../../../lib/hooks/orgs/useOrgProgramTokenList";
import LabeledNode from "../../../utils/LabeledNode";
import ProgramTokenMenu from "./ProgramTokenMenu";
import AssignedPresetList from "../permissionGroups/AssignedPresetList";

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

  const onCompleteDeleteToken = React.useCallback(async () => {
    assert(data?.token, new Error("Token not found"));
    cacheMutate(getUseOrgProgramTokenListHookKey(data.token.organizationId));
    router.push(appOrgPaths.collaboratorList(data.token.organizationId));
  }, [data]);

  if (isLoading || !data) {
    return <PageLoading messageText="Loading program access token..." />;
  } else if (error) {
    return (
      <PageError
        messageText={error?.message || "Error fetching program access token"}
      />
    );
  }

  const token = data.token;
  return (
    <Space direction="vertical" size={"large"}>
      <ComponentHeader title={token.name}>
        <ProgramTokenMenu
          token={token}
          onCompleteDelete={onCompleteDeleteToken}
        />
      </ComponentHeader>
      <Typography.Paragraph>{token.description}</Typography.Paragraph>
      <LabeledNode nodeIsText label="Token" node={token.tokenStr} />
      <AssignedPresetList
        orgId={token.organizationId}
        presets={token.presets}
        onRemoveItem={onRemovePermissionGroup}
      />
    </Space>
  );
}

export default ProgramToken;
