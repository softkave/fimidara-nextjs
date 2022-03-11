import { Divider, Space } from "antd";
import { NextPage } from "next";
import OrganizationForm from "../../../../components/app/orgs/OrganizationForm";
import OrgHeader from "../../../../components/app/orgs/OrgHeader";
import UploadOrgAvatar from "../../../../components/app/orgs/UploadOrgAvatar";
import { getOrgServerSideProps } from "../../../../components/app/orgs/utils";
import withPageAuthRequired from "../../../../components/hoc/withPageAuthRequired";
import PageError from "../../../../components/utils/PageError";
import PageLoading from "../../../../components/utils/PageLoading";
import { appClasses } from "../../../../components/utils/theme";
import useOrg from "../../../../lib/hooks/orgs/useOrg";

interface IEditOrganizationPageProps {
  orgId: string;
}

const EditOrganizationPage: NextPage<IEditOrganizationPageProps> = (props) => {
  const { orgId } = props;
  const { isLoading, error, data } = useOrg(orgId);

  if (isLoading || !data) {
    return <PageLoading messageText="Loading organization..." />;
  } else if (error) {
    return (
      <PageError
        className={appClasses.main}
        messageText={error?.message || "Error fetching organization"}
      />
    );
  }

  return (
    <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
      <OrgHeader org={data.organization} />
      <UploadOrgAvatar orgId={data.organization.resourceId} />
      <Divider orientation="left">Organization Details</Divider>
      <OrganizationForm org={data.organization} />
    </Space>
  );
};

export default withPageAuthRequired(EditOrganizationPage);
export const getServerSideProps = getOrgServerSideProps;
