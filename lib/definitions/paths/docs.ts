export const kAppDocPaths = {
  docs: "/docs",
  fimidara: "/docs/fimidara",
  fimidaraRestApi: "/docs/fimidara-rest-api/v1",
  fimidaraJsSdk: "/docs/fimidara-js-sdk/v1",
  fimidaraDoc(p: string) {
    return `${kAppDocPaths.fimidara}/${p}`;
  },
  fimidaraRestApiDoc(p: string) {
    return `${kAppDocPaths.fimidaraRestApi}/${p}`;
  },
  fimidaraJsSdkDoc(p: string) {
    return `${kAppDocPaths.fimidaraJsSdk}/${p}`;
  },
};
