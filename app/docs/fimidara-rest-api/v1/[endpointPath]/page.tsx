"use server";

import HttpEndpointDoc from "@/components/docs/HttpEndpointDoc";
import { kDocNavRootKeysList } from "@/components/docs/navItems.tsx";
import { HttpEndpointDefinition } from "@/components/docs/types";
import PageNothingFound from "@/components/utils/page/PageNothingFound";
import { systemConstants } from "@/lib/definitions/system";
import { Typography } from "antd";
import { promises } from "fs";
import { last } from "lodash-es";

const { Text } = Typography;

interface FimidaraRestApiEndpointDocPageProps {
  params: { endpointPath: string };
}

const FimidaraRestApiEndpointDocPage = async (
  props: FimidaraRestApiEndpointDocPageProps
) => {
  const { endpointPath } = props.params;
  const endpoint = await useEndpointInfo(endpointPath);

  if (!endpoint) {
    return (
      <PageNothingFound
        message={
          <p>
            Endpoint <Text code>{endpointPath}</Text> not found.
          </p>
        }
      />
    );
  }

  return <HttpEndpointDoc endpoint={endpoint} />;
};

export default FimidaraRestApiEndpointDocPage;

const useEndpointInfo = async (endpointPath: string) => {
  if (endpointPath) {
    const s1 = endpointPath
      .split("__")
      .filter((p) => !(kDocNavRootKeysList as string[]).includes(p));
    const s2 = s1.slice(0, -1); // path minus method
    const p1 =
      process.cwd() +
      systemConstants.endpointInfoPath +
      `/${s2.join("/")}__${last(s1)}.json`;

    if ((await promises.stat(p1)).isFile()) {
      const endpointInfoRaw = await promises.readFile(p1);
      const endpointInfoJson = JSON.parse(endpointInfoRaw.toString("utf-8"));
      return endpointInfoJson as HttpEndpointDefinition;
    }
  }
};
