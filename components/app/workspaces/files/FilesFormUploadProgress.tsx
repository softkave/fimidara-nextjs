import { TransferProgressList } from "@/components/utils/TransferProgress";
import IconButton from "@/components/utils/buttons/IconButton";
import { Form, Typography } from "antd";
import { FiDownload } from "react-icons/fi";

export interface FilesFormUploadProgressProps {
  identifiers: string[];
}

export function FilesFormUploadProgress(props: FilesFormUploadProgressProps) {
  const { identifiers } = props;

  if (identifiers.length > 0) {
    return (
      <Form.Item>
        <Typography.Paragraph type="secondary">
          You can navigate away from this page and track the upload progress
          using the{" "}
          <IconButton
            disabled
            icon={<FiDownload />}
            title={`Uploading files progress button appearance`}
          />{" "}
          <Typography.Text strong>Uploading files progress</Typography.Text>{" "}
          button.
        </Typography.Paragraph>
        <TransferProgressList identifiers={identifiers} />
      </Form.Item>
    );
  }

  return null;
}
