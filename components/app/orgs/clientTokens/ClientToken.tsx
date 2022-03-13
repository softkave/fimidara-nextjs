import { Space } from "antd";
import React from "react";
import { formatRelative } from "date-fns";
import useClientToken from "../../../../lib/hooks/orgs/useClientToken";
import PageLoading from "../../../utils/PageLoading";
import PageError from "../../../utils/PageError";
import LabeledNode from "../../../utils/LabeledNode";
import AssignedPresetList from "../permissionGroups/AssignedPresetList";
import ClientAssignedTokenAPI from "../../../../lib/api/endpoints/clientAssignedToken";
import assert from "assert";
import ComponentHeader from "../../../utils/ComponentHeader";
import ClientTokenMenu from "./ClientTokenMenu";
import { useRouter } from "next/router";
import { appOrgPaths } from "../../../../lib/definitions/system";

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
  const onRemovePermissionGroup = React.useCallback(
    async (presetId: string) => {
      assert(data?.token, new Error("Token nto found"));
      const updatedPresets = data?.token.presets.filter(
        (item) => item.presetId !== presetId
      );

      const result = await ClientAssignedTokenAPI.updateToken({
        tokenId,
        token: { presets: updatedPresets },
      });

      mutate(result);
    },
    [data]
  );

  const onCompeleteDeleteToken = React.useCallback(async () => {
    router.push(
      data
        ? appOrgPaths.clientTokenList(data.token.organizationId)
        : appOrgPaths.orgs
    );
  }, [data]);

  if (isLoading || !data) {
    return <PageLoading messageText="Loading client assigned token..." />;
  } else if (error) {
    return (
      <PageError
        messageText={error?.message || "Error fetching client assigned token"}
      />
    );
  }

  const token = data.token;
  const expirationDate =
    token.expires && formatRelative(new Date(token.expires), new Date());

  return (
    <Space direction="vertical" size={"large"}>
      <ComponentHeader title={token.resourceId}>
        <ClientTokenMenu
          token={token}
          onCompleteDelete={onCompeleteDeleteToken}
        />
      </ComponentHeader>
      <LabeledNode nodeIsText label="Resource ID" node={token.resourceId} />
      {token.providedResourceId && (
        <LabeledNode
          nodeIsText
          label="Provided Resource ID"
          node={token.providedResourceId}
        />
      )}
      {expirationDate && (
        <LabeledNode nodeIsText label="Token Expires" node={expirationDate} />
      )}
      <AssignedPresetList
        orgId={token.organizationId}
        presets={token.presets}
        onRemoveItem={onRemovePermissionGroup}
      />
    </Space>
  );
}

export default ClientToken;
