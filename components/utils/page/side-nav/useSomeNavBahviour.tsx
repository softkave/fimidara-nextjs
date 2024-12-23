import { keyBy } from "lodash-es";
import { useCallback, useMemo } from "react";
import { ISomeNavItem } from "./types.ts";

export interface ISomeNavBehaviourProps {
  open?: string[];
  selected?: string[];
  onOpen?: (open: string[]) => void;
  onSelect?: (selected: string[]) => void;

  // internal props
  _openMap?: Record<string, string>;
  _selectedMap?: Record<string, string>;
}

export function useSomeNavBehaviour(props: ISomeNavBehaviourProps) {
  const { open, selected, onOpen, onSelect, _openMap, _selectedMap } = props;

  const openMap = useMemo(() => {
    return _openMap || keyBy(open, (k) => k);
  }, [open, _openMap]);

  const selectedMap = useMemo(() => {
    return _selectedMap || keyBy(selected, (k) => k);
  }, [selected, _selectedMap]);

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
