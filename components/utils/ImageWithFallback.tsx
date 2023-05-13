import { DeleteFilled, LoadingOutlined } from "@ant-design/icons";
import { css, cx } from "@emotion/css";
import { Button, Image, ImageProps } from "antd";
import React from "react";
import { useKvStore } from "../../lib/hooks/storeHooks";
import { errorMessageNotificatition } from "./errorHandling";
import { appDataImages } from "./theme";

export interface IImageWithFallbackProps {
  allowDelete?: boolean;
  width?: number;
  height?: number;
  fallbackNode?: React.ReactNode;
  fallbackSrc?: string;
  preview?: ImageProps["preview"];
  refreshKey?: string;
  src: string;
  alt: string;
  onClick?: (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onDelete?: () => void;
}

const classes = {
  root: css({
    position: "relative",

    "& img": {
      borderRadius: "4px",
    },
  }),
  deleteBtnContainer: css({
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0)",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    width: "100%",
    height: "100%",
    padding: "4px",

    "& *": {
      display: "none !important",
    },

    "&:hover *": {
      display: "inline-block !important",
    },
  }),
  deleteBtnContainerOnDeleting: css({
    "& *": {
      display: "inline-block !important",
    },
  }),
  image: css({
    border: "1px solid #f0f0f0",
  }),
};

const skipEventForTag = "skip-click-event-on-delete-btn";

const ImageWithFallback: React.FC<IImageWithFallbackProps> = (props) => {
  const {
    preview,
    width,
    height,
    src,
    alt,
    fallbackNode,
    fallbackSrc,
    allowDelete,
    refreshKey,
    onClick,
    onDelete,
  } = props;

  const [imageLoadFailed, setImageLoadFailed] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const imageKey = useKvStore(
    (state) => refreshKey && state.get<string>(refreshKey)
  );

  const onError = (evt: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log("Image load failed", { props, evt });
    setImageLoadFailed(true);
  };

  const internalOnDelete = async () => {
    if (onDelete) {
      setIsDeleting(true);

      try {
        await onDelete();
      } catch (error: any) {
        errorMessageNotificatition(error, "Error deleting image");
      }

      setTimeout(() => {
        setIsDeleting(false);
      }, 2000);
    }
  };

  console.log({ imageKey });

  const imageNode = (
    <Image
      key={imageKey}
      preview={preview}
      width={width}
      height={height}
      src={src}
      alt={alt}
      onError={onError}
      fallback={fallbackSrc || appDataImages.brokenImage}
      onClick={onClick}
      style={{ width }}
      className={classes.image}
    />
  );

  const imageWrapperNode = (
    <div className={classes.root} style={{ width, height }}>
      {imageNode}
      {allowDelete && (
        <div
          className={cx(classes.deleteBtnContainer, {
            [classes.deleteBtnContainerOnDeleting]: isDeleting,
          })}
          onClick={onClick}
        >
          <Button
            disabled={isDeleting}
            icon={isDeleting ? <LoadingOutlined /> : <DeleteFilled />}
            data-skipeventfortag={skipEventForTag}
            onClick={(evt) => {
              evt.stopPropagation();
              internalOnDelete();
            }}
          />
        </div>
      )}
    </div>
  );

  return (
    <React.Fragment>
      {imageLoadFailed && fallbackNode ? fallbackNode : imageWrapperNode}
    </React.Fragment>
  );
};

export default ImageWithFallback;
