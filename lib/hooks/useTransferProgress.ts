import { FimidaraEndpointProgressEvent } from "fimidara";
import { merge, uniq } from "lodash";
import React from "react";
import { KeyValueDynamicKeys, useKvStore } from "./storeHooks";

export function useTransferProgressHandler(inputIdentifiers: string[] = []) {
  const [identifiers, setIdentifiers] = React.useState(inputIdentifiers);

  const setProgress = React.useCallback(
    (identifier: string, evt: FimidaraEndpointProgressEvent) => {
      useKvStore
        .getState()
        .set(KeyValueDynamicKeys.getTransferProgress(identifier), evt);
    },
    []
  );

  const mergeProgress = React.useCallback(
    (identifier: string, evt: Partial<FimidaraEndpointProgressEvent>) => {
      const p = useKvStore
        .getState()
        .get(KeyValueDynamicKeys.getTransferProgress(identifier));

      if (p) {
        const merged = merge({}, p, evt);
        useKvStore
          .getState()
          .set(KeyValueDynamicKeys.getTransferProgress(identifier), merged);
      }
    },
    []
  );

  const getProgressHandler = React.useCallback(
    (identifier: string) => {
      setIdentifiers((identifiers) => uniq(identifiers.concat(identifier)));
      return (evt: FimidaraEndpointProgressEvent) => {
        setProgress(identifier, evt);
      };
    },
    [setProgress]
  );

  const setOpError = React.useCallback((identifier: string, error: unknown) => {
    useKvStore
      .getState()
      .set(KeyValueDynamicKeys.getOpError(identifier), error);
  }, []);

  return {
    identifiers,
    getProgressHandler,
    setOpError,
    setProgress,
    mergeProgress,
  };
}

export function useTransferProgress(identifier?: string, progressKey?: string) {
  const progress = useKvStore((state) => {
    return identifier
      ? state.get<FimidaraEndpointProgressEvent>(
          KeyValueDynamicKeys.getTransferProgress(identifier)
        )
      : progressKey
      ? state.get<FimidaraEndpointProgressEvent>(progressKey)
      : undefined;
  });
  const error = useKvStore((state) => {
    return identifier
      ? state.get<unknown>(KeyValueDynamicKeys.getOpError(identifier))
      : undefined;
  });

  return { progress, error };
}
