import IconButton from "@/components/utils/buttons/IconButton";
import { useDownloadFile } from "@/lib/hooks/useDownloadFile";
import { File } from "fimidara";
import { FC, Fragment } from "react";
import { FiDownload } from "react-icons/fi";

export interface FileeDownloadButtonProps {
  file: File;
}

const FileDownloadButton: FC<FileeDownloadButtonProps> = (props) => {
  const { file } = props;
  const filename = file.name + (file.ext ?? "");
  const downloadHook = useDownloadFile(file.resourceId, filename);

  return (
    <Fragment>
      <IconButton
        icon={<FiDownload />}
        title={`Download ${filename}`}
        buttonProps={{
          loading: downloadHook.downloadHook.loading,
        }}
      />
    </Fragment>
  );
};

export default FileDownloadButton;
