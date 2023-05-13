import { systemConstants } from "@/lib/definitions/system";
import { getReadFileURL, getUploadFileURL } from "fimidara";
import React from "react";
import { KeyValueDynamicKeys, useKvStore } from "../../../lib/hooks/storeHooks";
import ImageAndUploadAvatar from "../../utils/ImageAndUploadAvatar";
import { StyleableComponentProps } from "../../utils/styling/types";
import { appDimensions } from "../../utils/theme";

export interface IUploadWorkspaceAvatarProps extends StyleableComponentProps {
  workspaceId: string;
}

export default function UploadWorkspaceAvatar(
  props: IUploadWorkspaceAvatarProps
) {
  const { workspaceId, className, style } = props;
  const refreshKey =
    KeyValueDynamicKeys.getWorkspaceImageLastUpdateTime(workspaceId);

  const onCompleteUpload = React.useCallback(() => {
    useKvStore.getState().set(refreshKey, Date.now());
  }, []);

  const uploadPath = getUploadFileURL({
    filepath: systemConstants.workspaceImagesFolder + "/" + workspaceId,
    serverURL: systemConstants.serverAddr,
  });

  return (
    <div className={className} style={style}>
      <ImageAndUploadAvatar
        refreshKey={refreshKey}
        uploadPath={uploadPath}
        onCompleteUpload={onCompleteUpload}
        src={getReadFileURL({
          serverURL: systemConstants.serverAddr,
          filepath: systemConstants.workspaceImagesFolder + "/" + workspaceId,
          width: appDimensions.avatar.width,
          height: appDimensions.avatar.height,
        })}
        alt="Workspace profile picture"
      />
    </div>
  );
}
