import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { withServerAddr } from "../../../lib/api/addr";
import {
  getFetchUserImagePath,
  getUploadUserImagePath,
} from "../../../lib/api/endpoints/file";
import KeyValueActions from "../../../lib/store/key-value/actions";
import { KeyValueKeys } from "../../../lib/store/key-value/types";
import SessionSelectors from "../../../lib/store/session/selectors";
import { formClasses } from "../../form/classNames";
import ImageAndUploadAvatar from "../../utils/ImageAndUploadAvatar";
import { appDimensions } from "../../utils/theme";

export default function UploadUserAvatar() {
  const userId = useSelector(SessionSelectors.assertGetUserId);
  const dispatch = useDispatch();
  const onCompleteUpload = React.useCallback(() => {
    dispatch(
      KeyValueActions.setKey({
        key: KeyValueKeys.UserImageLastUpdateTime,
        value: Date.now(),
      })
    );
  }, [dispatch]);

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
