import { systemConstants } from "@/lib/definitions/system";
import KeyValueActions from "@/lib/store/key-value/actions";
import { KeyValueDynamicKeys } from "@/lib/store/key-value/utils";
import { getReadFileURL, getUploadFileURL } from "fimidara";
import React from "react";
import { useDispatch } from "react-redux";
import { formClasses } from "../../form/classNames";
import ImageAndUploadAvatar from "../../utils/ImageAndUploadAvatar";
import { appDimensions } from "../../utils/theme";

export interface IUploadWorkspaceAvatarProps {
  workspaceId: string;
}

export default function UploadWorkspaceAvatar(
  props: IUploadWorkspaceAvatarProps
) {
  const { workspaceId } = props;
  const dispatch = useDispatch();
  const refreshKey =
    KeyValueDynamicKeys.getWorkspaceImageLastUpdateTime(workspaceId);
  const onCompleteUpload = React.useCallback(() => {
    dispatch(
      KeyValueActions.setKey({
        key: refreshKey,
        value: Date.now(),
      })
    );
  }, [refreshKey, dispatch]);

  return (
    <div className={formClasses.formContentWrapperClassName}>
      <ImageAndUploadAvatar
        refreshKey={refreshKey}
        uploadPath={getUploadFileURL({
          filepath: systemConstants.workspaceImagesFolder + "/" + workspaceId,
        })}
        onCompleteUpload={onCompleteUpload}
        src={getReadFileURL({
          filepath: systemConstants.workspaceImagesFolder + "/" + workspaceId,
          width: appDimensions.avatar.width,
          height: appDimensions.avatar.height,
        })}
        alt="Your profile picture"
      />
    </div>
  );
}
