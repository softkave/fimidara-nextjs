import { useTransferProgress } from "@/lib/hooks/useTransferProgress";
import { Progress, Space, Typography } from "antd";
import { formatDistanceToNow } from "date-fns";
import { identity } from "lodash";
import pb from "pretty-bytes";
import FormError from "../form/FormError";
import ItemList from "./list/ItemList";
import { htmlCharacterCodes } from "./utils";

export interface ITransferProgressProps {
  identifier?: string;
  progressKey?: string;
}

export interface ITransferProgressListProps {
  identifiers?: string[];
  progressKeys?: string[];
}

export function TransferProgress(props: ITransferProgressProps) {
  const { identifier, progressKey } = props;
  const progressHook = useTransferProgress(identifier, progressKey);
  const rate = progressHook.progress?.rate ?? 0;
  const loaded = progressHook.progress?.loaded ?? 0;
  const estimatedTime = progressHook.progress?.estimated ?? 0;
  const total = progressHook.progress?.total ?? 0;
  let percent = 0;

  if (progressHook.progress) {
    percent = (progressHook.progress.progress ?? 0) * 100;
  }

  // TODO: have an internal way for calculating estimated time that doesnt
  // depend on the progress event, or we can extend it to the progress event
  return (
    <Space direction="vertical" style={{ width: "100%" }} size={0}>
      <Progress
        percent={percent}
        status={loaded !== total ? "active" : undefined}
        style={{
          margin: 0,
          /** The percentage overflows causing scroll when the whole exceeds
           * parent width. */
          width: "calc(100% - 8px)",
        }}
      />
      <Space
        split={
          <Typography.Text type="secondary">
            {htmlCharacterCodes.middleDot}
          </Typography.Text>
        }
      >
        <Typography.Text type="secondary">
          {pb(loaded)} of {pb(total)}
        </Typography.Text>
        <Typography.Text type="secondary">{pb(rate)}/s</Typography.Text>
        <Typography.Text type="secondary">
          {estimatedTime
            ? formatDistanceToNow(estimatedTime)
            : "Estimated time unknown"}
        </Typography.Text>
      </Space>
      {progressHook.error && (
        <FormError visible enrich error={progressHook.error as any} />
      )}
    </Space>
  );
}

export function TransferProgressList(props: ITransferProgressListProps) {
  const { identifiers, progressKeys } = props;
  const groupedIdentifiers = (identifiers ?? []).map(
    (identifier) => ({ identifier, type: "id" } as const)
  );
  const groupedProgressKeys = (progressKeys ?? []).map(
    (key) => ({ key, type: "key" } as const)
  );
  const itemList = (
    [] as Array<
      (typeof groupedIdentifiers)[0] | (typeof groupedProgressKeys)[0]
    >
  ).concat(groupedIdentifiers, groupedProgressKeys);

  return (
    <ItemList
      bordered={false}
      items={itemList}
      renderItem={(item) => (
        <TransferProgress
          identifier={item.type === "id" ? item.identifier : undefined}
          progressKey={item.type === "key" ? item.key : undefined}
        />
      )}
      getId={identity}
    />
  );
}
