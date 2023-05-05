import DocsMain from "@/components/docs/DocsMain";
import RestApiIndex from "@/components/docs/RestApiIndex";
import { NextPage } from "next";

interface FimidaraRestApiIndexDocPageProps {}

const FimidaraRestApiIndexDocPage: NextPage<
  FimidaraRestApiIndexDocPageProps
> = (props) => {
  return (
    <DocsMain pageTitle="Fimidara REST API">
      <RestApiIndex />
    </DocsMain>
  );
};

export default FimidaraRestApiIndexDocPage;
