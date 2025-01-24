import useAppResponsive from "@/lib/hooks/useAppResponsive.ts";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface IUseOldSideNavBehaviourProps {
  isOpen?: boolean;
  selectedKeys?: string[];
  openKeys?: string[];
  onClose: () => void;
}

export function useOldSideNavBehaviour(props: IUseOldSideNavBehaviourProps) {
  const { isOpen, openKeys, selectedKeys, onClose } = props;

  const responsive = useAppResponsive();
  const isLg = responsive?.lg;
  const defaultOpenKeys = isLg && !isOpen ? undefined : openKeys;

  const [isLgLocal, setLgLocal] = useState(isLg);
  const [open, setOpen] = useState<string[]>(() => defaultOpenKeys || []);
  const [selected, setSelected] = useState<string[]>(() => selectedKeys || []);

  useEffect(() => {
    if (isLg !== isLgLocal) {
      setLgLocal(isLg);

      if (isLgLocal && isOpen) {
        onClose();
      }
    }
  }, [isLg, isLgLocal, isOpen, onClose]);

  useEffect(() => {
    setOpen(defaultOpenKeys || []);
  }, [defaultOpenKeys]);

  useEffect(() => {
    setSelected(selectedKeys || []);
  }, [selectedKeys]);

  const key = useMemo(
    () => (defaultOpenKeys ? Math.random() : undefined),
    [defaultOpenKeys]
  );

  const handleSelect = useCallback(
    (keys: string[]) => {
      setSelected(keys);

      if (!isLg) {
        onClose();
      }
    },
    [onClose, isLg]
  );

  return {
    key,
    open,
    selected,
    isLg,
    handleSelect,
    handleOpen: setOpen,
  };
}
