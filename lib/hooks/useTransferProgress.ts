import { FimidaraEndpointProgressEvent } from "fimidara";
import { uniq } from "lodash";
import React from "react";
import { KeyValueDynamicKeys, useKvStore } from "./storeHooks";

export function useTransferProgressHandler(inputIdentifiers: string[] = []) {
  const [identifiers, setIdentifiers] = React.useState(inputIdentifiers);
  const progressList = useKvStore((state) => {
    return state.getList(
      identifiers.map(KeyValueDynamicKeys.getTransferProgress)
    ) as FimidaraEndpointProgressEvent[];
  });

  const getProgressHandler = React.useCallback((identifier: string) => {
    setIdentifiers((identifiers) => uniq(identifiers.concat(identifier)));
    return (evt: FimidaraEndpointProgressEvent) => {
      useKvStore
        .getState()
        .set(KeyValueDynamicKeys.getTransferProgress(identifier), evt);
    };
  }, []);

  return { progressList, identifiers, getProgressHandler };
}

export function useTransferProgress(identifier?: string) {
  const progress = useKvStore((state) => {
    return identifier
      ? state.get<FimidaraEndpointProgressEvent>(
          KeyValueDynamicKeys.getTransferProgress(identifier)
        )
      : undefined;
  });

  return { progress };
}
