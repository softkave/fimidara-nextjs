"use client";

import { appComponentConstants } from "@/components/utils/utils.ts";
import { useToast } from "@/hooks/use-toast.ts";
import { useRequest } from "ahooks";
import { getFimidaraReadFileURL } from "fimidara";
import { getPublicFimidaraEndpointsUsingUserToken } from "../api/fimidaraEndpoints";
import { systemConstants } from "../definitions/system";
import { flattenErrorList, toAppErrorList } from "../utils/errors";

function downloadFile(filename: string, url: string) {
  const downloadAnchor = document.createElement("a");
  document.appendChild(downloadAnchor);
  downloadAnchor.download = filename;
  downloadAnchor.href = url;
  downloadAnchor.target = "_blank";
  downloadAnchor.click();
  document.removeChild(downloadAnchor);
}

export function useDownloadFile(fileId: string, filename: string) {
  const toastHook = useToast();

  const downloadFn = async () => {
    toastHook.toast({
      description: `Prepping file ${filename}...`,
    });

    const fimidara = getPublicFimidaraEndpointsUsingUserToken();
    const result = await fimidara.presignedPaths.issuePresignedPath({
      fileId,
      usageCount: 1,
    });
    const presignedPath = result.path;
    const url = getFimidaraReadFileURL({
      serverURL: systemConstants.serverAddr,
      filepath: presignedPath,
      download: true,
    });
    downloadFile(filename, url);
  };

  const downloadHook = useRequest(downloadFn, {
    manual: true,
    onSuccess() {
      toastHook.dismiss();
      toastHook.toast({
        description: `Downloading file ${filename}...`,
        duration: appComponentConstants.messageDuration,
      });
    },
    onError(error) {
      const errorArr = toAppErrorList(error);
      const fErrors = flattenErrorList(errorArr);

      toastHook.dismiss();
      toastHook.toast({
        description: `Error downloading file ${filename}. ${fErrors.error}`,
        variant: "destructive",
      });
    },
  });

  return { downloadHook };
}
