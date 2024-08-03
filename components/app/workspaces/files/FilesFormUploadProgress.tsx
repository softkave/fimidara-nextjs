import { TransferProgressList } from "@/components/utils/TransferProgress";
import IconButton from "@/components/utils/buttons/IconButton";
import { Form } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Text from "antd/es/typography/Text";
import { FiDownload } from "react-icons/fi";

export interface FilesFormUploadProgressProps {
  identifiers: string[];
}

export function FilesFormUploadProgress(props: FilesFormUploadProgressProps) {
  const { identifiers } = props;

  if (identifiers.length > 0) {
    return (
      <Form.Item>
        <Paragraph type="secondary">
          You can navigate away from this page and track the upload progress
          using the{" "}
          <IconButton
            disabled
            icon={<FiDownload />}
            title={`Uploading files progress button appearance`}
          />{" "}
          <Text strong>Uploading files progress</Text> button.
        </Paragraph>
        <TransferProgressList identifiers={identifiers} />
      </Form.Item>
    );
  }

  return null;
}
