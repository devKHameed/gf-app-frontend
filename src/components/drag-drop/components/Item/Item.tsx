import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";
import classNames from "classnames";
import React, { useEffect } from "react";

import { Handle, Remove } from "./components";

import styled from "@mui/system/styled";

export const Li = styled("li")<Partial<Props>>(({ dragOverlay, fadeIn }) => ({
  display: "flex",
  boxSizing: "border-box",
  transform:
    "translate3d(var(--translate-x, 0), var(--translate-y, 0), 0)\n    scaleX(var(--scale-x, 1)) scaleY(var(--scale-y, 1))",
  transformOrigin: "0 0",
  touchAction: "manipulation",

  ...(fadeIn && {
    "@keyframes fadeIn": {
      "0%": {
        opacity: 0,
      },
      "100%": {
        opacity: 1,
      },
    },
    animation: "fadeIn 500ms ease",
  }),
  ...(dragOverlay && {
    "--scale": "1.05",
    "--boxShadow":
      "0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05), 0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15)",
    "--boxShadowPickedUp":
      "0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05), -1px 0 15px 0 rgba(34, 33, 81, 0.01), 0px 15px 15px 0 rgba(34, 33, 81, 0.25)",
    zIndex: "999",
  }),
}));

export const Content = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexGrow: "1",
  alignItems: "center",
  padding: "18px 20px",
  backgroundColor: " #fff",
  boxShadow:
    "0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05), 0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15)",
  outline: "none",
  borderRadius: "calc(4px / var(--scale-x, 1))",
  boxSizing: "border-box",
  listStyle: "none",
  transformOrigin: "50% 50%",
  WebkitTapHighlightColor: "transparent",
  color: "#333",
  fontWeight: "400",
  fontSize: "1rem",
  whiteSpace: "nowrap",
  transform: "scale(var(--scale, 1))",
  transition: "box-shadow 200ms cubic-bezier(0.18, 0.67, 0.6, 1.22)",

  "@keyframes pop": {
    "0%": {
      transform: "scale(1)",
      boxShadow: "var(--box-shadow)",
    },
    "100%": {
      transform: "scale(var(--scale))",
      boxShadow: "var(--box-shadow-picked-up)",
    },
  },

  "&:focus-visible": {
    boxShadow:
      "0 0px 4px 1px #4c9ffe, 0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05), 0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15)",
  },
  "&:not(.withHandle)": {
    touchAction: "manipulation",
    cursor: "grab",
  },
  "&.dragging:not": {
    opacity: "var(--dragging-opacity, 0.5)",
    zIndex: "0",
    "&:focus": {
      boxShadow:
        "0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05), 0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15)",
    },
  },
  "&.disabled": {
    color: "#999",
    backgroundColor: "#f1f1f1",
    cursor: "not-allowed",
    "&:focus": {
      boxShadow:
        "0 0px 4px 1px rgba(0, 0, 0, 0.1), 0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05), 0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15)",
    },
  },
  "&.dragOverlay": {
    cursor: "inherit",
    animation: "pop 200ms cubic-bezier(0.18, 0.67, 0.6, 1.22)",
    transform: "scale(var(--scale))",
    boxShadow: "var(--box-shadow-picked-up)",
    opacity: "1",
  },
  "&.color:before": {
    content: '""',
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    left: "0",
    height: "100%",
    width: "3px",
    display: "block",
    borderTopLeftRadius: "3px",
    borderBottomLeftRadius: "3px",
    backgroundColor: "var(--color)",
  },
  "&:hover": {
    ".Remove": {
      visibility: "visible",
    },
  },

  ".Remove": {
    visibility: "hidden",
  },
  ".Actions": {
    display: "flex",
    alignSelf: "flex-start",
    marginTop: "-12px",
    marginLeft: "auto",
    marginBottom: "-15px",
    marginRight: "-10px",
  },
}));

export interface Props {
  dragOverlay?: boolean;
  color?: string;
  disabled?: boolean;
  dragging?: boolean;
  handle?: boolean;
  handleProps?: any;
  height?: number;
  index?: number;
  fadeIn?: boolean;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  sorting?: boolean;
  style?: React.CSSProperties;
  transition?: string | null;
  wrapperStyle?: React.CSSProperties;
  value: React.ReactNode;
  onRemove?(): void;
  renderItem?(args: {
    dragOverlay: boolean;
    dragging: boolean;
    sorting: boolean;
    index: number | undefined;
    fadeIn: boolean;
    listeners: DraggableSyntheticListeners;
    ref: React.Ref<HTMLElement>;
    style: React.CSSProperties | undefined;
    transform: Props["transform"];
    transition: Props["transition"];
    value: Props["value"];
    handleProps: Props["handleProps"];
  }): React.ReactElement;
}
export type DraggableItemProps = Props;
export const Item = React.memo(
  React.forwardRef<HTMLLIElement, Props>(
    (
      {
        color,
        dragOverlay,
        dragging,
        disabled,
        fadeIn,
        handle,
        handleProps,
        height,
        index,
        listeners,
        onRemove,
        renderItem,
        sorting,
        style,
        transition,
        transform,
        value,
        wrapperStyle,
        ...props
      },
      ref
    ) => {
      useEffect(() => {
        if (!dragOverlay) {
          return;
        }

        document.body.style.cursor = "grabbing";

        return () => {
          document.body.style.cursor = "";
        };
      }, [dragOverlay]);

      return renderItem ? (
        renderItem({
          dragOverlay: Boolean(dragOverlay),
          dragging: Boolean(dragging),
          sorting: Boolean(sorting),
          index,
          fadeIn: Boolean(fadeIn),
          listeners,
          ref,
          style,
          transform,
          transition,
          value,
          handleProps,
        })
      ) : (
        <Li
          sx={
            {
              ...wrapperStyle,
              transition: [transition, wrapperStyle?.transition]
                .filter(Boolean)
                .join(", "),
              "--translate-x": transform
                ? `${Math.round(transform.x)}px`
                : undefined,
              "--translate-y": transform
                ? `${Math.round(transform.y)}px`
                : undefined,
              "--scale-x": transform?.scaleX
                ? `${transform.scaleX}`
                : undefined,
              "--scale-y": transform?.scaleY
                ? `${transform.scaleY}`
                : undefined,
              "--index": index,
              "--color": color,
            } as React.CSSProperties
          }
          fadeIn={fadeIn}
          sorting={sorting}
          dragOverlay={dragOverlay}
          ref={ref as any}
        >
          <Content
            className={classNames(
              dragging && "dragging",
              handle && "withHandle",
              dragOverlay && "dragOverlay",
              disabled && "disabled",
              color && "color"
            )}
            style={style}
            data-cypress="draggable-item"
            {...(!handle ? listeners : undefined)}
            {...props}
            tabIndex={!handle ? 0 : undefined}
          >
            {value}
            <span className={"Actions"}>
              {onRemove ? (
                <Remove className={"Remove"} onClick={onRemove} />
              ) : null}
              {handle ? <Handle {...handleProps} {...listeners} /> : null}
            </span>
          </Content>
        </Li>
      );
    }
  )
);
