import { Upload, message, Typography, Button } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";
import { RcFile, UploadChangeParam } from "antd/lib/upload";
import React from "react";
import { defaultTo, first } from "lodash";
import { css, cx } from "@emotion/css";
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
  className?: string;
  uploadPath: string;
  onCompleteUpload: () => void;
}

const DEFAULT_MESSAGES: IImageUploadMessages = {
  uploading: "Uploading image",
  successful: "Uploaded image successfully",
  failed: "Error uploading image",
};

function beforeUpload(file: RcFile) {
  if (first(file.type.split("/")) !== "image") {
    message.error("Invalid image type");
  }

  return true;
}

const classes = {
  root: css({
    width: appDimensions.avatar.width,
    height: appDimensions.avatar.height,
  }),
};

const UploadAvatar: React.FC<IUploadAvatarProps> = (props) => {
  const { uploadPath, className, onCompleteUpload } = props;
  const clientAssignedToken = useSelector(
    SessionSelectors.assertGetClientAssignedToken
  );

  const customMessages = {
    ...DEFAULT_MESSAGES,
    ...defaultTo(props.messages, {}),
  };

  const [loading, setLoading] = React.useState(false);
  const [messageKey] = React.useState(() => Math.random().toString());

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
    <Button icon={<CloudUploadOutlined />} disabled={loading}>
      Upload image
    </Button>
  );

  return (
    <Upload
      name="data"
      action={uploadPath}
      headers={{ authorization: `Bearer ${clientAssignedToken}` }}
      beforeUpload={beforeUpload}
      onChange={onChange}
      disabled={loading}
      className={cx(classes.root, className)}
      accept="image/*"
    >
      {uploadButton}
    </Upload>
  );
};

export default UploadAvatar;
