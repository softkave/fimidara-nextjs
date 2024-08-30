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
    <div className="space-y-4">
      <ImageWithFallback {...props} />
      <UploadAvatar {...props} />
    </div>
  );
};

export default ImageAndUploadAvatar;
