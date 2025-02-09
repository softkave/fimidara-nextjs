"use client";

import { cn } from "@/components/utils.ts";
import styles from "@/components/utils/form/form.module.css";
import { systemConstants } from "@/lib/definitions/system";
import { KeyValueKeys, useKvStore } from "@/lib/hooks/kvStore.ts";
import React from "react";
import { useAssertGetUser } from "../../hooks/useAssertGetUser";
import ImageAndUploadAvatar from "../../utils/ImageAndUploadAvatar";

export default function UploadUserAvatar() {
  const userNode = useAssertGetUser();
  const onCompleteUpload = React.useCallback(() => {
    useKvStore.getState().set(KeyValueKeys.UserImageLastUpdateTime, Date.now());
  }, []);

  const userId = userNode.assertGet().user.resourceId;
  return (
    <div className={cn(styles.formContentWrapper, "py-4")}>
      <ImageAndUploadAvatar
        refreshKey={KeyValueKeys.UserImageLastUpdateTime}
        onCompleteUpload={onCompleteUpload}
        filepath={systemConstants.userImagesFolder + "/" + userId}
        alt="Your profile picture"
      />
    </div>
  );
}
