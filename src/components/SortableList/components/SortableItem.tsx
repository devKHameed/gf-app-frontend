import type {
  DraggableSyntheticListeners,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box } from "@mui/material";
import type { CSSProperties, PropsWithChildren } from "react";
import { createContext, useContext, useMemo } from "react";

interface Props {
  id: UniqueIdentifier;
  handle?: boolean;
  children:
    | ((data: { isDragging: boolean }) => React.ReactNode)
    | React.ReactNode;
}

interface Context {
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;
  ref(node: HTMLElement | null): void;
}

const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref() {},
});

export function SortableItem({ children, id, handle = false }: Props) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });
  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef]
  );
  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const dragHandleProps = handle ? {} : { ...attributes, ...listeners };

  return (
    <SortableItemContext.Provider value={context}>
      <Box
        className="SortableItem"
        style={style}
        {...dragHandleProps}
        ref={setNodeRef}
      >
        {typeof children === "function" ? children({ isDragging }) : children}
      </Box>
    </SortableItemContext.Provider>
  );
}

export function DragHandle({ children }: PropsWithChildren<{}>) {
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  return (
    <Box className="DragHandle" {...attributes} {...listeners} ref={ref}>
      {children || (
        <button>
          <svg viewBox="0 0 20 20" width="12">
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
          </svg>
        </button>
      )}
    </Box>
  );
}
