import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";

import {
  Box,
  Button,
  ClickAwayListener,
  Stack,
  StackProps,
  Tooltip,
  TooltipProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import classNames from "classnames";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { ColorResult, SketchPicker } from "react-color";
import tinyColor from "tinycolor2";
import { cloneElement } from "utils";

const ColorPickerStyle = styled(Box)(({ theme }) => {
  return {
    ".sketch-picker": {
      zIndex: 10000,
      // background: `${theme.palette.background.GFRightNavBackground} !important`,
      background: `${theme.palette.background.GFRightNavForeground} !important`,
      boxShadow: "none !important",
      padding: "0 !important",

      ".flexbox-fix": {
        borderTopColor: `${theme.palette.text.primary_shades?.["12p"]} !important`,
      },

      ".flexbox-fix label": {
        color: `${theme.palette.text.primary} !important`,
      },

      ".flexbox-fix input": {
        width: "100% !important",
        background: `${theme.palette.background.GFRightNavBackground} !important`,
        color: `${theme.palette.text.primary} !important`,
        boxShadow: "none !important",
        outline: "none !important",
      },
    },
  };
});

const SketchActionRow = styled(Stack)<StackProps>(({ theme }) => {
  return {
    // background: "rgb(255, 255, 255)",
    // marginLeft: "6px !important",
    // marginRight: "6px !important",
    // marginBottom: "8px",
  };
});

const ColorPickerOpener = styled(Stack)(({ theme }) => {
  return {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: "8px",
    background: theme.palette.background.GF7,
    width: "115px",
    height: "45px",
    borderRadius: "5px",

    ".color ": {
      width: "66px",
      height: "30px",
      borderRadius: "5px",
      border: `1px solid ${theme.palette.background.GF20}`,
    },

    svg: {
      color: theme.palette.background.GF70,
    },
  };
});

type SketchPickerProps = React.ComponentProps<typeof SketchPicker>;
type IColorPicker = {
  color?: SketchPickerProps["color"];
  className?: string;
  sketchProps?: Omit<SketchPickerProps, "color|onChange">;
  onChange?: (
    value?: string,
    color?: ColorResult,
    e?: React.ChangeEvent<HTMLInputElement>
  ) => void;
  showActionButtons?: boolean;
  onSave?: (value?: { hex?: string; rgb?: string; rgba?: string }) => void;
  height?: number | string;
} & Partial<TooltipProps>;

const ColorPicker: React.FC<PropsWithChildren<IColorPicker>> = (props) => {
  const {
    onChange: colorChange,
    color,
    sketchProps,
    className,
    children,
    showActionButtons,
    onSave,
    height = 30,
    ...rest
  } = props;
  const [pickerColor, setPickerColor] =
    useState<SketchPickerProps["color"]>(color);
  const [boxColor, setBoxColor] = useState<string | undefined>();
  const [hex, setHex] = useState<string | undefined>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (color) {
      const tcolor = tinyColor(color);
      const rgb = tcolor.toRgb();
      const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
      setBoxColor(rgba);
      setPickerColor(rgb);
      setHex(`#${tcolor.toHex()}`);
    }
  }, [color]);

  const onColorChange = (
    value: ColorResult,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { hex, rgb } = value;
    const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
    setBoxColor(rgba);
    setPickerColor(rgb);
    setHex(hex);
    colorChange?.(hex, value);
  };

  return (
    <Box
      // height={height}
      className={classNames(className, "color-picker")}
    >
      <Tooltip
        className="gf-color-picker"
        open={open}
        arrow
        {...rest}
        title={
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <ColorPickerStyle>
              <SketchPicker
                color={pickerColor}
                onChange={onColorChange}
                {...sketchProps}
              />
              {showActionButtons && (
                <SketchActionRow
                  className="actions-area"
                  justifyContent={"center"}
                  alignItems="center"
                  spacing={1}
                >
                  {/* <Col flex="1">
                    <Button type="default" size="small" block>
                      Cancel
                    </Button>
                  </Col> */}
                  <Box flex="1">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() =>
                        onSave?.({
                          hex,
                          rgb: pickerColor as string,
                          rgba: boxColor,
                        })
                      }
                    >
                      Save
                    </Button>
                  </Box>
                </SketchActionRow>
              )}
            </ColorPickerStyle>
          </ClickAwayListener>
        }
      >
        <Box
          className="color-picker-dropdown"
          onClick={() => setOpen((prev) => !prev)}
          sx={{ display: "inline-block", verticalAlign: "top", width: "100%" }}
        >
          {cloneElement(children, { value: hex }) || (
            <ColorPickerOpener>
              <Box
                className="color"
                sx={{
                  backgroundColor: boxColor ? boxColor : "#ffffff",
                  height,
                  display: "inline-block",
                  width: "80px",
                }}
              />
              {open ? (
                <KeyboardArrowUpOutlinedIcon />
              ) : (
                <KeyboardArrowDownOutlinedIcon />
              )}
            </ColorPickerOpener>
          )}
        </Box>
      </Tooltip>
    </Box>
  );
};

export default ColorPicker;
