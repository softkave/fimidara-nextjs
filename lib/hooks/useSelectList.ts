import { isArray, isFunction } from "lodash";
import React from "react";
import { indexArray } from "../utils/indexArray";

export interface IUseSelectListProps {
  defaultSelected?:
    | string[]
    | Record<string, boolean>
    | (() => Record<string, boolean>);
}

export function useSelectList(props: IUseSelectListProps = {}) {
  const { defaultSelected } = props;
  const [selected, setSelected] = React.useState<Record<string, boolean>>(
    isArray(defaultSelected)
      ? () => indexArray(defaultSelected)
      : isFunction(defaultSelected)
      ? defaultSelected
      : {}
  );

  const toggle = React.useCallback((id: string) => {
    setSelected((state) => {
      return { ...state, [id]: !state[id] };
    });
  }, []);
  const set = React.useCallback((id: string, selected: boolean) => {
    setSelected((state) => {
      return { ...state, [id]: selected };
    });
  }, []);

  return {
    selected,
    set,
    toggle,
    getList: () => {
      const selectedList: string[] = [];
      for (const k in selected) {
        if (selected[k]) selectedList.push(k);
      }
      return selectedList;
    },
  };
}
