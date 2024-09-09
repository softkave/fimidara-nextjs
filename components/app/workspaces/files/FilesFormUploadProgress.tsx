import { TransferProgressList } from "@/components/utils/TransferProgress";
import IconButton from "@/components/utils/buttons/IconButton";
import { FiDownload } from "react-icons/fi";

export interface FilesFormUploadProgressProps {
  identifiers: string[];
}

export function FilesFormUploadProgress(props: FilesFormUploadProgressProps) {
  const { identifiers } = props;

  if (identifiers.length > 0) {
    return (
      <div className="mb-4">
        <p className="text-secondary">
          You can navigate away from this page and track the upload progress
          using the{" "}
          <IconButton
            disabled
            icon={<FiDownload />}
            title={`Uploading files progress button appearance`}
          />{" "}
          <strong>Uploading files progress</strong> button.
        </p>
        <TransferProgressList identifiers={identifiers} />
      </div>
    );
  }

  return null;
}
