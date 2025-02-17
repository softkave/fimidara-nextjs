"use client";

import {
  FimidaraEndpointProgressEvent,
  IMultipartUploadHookFnParams,
} from "fimidara";
import { merge, uniq } from "lodash-es";
import React from "react";
import { KeyValueDynamicKeys, useKvStore } from "./kvStore";

export interface ITransferProgress {
  completedParts: number;
  estimatedNumParts: number;
  totalSize: number;
  startMs: number;
  percentComplete: number;
  sizeCompleted: number;
}

export function useTransferProgressHandler(inputIdentifiers: string[] = []) {
  const [identifiers, setIdentifiers] = React.useState(inputIdentifiers);

  const setProgress = React.useCallback(
    (
      identifier: string,
      partParams: IMultipartUploadHookFnParams,
      otherParams?: {
        totalSize: number;
      }
    ) => {
      useKvStore
        .getState()
        .setWithFn(
          KeyValueDynamicKeys.getTransferProgress(identifier),
          (maybeProgress: ITransferProgress | undefined) => {
            const progress: ITransferProgress = {
              completedParts: (maybeProgress?.completedParts ?? 0) + 1,
              estimatedNumParts: partParams.estimatedNumParts,
              totalSize:
                otherParams?.totalSize ?? maybeProgress?.totalSize ?? 0,
              startMs: maybeProgress?.startMs ?? Date.now(),
              sizeCompleted: partParams.sizeCompleted,
              percentComplete: partParams.percentComplete,
            };
            return progress;
          }
        );
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
    (params: { identifier: string; totalSize: number }) => {
      setIdentifiers((identifiers) =>
        uniq(identifiers.concat(params.identifier))
      );
      return (partParams: IMultipartUploadHookFnParams) => {
        setProgress(params.identifier, partParams, {
          totalSize: params.totalSize,
        });
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
      ? state.get<ITransferProgress>(
          KeyValueDynamicKeys.getTransferProgress(identifier)
        )
      : progressKey
      ? state.get<ITransferProgress>(progressKey)
      : undefined;
  });
  const error = useKvStore((state) => {
    return identifier
      ? state.get<unknown>(KeyValueDynamicKeys.getOpError(identifier))
      : undefined;
  });

  return { progress, error };
}
