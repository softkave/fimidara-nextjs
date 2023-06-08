import DocsMain from "@/components/docs/DocsMain";
import JsSdkEndpointDoc from "@/components/docs/JsSdkEndpointDoc";
import { HttpEndpointDefinition } from "@/components/docs/types";
import PageNothingFound from "@/components/utils/page/PageNothingFound";
import { systemConstants } from "@/lib/definitions/system";
import { Typography } from "antd";
import { promises } from "fs";
import { last } from "lodash";
import { GetServerSideProps, NextPage } from "next";

interface FimidaraJsSdkEndpointDocPageProps {
  endpoint?: HttpEndpointDefinition;
  endpointPath?: string;
}

type PagePathParams = {
  endpointPath: string;
};

const FimidaraJsSdkEndpointDocPage: NextPage<
  FimidaraJsSdkEndpointDocPageProps
> = (props) => {
  const { endpoint, endpointPath } = props;

  if (!endpoint) {
    return (
      <DocsMain pageTitle="Fimidara JS SDK method not found">
        <PageNothingFound
          message={
            <p>
              Method <Typography.Text code>{endpointPath}</Typography.Text> not
              found!
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
  const endpointPath = context.params?.endpointPath;

  if (endpointPath) {
    const s1 = endpointPath.split("__");
    const s2 = s1.slice(0, -1); // path minus method
    const p1 =
      process.cwd() +
      systemConstants.endpointInfoPath +
      `/${s2.join("/")}__${last(s1)}.json`;

    if ((await promises.stat(p1)).isFile()) {
      const dataRaw = await promises.readFile(p1);
      const dataJson = JSON.parse(dataRaw.toString("utf-8"));
      return {
        props: {
          endpointPath,
          endpoint: dataJson as HttpEndpointDefinition,
        },
      };
    }
  }

  return { props: { endpointPath } };
};
