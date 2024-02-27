import { useRequest } from "ahooks";
import { message } from "antd";
import { getFimidaraReadFileURL } from "fimidara";
import React from "react";
import { getPublicFimidaraEndpointsUsingUserToken } from "../api/fimidaraEndpoints";
import { systemConstants } from "../definitions/system";
import { flattenErrorList, toAppErrorList } from "../utils/errors";

function downloadFile(filename: string, url: string) {
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.download = filename;
  a.href = url;
  a.click();
}

export function useDownloadFile(fileId: string, filename: string) {
  const [messageApi, contextHolder] = message.useMessage();
  const [messageKey] = React.useState(() => Math.random().toString());

  const downloadFn = async () => {
    messageApi.open({
      key: messageKey,
      type: "loading",
      content: `Prepping file ${filename}...`,
    });

    const fimidara = getPublicFimidaraEndpointsUsingUserToken();
    const result = await fimidara.presignedPaths.issuePresignedPath({
      body: { fileId, usageCount: 1 },
    });
    const presignedPath = result.body.path;
    const url = getFimidaraReadFileURL({
      serverURL: systemConstants.serverAddr,
      filepath: presignedPath,
    });
    downloadFile(filename, url);
  };

  const downloadHook = useRequest(downloadFn, {
    manual: true,
    onSuccess() {
      messageApi.open({
        key: messageKey,
        type: "success",
        content: `Downloading file ${filename}...`,
        duration: 5, // 5 seconds
      });
    },
    onError(error) {
      const errorArr = toAppErrorList(error);
      const fErrors = flattenErrorList(errorArr);
      messageApi.open({
        key: messageKey,
        type: "error",
        content: `Error downloading file ${filename}. ${fErrors.error}`,
        duration: 7, // 7 seconds
      });
    },
  });

  return { downloadHook, messageContextHolder: contextHolder };
}
