import { FimidaraEndpointProgressEvent } from "fimidara";
import { uniq } from "lodash";
import React from "react";
import { KeyValueDynamicKeys, useKvStore } from "./storeHooks";

export function useTransferProgressHandler(inputIdentifiers: string[] = []) {
  const [identifiers, setIdentifiers] = React.useState(inputIdentifiers);

  const getProgressHandler = React.useCallback((identifier: string) => {
    setIdentifiers((identifiers) => uniq(identifiers.concat(identifier)));
    return (evt: FimidaraEndpointProgressEvent) => {
      useKvStore
        .getState()
        .set(KeyValueDynamicKeys.getTransferProgress(identifier), evt);
    };
  }, []);

  const setOpError = React.useCallback((identifier: string, error: unknown) => {
    useKvStore
      .getState()
      .set(KeyValueDynamicKeys.getOpError(identifier), error);
  }, []);

  return { identifiers, getProgressHandler, setOpError };
}

export function useTransferProgress(identifier?: string, progressKey?: string) {
  const progress = useKvStore((state) => {
    return identifier
      ? state.get<FimidaraEndpointProgressEvent>(
          progressKey ?? KeyValueDynamicKeys.getTransferProgress(identifier)
        )
      : undefined;
  });
  const error = useKvStore((state) => {
    return identifier
      ? state.get<unknown>(KeyValueDynamicKeys.getOpError(identifier))
      : undefined;
  });

  return { progress, error };
}
