import { Space } from "antd";
import React from "react";
import ImageWithFallback, {
  IImageWithFallbackProps,
} from "./ImageWithFallback";
import UploadAvatar, { IUploadAvatarProps } from "./UploadAvatar";

export interface IImageAndUploadAvatarProps
  extends IUploadAvatarProps,
    IImageWithFallbackProps {
  className?: string;
}

const ImageAndUploadAvatar: React.FC<IImageAndUploadAvatarProps> = (props) => {
  const { className } = props;

  return (
    <Space direction="vertical" size="middle" className={className}>
      <ImageWithFallback {...props} />
      <UploadAvatar {...props} />
    </Space>
  );
};

export default ImageAndUploadAvatar;
