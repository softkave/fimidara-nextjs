import { systemConstants } from "@/lib/definitions/system";
import { KeyValueKeys, useKvStore } from "@/lib/hooks/storeHooks";
import React from "react";
import { formClasses } from "../../form/classNames";
import { useUserNode } from "../../hooks/useUserNode";
import ImageAndUploadAvatar from "../../utils/ImageAndUploadAvatar";

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
        onCompleteUpload={onCompleteUpload}
        filepath={systemConstants.userImagesFolder + "/" + userId}
        alt="Your profile picture"
      />
    </div>
  );
}
