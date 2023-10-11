import { styled } from "@mui/material";
import React, { CSSProperties, forwardRef } from "react";

const Button = styled("button")(() => ({
  display: "flex",
  width: "12px",
  padding: "15px",
  alignItems: "center",
  justifyContent: "center",
  flex: "0 0 auto",
  touchAction: "none",
  cursor: "var(--cursor, pointer)",
  borderRadius: "5px",
  border: "none",
  outline: "none",
  appearance: "none",
  backgroundColor: "transparent",
  WebkitTapHighlightColor: "transparent",

  "@media (hover: hover)": {
    "&:hover": {
      backgroundColor: "var(--action-background, rgba(0, 0, 0, 0.05))",

      svg: {
        fill: "#6f7b88",
      },
    },
  },

  svg: {
    flex: "0 0 auto",
    margin: "auto",
    height: "100%",
    overflow: "visible",
    fill: "#919eab",
  },

  "&:active": {
    backgroundColor: "var(--background, rgba(0, 0, 0, 0.05))",
    svg: {
      fill: "var(--fill, #788491)",
    },
  },

  "&:focus-visible": {
    outline: "none",
    boxShadow:
      "0 0 0 2px rgba(255, 255, 255, 0),0 0px 0px 2px $focused-outline-color",
  },
}));

export interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  active?: {
    fill: string;
    background: string;
  };
  cursor?: CSSProperties["cursor"];
}

export const Action = forwardRef<HTMLButtonElement, Props>(
  ({ active, className, cursor, style, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        {...props}
        className={className}
        tabIndex={0}
        style={
          {
            ...style,
            cursor,
            "--fill": active?.fill,
            "--background": active?.background,
          } as CSSProperties
        }
      />
    );
  }
);
