import { useToast } from "@/hooks/use-toast.ts";
import { DeleteFilled, LoadingOutlined } from "@ant-design/icons";
import { css, cx } from "@emotion/css";
import { useRequest } from "ahooks";
import { Image, ImageProps } from "antd";
import assert from "assert";
import { getFimidaraReadFileURL } from "fimidara";
import { first } from "lodash-es";
import React from "react";
import { getPublicFimidaraEndpointsUsingUserToken } from "../../lib/api/fimidaraEndpoints";
import { systemConstants } from "../../lib/definitions/system";
import { useKvStore } from "../../lib/hooks/kvStore";
import { Button } from "../ui/button.tsx";
import { errorMessageNotificatition } from "./errorHandling";
import { appDataImages } from "./theme";

export interface IImageWithFallbackProps {
  allowDelete?: boolean;
  width?: number;
  height?: number;
  fallbackNode?: React.ReactNode;
  preview?: ImageProps["preview"];
  refreshKey?: string;
  filepath: string;
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
};

const skipEventForTag = "skip-click-event-on-delete-btn";

const ImageWithFallback: React.FC<IImageWithFallbackProps> = (props) => {
  const {
    preview,
    width,
    height,
    filepath,
    alt,
    fallbackNode,
    allowDelete,
    refreshKey,
    onClick,
    onDelete,
  } = props;
  const { toast } = useToast();

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
      } catch (error: unknown) {
        errorMessageNotificatition(error, "Error deleting image", toast);
      }

      setTimeout(() => {
        setIsDeleting(false);
      }, 2000);
    }
  };

  const getPresignedPath = async () => {
    const endpoints = await getPublicFimidaraEndpointsUsingUserToken();
    const getResult = await endpoints.presignedPaths.getPresignedPaths({
      files: [{ filepath }],
    });

    if (getResult.paths.length) {
      const p = first(getResult.paths);
      assert(p);
      return p.path;
    }

    const issueResult = await endpoints.presignedPaths.issuePresignedPath({
      filepath,
    });
    return issueResult.path;
  };

  const pathHook = useRequest(getPresignedPath);

  let imageNode: React.ReactNode = (
    <Image
      width={width}
      height={height}
      alt={alt}
      onClick={onClick}
      style={{ width }}
    />
  );

  if (pathHook.data) {
    imageNode = (
      <Image
        key={imageKey}
        preview={preview}
        width={width}
        height={height}
        src={getFimidaraReadFileURL({
          // width: width ?? appDimensions.upload.width,
          // height: height ?? appDimensions.upload.height,
          serverURL: systemConstants.serverAddr,
          filepath: "/" + pathHook.data,
        })}
        alt={alt}
        onError={onError}
        fallback={appDataImages.brokenImage}
        onClick={onClick}
        style={{ width }}
      />
    );
  }

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
            type="button"
            disabled={isDeleting}
            data-skipeventfortag={skipEventForTag}
            onClick={(evt) => {
              evt.stopPropagation();
              internalOnDelete();
            }}
            variant="outline"
            size="icon"
          >
            {isDeleting ? (
              <LoadingOutlined className="h-4 w-4" />
            ) : (
              <DeleteFilled className="h-4 w-4" />
            )}
          </Button>
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
