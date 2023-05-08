import { getReadFileURL, getUploadFileURL } from "@/lib/api/utils";
import { systemConstants } from "@/lib/definitions/system";
import React from "react";
import { KeyValueKeys, useKvStore } from "../../../lib/hooks/storeHooks";
import { formClasses } from "../../form/classNames";
import { useUserNode } from "../../hooks/useUserNode";
import ImageAndUploadAvatar from "../../utils/ImageAndUploadAvatar";
import { appDimensions } from "../../utils/theme";

export default function UploadUserAvatar() {
  const userNode = useUserNode();
  const onCompleteUpload = React.useCallback(() => {
    useKvStore.getState().set(KeyValueKeys.UserImageLastUpdateTime, Date.now());
  }, []);

  if (userNode.renderedNode) {
    return userNode.renderedNode;
  }

  const userId = userNode.assertGet().user.resourceId;
  return (
    <div className={formClasses.formContentWrapperClassName}>
      <ImageAndUploadAvatar
        refreshKey={KeyValueKeys.UserImageLastUpdateTime}
        uploadPath={getUploadFileURL({
          filepath: systemConstants.userImagesFolder + "/" + userId,
        })}
        onCompleteUpload={onCompleteUpload}
        src={getReadFileURL({
          filepath: systemConstants.userImagesFolder + "/" + userId,
          width: appDimensions.avatar.width,
          height: appDimensions.avatar.height,
        })}
        alt="Your profile picture"
      />
    </div>
  );
}
