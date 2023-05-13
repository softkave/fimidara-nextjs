import DocsMain from "@/components/docs/DocsMain";
import HttpEndpointDoc from "@/components/docs/HttpEndpointDoc";
import { HttpEndpointDefinition } from "@/components/docs/types";
import PageNothingFound from "@/components/utils/page/PageNothingFound";
import { systemConstants } from "@/lib/definitions/system";
import { promises } from "fs";
import { GetServerSideProps, NextPage } from "next";

interface FimidaraRestApiEndpointDocPageProps {
  endpoint?: HttpEndpointDefinition;
  endpointPath?: string;
}

type PagePathParams = {
  endpointPath: string;
};

const FimidaraRestApiEndpointDocPage: NextPage<
  FimidaraRestApiEndpointDocPageProps
> = (props) => {
  const { endpoint, endpointPath } = props;

  if (!endpoint) {
    return (
      <DocsMain pageTitle="Fimidara REST endpoint not found">
        <PageNothingFound
          message={
            <p>
              Endpoint <code>{endpointPath}</code> not found!
            </p>
          }
        />
      </DocsMain>
    );
  }

  return (
    <DocsMain
      pageTitle={endpoint.name ?? "Fimidara REST endpoint"}
      pageDescription={endpoint.description}
    >
      <HttpEndpointDoc endpoint={endpoint} />
    </DocsMain>
  );
};

export default FimidaraRestApiEndpointDocPage;

export const getServerSideProps: GetServerSideProps<
  FimidaraRestApiEndpointDocPageProps,
  PagePathParams
> = async (context) => {
  const endpointPath = context.params?.endpointPath;

  if (endpointPath) {
    const [groupName, endpointName] = endpointPath.split("__");
    const endpointInfoPath =
      process.cwd() +
      systemConstants.endpointInfoPath +
      "/" +
      groupName +
      "/" +
      endpointName +
      ".json";

    if ((await promises.stat(endpointInfoPath)).isFile()) {
      const endpointInfoRaw = await promises.readFile(endpointInfoPath);
      const endpointInfoJson = JSON.parse(endpointInfoRaw.toString("utf-8"));
      return {
        props: {
          endpointPath,
          endpoint: endpointInfoJson as HttpEndpointDefinition,
        },
      };
    }
  }

  return { props: { endpointPath } };
};
