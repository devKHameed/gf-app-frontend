import React, { forwardRef } from "react";

import { Handle, Remove } from "../Item";

import { UniqueIdentifier } from "@dnd-kit/core/dist/types";
import { Transform } from "@dnd-kit/utilities";
import { styled } from "@mui/material";

export const ContainterComponent = styled("div")<
  Props & { hasPlaceholder?: boolean }
>(({ unstyled, horizontal, hover, hasPlaceholder, scrollable, shadow }) => ({
  display: "flex",
  flexDirection: "column",
  gridAutoRows: "max-content",
  overflow: "hidden",
  boxSizing: "border-box",
  appearance: "none",
  outline: "none",
  minWidth: "350px",
  margin: "10px",
  borderRadius: "5px",
  minHeight: "200px",
  transition: "background-color 350ms ease",
  backgroundColor: "rgba(246, 246, 246, 1)",
  border: "1px solid rgba(0, 0, 0, 0.05)",
  fontSize: "1em",

  "&:focus-visible": {
    borderColor: "transparent",
    boxShadow: "0 0 0 2px rgba(255, 255, 255, 0), 0 0px 0px 2px #4c9ffe",
  },

  ul: {
    display: "grid",
    gridGap: "10px",
    gridTemplateColumns: "repeat(var(--columns, 1), 1fr)",
    listStyle: "none",
    padding: "20px",
    margin: "0",
  },
  ...(unstyled && {
    overflow: "visible",
    backgroundColor: "transparent !important",
    border: "none !important",
  }),
  ...(horizontal && {
    width: "100%",
    ul: {
      gridAutoFlow: "column",
    },
  }),
  ...(hover && {
    backgroundColor: "rgb(235, 235, 235, 1)",
  }),
  ...(hasPlaceholder && {
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    color: "rgba(0, 0, 0, 0.5)",
    backgroundColor: "transparent",
    borderStyle: "dashed",
    borderColor: "rgba(0, 0, 0, 0.08)",
    "&:hover": {
      borderColor: "rgba(0, 0, 0, 0.15)",
    },
  }),
  ...(scrollable && {
    ul: {
      overflowY: "auto",
    },
  }),
  ...(shadow && {
    boxShadow: "0 1px 10px 0 rgba(34, 33, 81, 0.1)",
  }),
}));

export const Header = styled("div")(() => ({
  display: "flex",
  padding: "5px 20px",
  paddingRight: "8px",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#fff",
  borderTopLeftRadius: "5px",
  borderTopRightRadius: "5px",
  borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
  "&:hover": {
    ".Actions > *": {
      opacity: "1 !important",
    },
  },
}));

export const Actions = styled("div")(() => ({
  display: "flex",
  "> *:first-child:not(:last-child)": {
    opacity: 0,
    ". &:focus-visible": {
      opacity: "1 !important",
    },
  },
}));

export interface Props {
  children: React.ReactNode;
  columns?: number;
  label?: string;
  style?: React.CSSProperties;
  horizontal?: boolean;
  hover?: boolean;
  handleProps?: React.HTMLAttributes<any>;
  scrollable?: boolean;
  shadow?: boolean;
  placeholder?: boolean;
  unstyled?: boolean;
  onClick?(): void;
  id?: UniqueIdentifier;
  onRemove?(): void;
  isDragging?: boolean;
  transition?: string;
  transform?: Transform | null;
  isDragOverlay?: boolean;
}

export const Container = forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      columns = 1,
      handleProps,
      horizontal,
      hover,
      onClick,
      onRemove,
      label,
      placeholder,
      style,
      scrollable,
      shadow,
      unstyled,
      id,
      ...props
    }: Props,
    ref
  ) => {
    const Component = onClick ? "button" : "div";

    return (
      <ContainterComponent
        {...props}
        as={Component}
        ref={ref as any}
        style={
          {
            ...style,
            "--columns": columns,
          } as React.CSSProperties
        }
        unstyled={unstyled}
        horizontal={horizontal}
        hover={hover}
        hasPlaceholder={placeholder}
        scrollable={scrollable}
        shadow={shadow}
        onClick={onClick}
        tabIndex={onClick ? 0 : undefined}
      >
        {label ? (
          <Header>
            {label}
            <Actions>
              {onRemove ? <Remove onClick={onRemove} /> : undefined}
              <Handle {...handleProps} />
            </Actions>
          </Header>
        ) : null}
        {placeholder ? children : <ul>{children}</ul>}
      </ContainterComponent>
    );
  }
);
