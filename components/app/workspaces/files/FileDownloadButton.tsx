import IconButton from "@/components/utils/buttons/IconButton";
import { useDownloadFile } from "@/lib/hooks/useDownloadFile";
import { File } from "fimidara";
import React from "react";
import { FiDownload } from "react-icons/fi";

export interface FileeDownloadButtonProps {
  file: File;
}

const FileDownloadButton: React.FC<FileeDownloadButtonProps> = (props) => {
  const { file } = props;
  const filename = file.name + (file.extension ?? "");
  const downloadHook = useDownloadFile(file.resourceId, filename);

  return (
    <React.Fragment>
      {downloadHook.messageContextHolder}
      <IconButton
        icon={<FiDownload />}
        title={`Download ${filename}`}
        buttonProps={{
          loading: downloadHook.downloadHook.loading,
        }}
      />
    </React.Fragment>
  );
};

export default FileDownloadButton;
