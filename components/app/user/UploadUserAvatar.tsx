"use client";

import styles from "@/components/utils/form/form.module.css";
import { systemConstants } from "@/lib/definitions/system";
import { KeyValueKeys, useKvStore } from "@/lib/hooks/kvStore.ts";
import React from "react";
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
    <div className={styles.formContentWrapper}>
      <ImageAndUploadAvatar
        refreshKey={KeyValueKeys.UserImageLastUpdateTime}
        onCompleteUpload={onCompleteUpload}
        filepath={systemConstants.userImagesFolder + "/" + userId}
        alt="Your profile picture"
      />
    </div>
  );
}
