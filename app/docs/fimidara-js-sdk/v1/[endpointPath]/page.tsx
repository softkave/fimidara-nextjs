"use server";

import JsSdkEndpointDoc from "@/components/docs/JsSdkEndpointDoc";
import { kDocNavRootKeysList } from "@/components/docs/navItems.tsx";
import { HttpEndpointDefinition } from "@/components/docs/types";
import PageNothingFound from "@/components/utils/page/PageNothingFound";
import { systemConstants } from "@/lib/definitions/system";
import { promises } from "fs";
import { last } from "lodash-es";

interface FimidaraJsSdkEndpointDocPageProps {
  params: Promise<{ endpointPath: string }>;
}

const FimidaraJsSdkEndpointDocPage = async (
  props: FimidaraJsSdkEndpointDocPageProps
) => {
  const { endpointPath } = await props.params;
  const endpoint = await useEndpointInfo(endpointPath);

  if (!endpoint) {
    return (
      <PageNothingFound
        message={
          <p>
            Method <code>{endpointPath}</code> not found.
          </p>
        }
      />
    );
  }

  return <JsSdkEndpointDoc endpoint={endpoint} />;
};

export default FimidaraJsSdkEndpointDocPage;

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
      const dataRaw = await promises.readFile(p1);
      const dataJson = JSON.parse(dataRaw.toString("utf-8"));
      return dataJson as HttpEndpointDefinition;
    }
  }
};
