import DocsMain from "@/components/docs/DocsMain";
import HttpEndpointDoc from "@/components/docs/HttpEndpointDoc";
import { HttpEndpointDefinition } from "@/components/docs/types";
import PageNothingFound from "@/components/utils/page/PageNothingFound";
import { systemConstants } from "@/lib/definitions/system";
import { Typography } from "antd";
import { promises } from "fs";
import { last } from "lodash";
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
              Endpoint <Typography.Text code>{endpointPath}</Typography.Text>{" "}
              not found!
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
    const s1 = endpointPath.split("__");
    const s2 = s1.slice(0, -1); // path minus method
    const p1 =
      process.cwd() +
      systemConstants.endpointInfoPath +
      `/${s2.join("/")}__${last(s1)}.json`;

    if ((await promises.stat(p1)).isFile()) {
      const endpointInfoRaw = await promises.readFile(p1);
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
