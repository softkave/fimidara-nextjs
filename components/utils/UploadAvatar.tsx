import { Upload, message, Typography, Button } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";
import { RcFile, UploadChangeParam } from "antd/lib/upload";
import React from "react";
import { defaultTo } from "lodash";
import { css } from "@emotion/css";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import SessionSelectors from "../../lib/store/session/selectors";
import { appDimensions } from "./theme";

export type IImageUploadMessages = Partial<{
  uploading: string;
  successful: string;
  failed: string;
}>;

export interface IUploadAvatarProps {
  messages?: IImageUploadMessages;
  uploadPath: string;
  onCompleteUpload: () => void;
}

const IMAGE_JPEG = "image/jpeg";
const IMAGE_PNG = "image/png";
const DEFAULT_MESSAGES: IImageUploadMessages = {
  uploading: "Uploading image",
  successful: "Uploaded image successfully",
  failed: "Error uploading image",
};

function beforeUpload(file: RcFile) {
  const isJpgOrPng = file.type === IMAGE_JPEG || file.type === IMAGE_PNG;

  if (!isJpgOrPng) {
    message.error("Invalid image type");
  }

  return isJpgOrPng;
}

const UploadAvatar: React.FC<IUploadAvatarProps> = (props) => {
  const { uploadPath, onCompleteUpload } = props;
  const clientAssignedToken = useSelector(
    SessionSelectors.assertGetClientAssignedToken
  );

  const customMessages = {
    ...DEFAULT_MESSAGES,
    ...defaultTo(props.messages, {}),
  };

  const [loading, setLoading] = React.useState(false);
  const [messageKey] = React.useState(() => Math.random().toString());
  const token = Cookies.get("accessToken");

  const onChange = (info: UploadChangeParam) => {
    if (info.file.status === "uploading") {
      message.loading({ content: customMessages.uploading, key: messageKey });
      setLoading(true);
    } else if (info.file.status === "done") {
      message.success({
        content: (
          <Typography.Text>
            {customMessages.successful}.{" "}
            <Typography.Text strong>
              Please reload the page if your change doesn't take effect soon.
            </Typography.Text>
          </Typography.Text>
        ),
        key: messageKey,
        // duration: SUCCESS_MESSAGE_DURATION,
      });

      setLoading(false);
      setTimeout(() => {
        onCompleteUpload();
      }, 3000);
    } else if (info.file.status === "error") {
      message.error({
        content: customMessages.failed,
        key: messageKey,
      });

      setLoading(false);
    }
  };

  const uploadButton = (
    <Button icon={<CloudUploadOutlined />} loading={loading}>
      Upload image
    </Button>
  );

  return (
    <Upload
      name="image"
      action={uploadPath}
      headers={{ authorization: `Bearer ${clientAssignedToken}` }}
      beforeUpload={beforeUpload}
      onChange={onChange}
      disabled={loading}
      className={css({
        width: appDimensions.avatar.width,
        height: appDimensions.avatar.height,
      })}
    >
      {uploadButton}
    </Upload>
  );
};

export default UploadAvatar;
