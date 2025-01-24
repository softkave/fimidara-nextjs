import { keyBy } from "lodash-es";
import { useCallback, useMemo } from "react";
import { ISomeNavItem } from "./types.ts";

export interface ISomeNavBehaviourProps {
  open?: string[];
  selected?: string[];
  onOpen?: (open: string[]) => void;
  onSelect?: (selected: string[]) => void;

  // internal props
  openMap?: Record<string, string>;
  selectedMap?: Record<string, string>;
}

export function useSomeNavBehaviour(props: ISomeNavBehaviourProps) {
  const { open, selected, onOpen, onSelect } = props;

  const openMap = useMemo(() => {
    return props.openMap || keyBy(open, (k) => k);
  }, [open, props.openMap]);

  const selectedMap = useMemo(() => {
    return props.selectedMap || keyBy(selected, (k) => k);
  }, [selected, props.selectedMap]);

  const handleOpen = useCallback(
    (item: ISomeNavItem) => {
      if (openMap[item.key]) {
        onOpen?.((open || []).filter((k) => k !== item.key));
      } else {
        onOpen?.((open || []).concat(item.key));
      }
    },
    [openMap, onOpen, open]
  );

  const handleSelect = useCallback(
    (item: ISomeNavItem) => {
      if (selectedMap[item.key]) {
        onSelect?.((selected || []).filter((k) => k !== item.key));
      } else {
        onSelect?.((selected || []).concat(item.key));
      }
    },
    [selectedMap, onSelect, selected]
  );

  const checkIsSelected = useCallback(
    (key: string) => {
      return !!selectedMap[key];
    },
    [selectedMap]
  );

  const checkIsOpen = useCallback(
    (key: string) => {
      return !!openMap[key];
    },
    [openMap]
  );

  return {
    openMap,
    selectedMap,
    handleOpen,
    handleSelect,
    checkIsSelected,
    checkIsOpen,
  };
}
