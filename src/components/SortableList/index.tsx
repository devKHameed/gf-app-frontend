import type { Modifiers, UniqueIdentifier } from "@dnd-kit/core";
import {
  DndContext,
  DndContextProps,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  SortableContextProps,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Stack, StackProps } from "@mui/material";
import type { ReactNode } from "react";
import React from "react";
import { DragHandle, SortableItem } from "./components";

export interface BaseItem {
  id: UniqueIdentifier;
}

interface Props<T extends BaseItem>
  extends Omit<SortableContextProps, "children"> {
  items: T[];
  dndContextProps?: DndContextProps;
  stackProps?: StackProps;
  onChange?(items: T[], activeIndex?: number, overIndex?: number): void;
  modifiers?: Modifiers;
  onMove?(activeIndex: number, overIndex: number): void;
  renderItem(item: T, index: number): ReactNode;
}

export function SortableList<T extends BaseItem>({
  items,
  onChange,
  renderItem,
  dndContextProps = {},
  onMove,
  stackProps,
  modifiers,
  ...sortableContextProps
}: Props<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      modifiers={modifiers}
      onDragEnd={({ active, over }) => {
        console.log(items, "items");
        if (over && active.id !== over?.id) {
          const activeIndex = items.findIndex(({ id }) => id === active.id);
          const overIndex = items.findIndex(({ id }) => id === over.id);

          if (activeIndex > -1 && overIndex > -1) {
            onMove?.(activeIndex, overIndex);
            onChange?.(
              arrayMove(items, activeIndex, overIndex),
              activeIndex,
              overIndex
            );
          }
        }
      }}
      onDragCancel={() => {}}
      {...dndContextProps}
    >
      <SortableContext items={items} {...sortableContextProps}>
        <Stack
          spacing={1.25}
          className='SortableList'
          role='application'
          {...stackProps}
        >
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              {renderItem(item, index)}
            </React.Fragment>
          ))}
        </Stack>
      </SortableContext>
    </DndContext>
  );
}

SortableList.Item = SortableItem;
SortableList.DragHandle = DragHandle;
