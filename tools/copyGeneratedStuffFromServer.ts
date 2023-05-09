/** Copies generated REST API table of content, public endpoints info, and other
 * generated stuff. */

const fse = require("fs-extra");

async function copyGeneratedStuffFromServer() {
  const serverRootpath = "../fimidara-server-node";
  const serverRestApiEndpointsPath = `${serverRootpath}/mdoc/rest-api/endpoints`;
  const serverRestApiTableOfContentPath = `${serverRootpath}/mdoc/rest-api/toc`;
  const serverSdkRootpath = `${serverRootpath}/sdk/js-sdk/v1/src`;
  const serverSdkUtilsFilepath = `${serverSdkRootpath}/utils.ts`;
  const serverSdkUtilsPrivateEndpointsPath = `${serverSdkRootpath}/private-endpoints.ts`;
  const serverSdkUtilsPrivateTypesPath = `${serverSdkRootpath}/private-types.ts`;

  const frontendRestApiEndpointsPath = `./components/docs/raw/endpoints`;
  const frontendRestApiTableOfContentPath = `./components/docs/raw/toc`;
  const frontendSdkUtilsFilepath = `./lib/api/utils.ts`;
  const frontendSdkUtilsPrivateEndpointsPath = `./lib/api/private-endpoints.ts`;
  const frontendSdkUtilsPrivateTypesPath = `./lib/api/private-types.ts`;

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
}

//  C:\Users\yword\Desktop\projects\fimidara\fimidara-server-node\mdoc\rest-api

copyGeneratedStuffFromServer().catch(console.error.bind(console));
