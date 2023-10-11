import React, { useCallback, useState } from "react";

const useItemContextMenu = () => {
  const [itemContextMenu, setItemContextMenu] =
    useState<{
      mouseX: number;
      mouseY: number;
      item: string;
    } | null>(null);

  const handleItemContextMenuClose = useCallback(() => {
    setItemContextMenu(null);
  }, []);

  const handleItemContextMenu = useCallback(
    (event: React.MouseEvent, extra: string) => {
      event.preventDefault();
      event.stopPropagation();
      setItemContextMenu(
        itemContextMenu === null
          ? {
              mouseX: event.clientX + 2,
              mouseY: event.clientY - 6,
              item: extra,
            }
          : null
      );
    },
    [itemContextMenu]
  );

  const ItemContextMenuOpen = itemContextMenu !== null;

  const handleCallBack = useCallback(
    (callBack: () => void) => {
      callBack?.();
    },
    [itemContextMenu]
  );

  return {
    itemContextMenu,
    handleItemContextMenuClose,
    handleItemContextMenu,
    ItemContextMenuOpen,
    handleCallBack,
    setItemContextMenu,
  };
};

export default useItemContextMenu;
