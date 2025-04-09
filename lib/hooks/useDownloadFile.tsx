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
  document.body.appendChild(downloadAnchor);
  downloadAnchor.download = filename;
  downloadAnchor.href = url;
  downloadAnchor.target = "_blank";
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);
}

export function useDownloadFile(fileId: string, filename: string) {
  const toastHook = useToast();

  const downloadFn = async () => {
    toastHook.toast({
      title: "Prepping file...",
      description: `Prepping file ${filename}. This may take a few seconds.`,
    });

    const fimidara = await getPublicFimidaraEndpointsUsingUserToken();
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
        title: "Downloading file...",
        description: (
          <>
            <p>Downloading file {filename}... </p>
            {filename.startsWith(".") && (
              <p className="font-bold text-muted-foreground">
                Ensure to rename the file when downloaded because many browsers
                strip the leading dot(.) from the filename for security reasons.
              </p>
            )}
          </>
        ),
        duration: appComponentConstants.messageDuration,
      });
    },
    onError(error) {
      const errorArr = toAppErrorList(error);
      const fErrors = flattenErrorList(errorArr);

      toastHook.dismiss();
      toastHook.toast({
        title: "Error downloading file",
        description: `Error downloading file ${filename}. ${fErrors.error}`,
        variant: "destructive",
      });
    },
  });

  return { downloadHook };
}
