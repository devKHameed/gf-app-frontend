import {
  Box,
  Popover,
  popoverClasses,
  PopoverProps,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from "@mui/material";
import React, { useCallback, useImperativeHandle } from "react";
import { cloneElement } from "utils";
import FlowPopoverContainer, {
  FlowPopoverContainerProps,
} from "./FlowPopoverContainer";

export const NodeEditorTooltip = styled(
  ({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  )
)(({ theme }) => ({
  [`.${tooltipClasses.popper}`]: {
    position: "fixed",
    color: "white",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    width: 450,
    padding: 0,
    maxWidth: "none",
    maxHeight: "800px",
    backgroundColor: theme.palette.background.GFRightNavBackground,
    // overflowY: "auto",
    overflow: "hidden",
  },
}));

export const NodeEditorPopover = styled(
  ({ className, ...props }: PopoverProps) => (
    <Popover {...props} classes={{ root: className }} />
  )
)(({ theme }) => ({
  // [`.${tooltipClasses.popper}`]: {
  //   position: "fixed",
  //   color: "white",
  // },
  [`& .${popoverClasses.paper}`]: {
    width: 450,
    padding: 0,
    maxWidth: "none",
    maxHeight: "800px",
    backgroundColor: theme.palette.background.GFRightNavBackground,
    // overflowY: "auto",
    overflow: "hidden",
  },
}));

type Props = {
  content?: React.ReactNode;
  containerProps?: FlowPopoverContainerProps;
  delayDuration?: number;
  onSaveClick?(data: { onClose(): void }): void;
  onOpen?(): void;
  onClose?(): void;
} & Partial<PopoverProps>;

export type FlowPopoverRef = {
  close(): void;
  open(el: Element | SVGGElement): void;
};

const FlowPopover = React.forwardRef<FlowPopoverRef | undefined, Props>(
  (props, ref) => {
    const {
      content,
      onOpen,
      onClose,
      children,
      containerProps,
      onSaveClick,
      delayDuration = 0,
      ...popoverProps
    } = props;

    const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);

    const handleClick = (event: React.MouseEvent<Element>) => {
      event.stopPropagation();
      const ct = event.currentTarget;
      setTimeout(() => {
        setAnchorEl(ct);
      }, delayDuration);
      onOpen?.();
    };

    const handleClose = useCallback(() => {
      setAnchorEl(null);
      onClose?.();
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        close: handleClose,
        open: (el: Element) => {
          setAnchorEl(el);
        },
      }),
      [handleClose]
    );

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
      // <ClickAwayListener
      //   onClickAway={(e) => {
      //     console.log(e.currentTarget);
      //   }}
      // >
      <Box sx={{ height: "100%", width: "100%" }}>
        <NodeEditorPopover
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "center",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: -15,
          }}
          anchorEl={anchorEl}
          id="flow-popover"
          className="flow-popover"
          {...popoverProps}
        >
          <FlowPopoverContainer
            {...containerProps}
            onSaveClick={() => onSaveClick?.({ onClose: handleClose })}
            onCloseClick={handleClose}
          >
            {cloneElement(content, { onClose: handleClose })}
          </FlowPopoverContainer>
        </NodeEditorPopover>
        <Box sx={{ height: "100%", width: "100%" }} onClick={handleClick}>
          {children}
        </Box>
      </Box>
      // </ClickAwayListener>
    );
  }
);

export default FlowPopover;
