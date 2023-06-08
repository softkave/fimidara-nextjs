const fse = require("fs-extra");
import { promises as fspromises } from "fs";

/** Copies generated REST API table of content, public endpoints info, and other
 * generated stuff. */
async function copyGeneratedStuffFromServer() {
  const serverRootpath = "../fimidara-server-node";
  const serverRestApiEndpointsPath = `${serverRootpath}/mdoc/rest-api/endpoints`;
  const serverRestApiTableOfContentPath = `${serverRootpath}/mdoc/rest-api/toc`;
  const serverSdkRootpath = `${serverRootpath}/sdk/js-sdk/v1/src`;
  const serverSdkUtilsFilepath = `${serverSdkRootpath}/utils.ts`;
  const serverSdkUtilsPrivateEndpointsPath = `${serverSdkRootpath}/privateEndpoints.ts`;
  const serverSdkUtilsPrivateTypesPath = `${serverSdkRootpath}/privateTypes.ts`;

  const frontendRestApiEndpointsPath = `./components/docs/raw/endpoints`;
  const frontendRestApiTableOfContentPath = `./components/docs/raw/toc`;
  const frontendSdkUtilsFilepath = `./lib/api/utils.ts`;
  const frontendSdkUtilsPrivateEndpointsPath = `./lib/api/privateEndpoints.ts`;
  const frontendSdkUtilsPrivateTypesPath = `./lib/api/privateTypes.ts`;

  await Promise.all([
    fse.remove(frontendRestApiEndpointsPath),
    fse.remove(frontendRestApiTableOfContentPath),
  ]);
  await Promise.all([
    fse.copy(serverRestApiEndpointsPath, frontendRestApiEndpointsPath),
    fse.copy(
      serverRestApiTableOfContentPath,
      frontendRestApiTableOfContentPath
    ),
    fse.copy(serverSdkUtilsFilepath, frontendSdkUtilsFilepath),
    fse.copy(
      serverSdkUtilsPrivateEndpointsPath,
      frontendSdkUtilsPrivateEndpointsPath
    ),
    fse.copy(serverSdkUtilsPrivateTypesPath, frontendSdkUtilsPrivateTypesPath),
  ]);

  const sdkUtilsRawContent = await fspromises.readFile(
    frontendSdkUtilsFilepath,
    "utf-8"
  );
  const sdkUtilsContentWithWarning =
    "// This file is copied over from server-generated js sdk.\n" +
    "// Do not modify directly. For util code, use localUtils.ts file instead.\n\n" +
    sdkUtilsRawContent;
  await fspromises.writeFile(
    frontendSdkUtilsFilepath,
    sdkUtilsContentWithWarning,
    { encoding: "utf-8" }
  );
}

//  C:\Users\yword\Desktop\projects\fimidara\fimidara-server-node\mdoc\rest-api

copyGeneratedStuffFromServer().catch(console.error.bind(console));
