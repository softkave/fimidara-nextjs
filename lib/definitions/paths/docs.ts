export const appDocPaths = {
  docs: "/docs",
  fimidara: "/docs/fimidara",
  fimidaraRestApi: "/docs/fimidara-rest-api/v1",
  fimidaraJsSdk: "/docs/fimidara-js-sdk/v1",

  fimidaraDoc(p: string) {
    return `${appDocPaths.fimidara}/${p}`;
  },
  fimidaraRestApiDoc(p: string) {
    return `${appDocPaths.fimidaraRestApi}/${p}`;
  },
  fimidaraJsSdkDoc(p: string) {
    return `${appDocPaths.fimidaraJsSdk}/${p}`;
  },
};
