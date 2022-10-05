import React from "react";
import { useDispatch } from "react-redux";
import { withServerAddr } from "../../../lib/api/addr";
import {
  getFetchUserImagePath,
  getUploadUserImagePath,
} from "../../../lib/api/endpoints/file";
import KeyValueActions from "../../../lib/store/key-value/actions";
import { KeyValueKeys } from "../../../lib/store/key-value/types";
import { formClasses } from "../../form/classNames";
import { useUserNode } from "../../hooks/useUserNode";
import ImageAndUploadAvatar from "../../utils/ImageAndUploadAvatar";
import { appDimensions } from "../../utils/theme";

export default function UploadUserAvatar() {
  const u0 = useUserNode();
  const dispatch = useDispatch();
  const onCompleteUpload = React.useCallback(() => {
    dispatch(
      KeyValueActions.setKey({
        key: KeyValueKeys.UserImageLastUpdateTime,
        value: Date.now(),
      })
    );
  }, [dispatch]);

  if (u0.renderNode) {
    return u0.renderNode;
  }

  const userId = u0.assertGet().user.resourceId;
  return (
    <div className={formClasses.formContentWrapperClassName}>
      <ImageAndUploadAvatar
        refreshKey={KeyValueKeys.UserImageLastUpdateTime}
        uploadPath={withServerAddr(getUploadUserImagePath(userId))}
        onCompleteUpload={onCompleteUpload}
        src={withServerAddr(
          getFetchUserImagePath(
            userId,
            appDimensions.avatar.width,
            appDimensions.avatar.height
          )
        )}
        alt="Your profile picture"
      />
    </div>
  );
}
