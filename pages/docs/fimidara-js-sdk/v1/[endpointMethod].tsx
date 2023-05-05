import DocsMain from "@/components/docs/DocsMain";
import JsSdkEndpointDoc from "@/components/docs/JsSdkEndpointDoc";
import { HttpEndpointDefinition } from "@/components/docs/types";
import PageNothingFound from "@/components/utils/PageNothingFound";
import { systemConstants } from "@/lib/definitions/system";
import { promises } from "fs";
import { GetServerSideProps, NextPage } from "next";

interface FimidaraJsSdkEndpointDocPageProps {
  endpoint?: HttpEndpointDefinition;
  endpointMethod?: string;
}

type PagePathParams = {
  endpointMethod: string;
};

const FimidaraJsSdkEndpointDocPage: NextPage<
  FimidaraJsSdkEndpointDocPageProps
> = (props) => {
  const { endpoint, endpointMethod } = props;

  if (!endpoint) {
    return (
      <DocsMain pageTitle="Fimidara JS SDK method not found">
        <PageNothingFound
          message={
            <p>
              Method <code>{endpointMethod}</code> not found!
            </p>
          }
        />
      </DocsMain>
    );
  }

  return (
    <DocsMain
      pageTitle={endpoint.name ?? "Fimidara JS SDK endpoint method"}
      pageDescription={endpoint.description}
    >
      <JsSdkEndpointDoc endpoint={endpoint} />
    </DocsMain>
  );
};

export default FimidaraJsSdkEndpointDocPage;

export const getServerSideProps: GetServerSideProps<
  FimidaraJsSdkEndpointDocPageProps,
  PagePathParams
> = async (context) => {
  const endpointMethod = context.params?.endpointMethod;

  if (endpointMethod) {
    const [groupName, endpointName] = endpointMethod.split("__");
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
          endpointMethod,
          endpoint: endpointInfoJson as HttpEndpointDefinition,
        },
      };
    }
  }

  return { props: { endpointMethod } };
};
