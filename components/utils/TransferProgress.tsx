"use client";

import { KeyValueDynamicKeys } from "@/lib/hooks/kvStore.ts";
import { useTransferProgress } from "@/lib/hooks/useTransferProgress";
import { Progress, Space } from "antd";
import Text from "antd/es/typography/Text";
import { formatDistanceToNow } from "date-fns";
import { identity, uniqBy } from "lodash-es";
import pb from "pretty-bytes";
import FormError from "./form/FormError";
import ItemList from "./list/ItemList";
import { htmlCharacterCodes } from "./utils";

export interface ITransferProgressProps {
  identifier?: string;
  progressKey: string;
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
      <Text type="secondary">{identifier}</Text>
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
        split={<Text type="secondary">{htmlCharacterCodes.middleDot}</Text>}
      >
        <Text type="secondary">
          {pb(loaded)} of {pb(total)}
        </Text>
        <Text type="secondary">{pb(rate)}/s</Text>
        <Text type="secondary">
          {estimatedTime
            ? formatDistanceToNow(estimatedTime)
            : "Estimated time unknown"}
        </Text>
      </Space>
      {progressHook.error ? (
        <FormError visible enrich error={progressHook.error as any} />
      ) : null}
    </Space>
  );
}

interface TransferId {
  key: string;
  identifier?: string;
}

export function TransferProgressList(props: ITransferProgressListProps) {
  const { identifiers, progressKeys } = props;
  const fromIds = identifiers?.map(
    (identifier): TransferId => ({
      identifier,
      key: KeyValueDynamicKeys.getTransferProgress(identifier),
    })
  );
  const fromKeys = progressKeys?.map(
    (key): TransferId => ({
      key,
      identifier: KeyValueDynamicKeys.getTransferProgressIdentifier(key),
    })
  );
  const itemList = uniqBy(
    ([] as Array<TransferId>).concat(fromIds || [], fromKeys || []),
    (item) => item.identifier + item.key
  );

  return (
    <ItemList
      bordered={false}
      items={itemList}
      renderItem={(item) => {
        return (
          <TransferProgress
            key={item.key}
            identifier={item.identifier}
            progressKey={item.key}
          />
        );
      }}
      getId={identity}
    />
  );
}
