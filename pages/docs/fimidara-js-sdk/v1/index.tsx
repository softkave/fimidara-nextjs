import { NextPage } from "next";
import DocsMain from "../../../../components/docs/DocsMain";
import JsSdkIndex from "../../../../components/docs/JsSdkIndex";

interface FimidaraJsSdkIndexDocPageProps {}

const FimidaraJsSdkIndexDocPage: NextPage<FimidaraJsSdkIndexDocPageProps> = (
  props
) => {
  return (
    <DocsMain pageTitle="Fimidara JS SDK">
      <JsSdkIndex />
    </DocsMain>
  );
};

export default FimidaraJsSdkIndexDocPage;
