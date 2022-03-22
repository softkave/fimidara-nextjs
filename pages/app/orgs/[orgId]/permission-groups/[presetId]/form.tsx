import { GetServerSideProps } from "next";
import React from "react";
import Organization from "../../../../../../components/app/orgs/Organization";
import PresetForm from "../../../../../../components/app/orgs/permissionGroups/PresetForm";
import withPageAuthRequired from "../../../../../../components/hoc/withPageAuthRequired";
import PageError from "../../../../../../components/utils/PageError";
import PageLoading from "../../../../../../components/utils/PageLoading";
import { appOrgPaths } from "../../../../../../lib/definitions/system";
import usePermissionGroup from "../../../../../../lib/hooks/orgs/usePermissionGroup";
import { getBaseError } from "../../../../../../lib/utilities/errors";

export type IOrganizationPresetFormPageProps = {
  orgId: string;
  presetId: string;
};

const OrganizationPresetFormPage: React.FC<IOrganizationPresetFormPageProps> = (
  props
) => {
  const { orgId, presetId } = props;
  const { error, isLoading, data } = usePermissionGroup(presetId);
  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        messageText={getBaseError(error) || "Error fetching permission group"}
      />
    );
  } else if (isLoading || !data) {
    content = <PageLoading messageText="Loading permission group..." />;
  } else {
    content = (
      <PresetForm orgId={data.preset.organizationId} preset={data.preset} />
    );
  }

  return (
    <Organization
      orgId={orgId}
      activeKey={appOrgPaths.permissionGroupList(orgId)}
    >
      {content}
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
