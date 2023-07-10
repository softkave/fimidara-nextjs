import { TransferProgressList } from "@/components/utils/TransferProgress";
import IconButton from "@/components/utils/buttons/IconButton";
import PageDrawer from "@/components/utils/page/PageDrawer";
import { KeyValueKeys, useKvStore } from "@/lib/hooks/storeHooks";
import { useToggle } from "ahooks";
import { Badge } from "antd";
import { FimidaraEndpointProgressEvent } from "fimidara";
import { map } from "lodash";
import React from "react";
import { FiDownload } from "react-icons/fi";

export interface UploadingFilesProgressButtonProps {}

export const UploadingFilesProgressButton: React.FC<
  UploadingFilesProgressButtonProps
> = (props) => {
  const { progressKeys } = useTransferProgressKeys();
  const [showList, showListHook] = useToggle();
  const pendingTransfersCount = useKvStore((state) => {
    return state
      .getList(progressKeys)
      .filter(
        (value: FimidaraEndpointProgressEvent) => value.loaded !== value.total
      );
  });

  return (
    <React.Fragment>
      {showList && (
        <UploadingFilesProgressDrawer onClose={() => showListHook.toggle()} />
      )}
      <Badge count={pendingTransfersCount} color="blue">
        <IconButton
          icon={<FiDownload />}
          title={`Uploading files progress...`}
          onClick={() => showListHook.toggle()}
        />
      </Badge>
    </React.Fragment>
  );
};

export interface UploadingFilesProgressDrawerProps {
  onClose: () => void;
}

export const UploadingFilesProgressDrawer: React.FC<
  UploadingFilesProgressDrawerProps
> = (props) => {
  const { onClose } = props;
  const { progressKeys } = useTransferProgressKeys();
  return (
    <PageDrawer
      open
      closable
      title="Uploading files progress"
      onClose={onClose}
    >
      <TransferProgressList progressKeys={progressKeys} />
    </PageDrawer>
  );
};

function useTransferProgressKeys() {
  const progressKeys = useKvStore((state) => {
    return map(state.items, (value, key) => key).filter((key) =>
      key.startsWith(KeyValueKeys.TransferProgress)
    );
  });

  return { progressKeys };
}
