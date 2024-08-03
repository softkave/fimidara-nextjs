import ImageAndUploadAvatar from "@/components/utils/ImageAndUploadAvatar";
import { StyleableComponentProps } from "@/components/utils/styling/types";
import { systemConstants } from "@/lib/definitions/system";
import { KeyValueDynamicKeys, useKvStore } from "@/lib/hooks/kvStore.ts";
import React from "react";

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
  }, [refreshKey]);

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
