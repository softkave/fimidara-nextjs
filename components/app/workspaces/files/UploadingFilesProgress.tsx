import { TransferProgressList } from "@/components/utils/TransferProgress";
import IconButton from "@/components/utils/buttons/IconButton.tsx";
import PageDrawer from "@/components/utils/page/PageDrawer";
import { KeyValueKeys, useKvStore } from "@/lib/hooks/kvStore.ts";
import { useToggle } from "ahooks";
import { FimidaraEndpointProgressEvent } from "fimidara";
import { map } from "lodash-es";
import { FC, Fragment } from "react";
import { FiDownload } from "react-icons/fi";

export interface UploadingFilesProgressButtonProps {}

export const UploadingFilesProgressButton: FC<
  UploadingFilesProgressButtonProps
> = (props) => {
  const { progressKeys } = useTransferProgressKeys();
  const [showList, showListHook] = useToggle();
  const pendingTransfers = useKvStore((state) => {
    return state
      .getList(progressKeys)
      .filter(
        (value: FimidaraEndpointProgressEvent) => value.loaded !== value.total
      );
  });

  return (
    <Fragment>
      {showList && (
        <UploadingFilesProgressDrawer onClose={() => showListHook.toggle()} />
      )}
      <IconButton
        asChild
        icon={<FiDownload />}
        title={`Uploading files progress...`}
        onClick={() => showListHook.toggle()}
        className="min-w-12 w-fit px-2"
      >
        <span className="inline-block ml-2 text-secondary">
          {pendingTransfers.length}
        </span>
      </IconButton>
    </Fragment>
  );
};

export interface UploadingFilesProgressDrawerProps {
  onClose: () => void;
}

export const UploadingFilesProgressDrawer: FC<
  UploadingFilesProgressDrawerProps
> = (props) => {
  const { onClose } = props;
  const { progressKeys } = useTransferProgressKeys();
  return (
    <PageDrawer open title="Uploading files progress" onClose={onClose}>
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
