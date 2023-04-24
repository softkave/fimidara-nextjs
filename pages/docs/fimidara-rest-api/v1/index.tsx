import { NextPage } from "next";
import DocsMain from "../../../../components/docs/DocsMain";
import RestApiIndex from "../../../../components/docs/RestApiIndex";

interface FimidaraRestApiIndexDocPageProps {}

const FimidaraRestApiEndpointDocPage: NextPage<
  FimidaraRestApiIndexDocPageProps
> = (props) => {
  return (
    <DocsMain pageTitle="Fimidara REST API">
      <RestApiIndex />
    </DocsMain>
  );
};

export default FimidaraRestApiEndpointDocPage;
