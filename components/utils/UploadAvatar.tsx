import { CloudUploadOutlined } from "@ant-design/icons";
import { css, cx } from "@emotion/css";
import { Typography, Upload, message } from "antd";
import { RcFile, UploadChangeParam } from "antd/lib/upload";
import { getFimidaraUploadFileURL } from "fimidara";
import { defaultTo, first } from "lodash";
import React from "react";
import { systemConstants } from "../../lib/definitions/system";
import { useUserNode } from "../hooks/useUserNode";
import IconButton from "./buttons/IconButton";
import { errorMessageNotificatition } from "./errorHandling";
import { appDimensions } from "./theme";

export type IImageUploadMessages = Partial<{
  uploading: string;
  successful: string;
  failed: string;
}>;

export interface IUploadAvatarProps {
  messages?: IImageUploadMessages;
  className?: string;
  filepath: string;
  onCompleteUpload: () => void;
}

const DEFAULT_MESSAGES: IImageUploadMessages = {
  uploading: "Uploading image.",
  successful: "Uploaded image successfully.",
  failed: "Error uploading image.",
};

function beforeUpload(file: RcFile) {
  if (first(file.type.split("/")) !== "image") {
    errorMessageNotificatition("Invalid image type.");
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
  const { filepath, className, onCompleteUpload } = props;
  const u0 = useUserNode();
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
              Please reload the page if your change doesn&apos;t take effect
              soon.
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
      errorMessageNotificatition(null, customMessages.failed, {
        key: messageKey,
      });

      setLoading(false);
    }
  };

  if (u0.renderedNode) {
    return u0.renderedNode;
  }

  const clientAssignedToken = u0.assertGet().clientAssignedToken;
  const uploadButton = (
    <IconButton
      icon={<CloudUploadOutlined />}
      disabled={loading}
      title={"Upload image"}
    />
  );

  return (
    <Upload
      name="data"
      action={getFimidaraUploadFileURL({
        filepath,
        serverURL: systemConstants.serverAddr,
      })}
      headers={{ Authorization: `Bearer ${clientAssignedToken}` }}
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
