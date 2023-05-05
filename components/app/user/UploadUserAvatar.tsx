import { getReadFileURL, getUploadFileURL } from "@/lib/api/utils";
import { systemConstants } from "@/lib/definitions/system";
import KeyValueActions from "@/lib/store/key-value/actions";
import { KeyValueKeys } from "@/lib/store/key-value/types";
import React from "react";
import { useDispatch } from "react-redux";
import { formClasses } from "../../form/classNames";
import { useUserNode } from "../../hooks/useUserNode";
import ImageAndUploadAvatar from "../../utils/ImageAndUploadAvatar";
import { appDimensions } from "../../utils/theme";

export default function UploadUserAvatar() {
  const userNode = useUserNode();
  const dispatch = useDispatch();
  const onCompleteUpload = React.useCallback(() => {
    dispatch(
      KeyValueActions.setKey({
        key: KeyValueKeys.UserImageLastUpdateTime,
        value: Date.now(),
      })
    );
  }, [dispatch]);

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
