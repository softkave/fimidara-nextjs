import { GetServerSideProps } from "next";
import React from "react";
import Organization from "../../../../../../components/app/orgs/Organization";
import PresetForm from "../../../../../../components/app/orgs/permissionGroups/PresetForm";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import PageError from "../../../../../../components/utils/PageError";
import PageLoading from "../../../../../../components/utils/PageLoading";
import { appOrgPaths } from "../../../../../../lib/definitions/system";
import usePermissionGroup from "../../../../../../lib/hooks/orgs/usePermissionGroup";

export type IOrganizationPresetFormPageProps = {
  orgId: string;
  presetId: string;
};

const OrganizationPresetFormPage: React.FC<IOrganizationPresetFormPageProps> = (
  props
) => {
  const { orgId, presetId } = props;
  const { error, isLoading, data } = usePermissionGroup(presetId);

  if (isLoading || !data) {
    return <PageLoading messageText="Loading permission group..." />;
  } else if (error) {
    return (
      <PageError
        messageText={error?.message || "Error fetching permission group"}
      />
    );
  }

  return (
    <Organization
      orgId={orgId}
      activeKey={appOrgPaths.permissionGroupList(orgId)}
    >
      <PresetForm orgId={data.preset.organizationId} preset={data.preset} />
    </Organization>
  );
};

export default withPageAuthRequired(OrganizationPresetFormPage);

export const getServerSideProps: GetServerSideProps<
  IOrganizationPresetFormPageProps,
  IOrganizationPresetFormPageProps
> = async (context) => {
  return {
    props: {
      orgId: context.params!.orgId,
      presetId: context.params!.presetId,
    },
  };
};
