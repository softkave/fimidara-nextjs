import { Space } from "antd";
import React from "react";
import PageLoading from "../../../utils/PageLoading";
import PageError from "../../../utils/PageError";
import AssignedPresetList from "../permissionGroups/AssignedPresetList";
import assert from "assert";
import ComponentHeader from "../../../utils/ComponentHeader";
import { useRouter } from "next/router";
import { appOrgPaths } from "../../../../lib/definitions/system";
import useCollaborator from "../../../../lib/hooks/orgs/useCollaborator";
import CollaboratorAPI from "../../../../lib/api/endpoints/collaborators";
import { last } from "lodash";
import { useSWRConfig } from "swr";
import { getUseOrgCollaboratorListHookKey } from "../../../../lib/hooks/orgs/useOrgCollaboratorList";
import CollaboratorMenu from "./CollaboratorMenu";
import { appClasses } from "../../../utils/theme";
import LabeledNode from "../../../utils/LabeledNode";

export interface ICollaboratorProps {
  orgId: string;
  collaboratorId: string;
}

function Collaborator(props: ICollaboratorProps) {
  const { collaboratorId, orgId } = props;
  const router = useRouter();
  const { error, isLoading, data, mutate } = useCollaborator(
    orgId,
    collaboratorId
  );

  const { mutate: cacheMutate } = useSWRConfig();
  const onRemovePermissionGroup = React.useCallback(
    async (presetId: string) => {
      assert(data?.collaborator, new Error("Collaborator not found"));
      const userOrg = last(data.collaborator.organizations);
      assert(userOrg, new Error("Collaborator permission groups not found"));
      const updatedPresets = userOrg.presets.filter(
        (item) => item.presetId !== presetId
      );

      const result = await CollaboratorAPI.updateCollaboratorPresets({
        collaboratorId,
        organizationId: orgId,
        presets: updatedPresets,
      });

      mutate(result, false);
    },
    [data, orgId, collaboratorId]
  );

  const onCompeleteRemoveCollaborator = React.useCallback(async () => {
    cacheMutate(getUseOrgCollaboratorListHookKey(orgId));
    router.push(appOrgPaths.collaboratorList(orgId));
  }, [orgId]);

  if (isLoading || !data) {
    return <PageLoading messageText="Loading collaborator..." />;
  } else if (error) {
    return (
      <PageError
        messageText={error?.message || "Error fetching collaborator"}
      />
    );
  }

  const collaborator = data.collaborator;
  return (
    <div className={appClasses.main}>
      <Space direction="vertical" size={32} style={{ width: "100%" }}>
        <ComponentHeader
          title={collaborator.firstName + " " + collaborator.lastName}
        >
          <CollaboratorMenu
            orgId={orgId}
            collaborator={collaborator}
            onCompleteRemove={onCompeleteRemoveCollaborator}
          />
        </ComponentHeader>
        <LabeledNode
          nodeIsText
          copyable
          direction="vertical"
          label="Resource ID"
          node={collaborator.resourceId}
        />
        <AssignedPresetList
          orgId={orgId}
          presets={last(collaborator.organizations)?.presets || []}
          onRemoveItem={onRemovePermissionGroup}
        />
      </Space>
    </div>
  );
}

export default Collaborator;
