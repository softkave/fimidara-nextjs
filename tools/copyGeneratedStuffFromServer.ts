import fse from "fs-extra";
import path from "path";

interface ToCopy {
  from: string;
  to: string;
  copy: string[];
}

const copyList: ToCopy[] = [
  {
    from: "../fimidara-server-node/mdoc/rest-api/endpoints",
    to: "./api-raw/endpoints",
    copy: ["."],
  },
  {
    from: "../fimidara-server-node/mdoc/rest-api/toc",
    to: "./api-raw/toc",
    copy: ["."],
  },
  {
    from: "../fimidara-server-node/sdk/js-sdk/src",
    to: "./lib/api-internal",
    copy: [
      "/endpoints/endpointImports.ts",
      "/endpoints/privateEndpoints.ts",
      "/endpoints/privateTypes.ts",
      "/FimidaraEndpointsBase.ts",
      "/invokeEndpoint.ts",
      "/types.ts",
      "/config.ts",
      "/constants.ts",
      "/error.ts",
    ],
  },
];

async function copyGeneratedStuffFromServer() {
  await Promise.all(
    copyList.map(async (c) => {
      await Promise.all(
        c.copy.map((f) => fse.copy(path.join(c.from, f), path.join(c.to, f)))
      );
    })
  );
}

copyGeneratedStuffFromServer().catch(console.error.bind(console));
