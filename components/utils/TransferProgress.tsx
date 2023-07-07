import { useTransferProgress } from "@/lib/hooks/useTransferProgress";
import { Progress, Space } from "antd";
import { identity } from "lodash";
import ItemList from "./list/ItemList";
import { htmlCharacterCodes } from "./utils";

export interface ITransferProgressProps {
  identifier: string;
}

export interface ITransferProgressListProps {
  identifiers: string[];
}

export function TransferProgress(props: ITransferProgressProps) {
  const { identifier } = props;
  const progressHook = useTransferProgress(identifier);
  let percent = 0;
  let rate = 0;
  let total: string | number = 0;
  let loaded = 0;
  let estimatedTime: string | number = "unknown";

  if (progressHook.progress) {
    percent = (progressHook.progress.progress ?? 0) * 100;
    rate = progressHook.progress.rate ?? 0;
    loaded = progressHook.progress.loaded ?? 0;
    estimatedTime = progressHook.progress.estimated ?? "unknown";
    total = progressHook.progress.loaded
      ? progressHook.progress.total ?? "unknown"
      : progressHook.progress.total ?? 0;
  }

  return (
    <Space direction="vertical">
      <Progress percent={percent} status="active" />
      <Space split={htmlCharacterCodes.middleDot}>
        <div>
          {loaded} of {total}
        </div>
        <div>{rate}</div>
        <div>{estimatedTime}</div>
      </Space>
    </Space>
  );
}

export function TransferProgressList(props: ITransferProgressListProps) {
  const { identifiers } = props;

  return (
    <ItemList
      bordered={false}
      items={identifiers}
      renderItem={(identifier) => <TransferProgress identifier={identifier} />}
      getId={identity}
    />
  );
}
