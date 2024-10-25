import { useToast } from "@/hooks/use-toast.ts";
import { CloudUploadOutlined } from "@ant-design/icons";
import { css, cx } from "@emotion/css";
import { Upload } from "antd";
import { RcFile, UploadChangeParam } from "antd/lib/upload";
import { getFimidaraUploadFileURL } from "fimidara";
import { defaultTo, first } from "lodash-es";
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
  uploading: "Uploading image",
  successful: "Uploaded image successfully",
  failed: "Error uploading image",
};

function beforeUpload(
  file: RcFile,
  toast: ReturnType<typeof useToast>["toast"]
) {
  if (first(file.type.split("/")) !== "image") {
    errorMessageNotificatition(
      "Invalid image type",
      /** defaultMessage */ undefined,
      toast
    );
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
  const { toast } = useToast();
  const u0 = useUserNode();
  const customMessages = {
    ...DEFAULT_MESSAGES,
    ...defaultTo(props.messages, {}),
  };

  const [loading, setLoading] = React.useState(false);

  const onChange = (info: UploadChangeParam) => {
    if (info.file.status === "uploading") {
      setLoading(true);
    } else if (info.file.status === "done") {
      toast({
        description: (
          <span>
            {customMessages.successful}.{" "}
            <strong>
              Please reload the page if your change doesn&apos;t take effect
              soon.
            </strong>
          </span>
        ) as any,
      });

      setLoading(false);
      setTimeout(() => {
        onCompleteUpload();
      }, 3000);
    } else if (info.file.status === "error") {
      errorMessageNotificatition(null, customMessages.failed, toast);
      setLoading(false);
    }
  };

  if (u0.renderedNode) {
    return u0.renderedNode;
  }

  const clientAssignedToken = u0.assertGet().clientJwtToken;
  const uploadButton = (
    <IconButton
      icon={<CloudUploadOutlined />}
      disabled={loading}
      title={"Upload image"}
    />
  );

  const uploadURL = getFimidaraUploadFileURL({
    filepath,
    serverURL: systemConstants.serverAddr,
  });

  return (
    <Upload
      name="data"
      action={uploadURL}
      headers={{ Authorization: `Bearer ${clientAssignedToken}` }}
      beforeUpload={(args) => beforeUpload(args, toast)}
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
