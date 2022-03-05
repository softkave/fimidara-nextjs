import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUploadUserImagePath } from "../../../lib/api/endpoints/file";
import KeyValueActions from "../../../lib/store/key-value/actions";
import { KeyValueKeys } from "../../../lib/store/key-value/types";
import SessionSelectors from "../../../lib/store/session/selectors";
import UploadAvatar from "../../utils/UploadAvatar";

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
  }, []);

  return (
    <UploadAvatar
      uploadPath={getUploadUserImagePath(userId)}
      onCompleteUpload={onCompleteUpload}
    />
  );
}
