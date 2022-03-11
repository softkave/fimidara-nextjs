import React from "react";
import { useDispatch } from "react-redux";
import { withServerAddr } from "../../../lib/api/addr";
import {
  getFetchOrgImagePath,
  getUploadOrgImagePath,
} from "../../../lib/api/endpoints/file";
import KeyValueActions from "../../../lib/store/key-value/actions";
import { KeyValueDynamicKeys } from "../../../lib/store/key-value/utils";
import { formClasses } from "../../form/classNames";
import ImageAndUploadAvatar from "../../utils/ImageAndUploadAvatar";
import { appDimensions } from "../../utils/theme";

export interface IUploadOrgAvatarProps {
  orgId: string;
}

export default function UploadOrgAvatar(props: IUploadOrgAvatarProps) {
  const { orgId } = props;
  const dispatch = useDispatch();
  const refreshKey = KeyValueDynamicKeys.getOrgImageLastUpdateTime(orgId);
  const onCompleteUpload = React.useCallback(() => {
    dispatch(
      KeyValueActions.setKey({
        key: refreshKey,
        value: Date.now(),
      })
    );
  }, [orgId]);

  return (
    <div className={formClasses.formContentWrapperClassName}>
      <ImageAndUploadAvatar
        refreshKey={refreshKey}
        uploadPath={withServerAddr(getUploadOrgImagePath(orgId))}
        onCompleteUpload={onCompleteUpload}
        src={withServerAddr(
          getFetchOrgImagePath(
            orgId,
            appDimensions.avatar.width,
            appDimensions.avatar.height
          )
        )}
        alt="Your profile picture"
      />
    </div>
  );
}
