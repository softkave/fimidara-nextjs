import { systemConstants } from "@/lib/definitions/system";
import React from "react";
import { KeyValueDynamicKeys, useKvStore } from "../../../lib/hooks/storeHooks";
import ImageAndUploadAvatar from "../../utils/ImageAndUploadAvatar";
import { StyleableComponentProps } from "../../utils/styling/types";

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

  return (
    <div className={className} style={style}>
      <ImageAndUploadAvatar
        refreshKey={refreshKey}
        onCompleteUpload={onCompleteUpload}
        filepath={systemConstants.workspaceImagesFolder + "/" + workspaceId}
        alt="Workspace profile picture"
      />
    </div>
  );
}
