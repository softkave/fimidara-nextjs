import Organization from "../../../../components/app/orgs/Organization";
import { getOrgServerSideProps } from "../../../../components/app/orgs/utils";
import withPageAuthRequired from "../../../../components/hoc/withPageAuthRequired";

export default withPageAuthRequired(Organization);
export const getServerSideProps = getOrgServerSideProps;
