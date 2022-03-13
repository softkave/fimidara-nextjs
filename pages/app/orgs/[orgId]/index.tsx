import { useRouter } from "next/router";
import React from "react";
import Organization from "../../../../components/app/orgs/Organization";
import { getOrgServerSideProps } from "../../../../components/app/orgs/utils";
import withPageAuthRequired from "../../../../components/hoc/withPageAuthRequired";
import { appOrgPaths } from "../../../../lib/definitions/system";

export interface IOrganizationPageProps {
  orgId: string;
}

const OrganizationPage: React.FC<IOrganizationPageProps> = (props) => {
  const { orgId } = props;
  const router = useRouter();

  React.useEffect(() => {
    router.push(appOrgPaths.fileList(orgId));
  }, [orgId]);

  return <Organization orgId={orgId} key="" />;
};

export default withPageAuthRequired(OrganizationPage);
export const getServerSideProps = getOrgServerSideProps;
