import { ArrowDropDown } from "@mui/icons-material";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FileDownload from "@mui/icons-material/FileDownload";
import FormatAlignCenterOutlinedIcon from "@mui/icons-material/FormatAlignCenterOutlined";
import FormatAlignLeftOutlinedIcon from "@mui/icons-material/FormatAlignLeftOutlined";
import FormatAlignRightOutlinedIcon from "@mui/icons-material/FormatAlignRightOutlined";
import FormatBoldOutlinedIcon from "@mui/icons-material/FormatBoldOutlined";
import FormatClearOutlinedIcon from "@mui/icons-material/FormatClearOutlined";
import FormatIndentDecreaseOutlinedIcon from "@mui/icons-material/FormatIndentDecreaseOutlined";
import FormatIndentIncreaseOutlinedIcon from "@mui/icons-material/FormatIndentIncreaseOutlined";
import FormatItalicOutlinedIcon from "@mui/icons-material/FormatItalicOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import FormatListNumberedOutlinedIcon from "@mui/icons-material/FormatListNumberedOutlined";
import FormatShapesIcon from "@mui/icons-material/FormatShapes";
import FormatStrikethroughOutlinedIcon from "@mui/icons-material/FormatStrikethroughOutlined";
import FormatUnderlinedOutlinedIcon from "@mui/icons-material/FormatUnderlinedOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import {
  Button,
  ButtonGroup,
  Divider,
  Input,
  List,
  ListItem,
  ListItemIcon,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import { upload } from "api/upload";
import LinearScale from "assets/icons/LinearScale";
import MouseArrow from "assets/icons/MouseArrow";
import Shapes from "assets/icons/Shapes";
import { createSelectorFunctions } from "auto-zustand-selectors-hook";
import ColorPicker from "components/ColorPicker";
import { S3_CLOUD_FRONT_URL } from "configs/AppConfig";
import usePresentation from "hooks/usePresentation";
import AccountMenu from "module/Menu";
import { nanoid } from "nanoid";
import PptxGenJS from "pptxgenjs";
import React, { useEffect, useState } from "react";
import { useStore } from "store";
import { useSlideSelectedItemsStore } from "store/stores/presentation/selectedStage";
import { decimalUpToSeven } from "utils/presentation/decimalUpToSeven";
import { v4 } from "uuid";
import UndoRedo from "./components/UndoRedo";
import { canvasslideHeight, canvasslideWidth } from "./config/constants";
import { shapes } from "./config/shape";
import fonts from "./config/text.json";
import Trigger from "./config/trigger";
import useAddTool from "./hook/useAddTool";
import useItem from "./hook/useItem";
import useStageDataList from "./hook/useStageDataList";
import useStyleSelector from "./hook/useStyleSelector";

const MenuListWrapper = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  background: theme.palette.background.LeftNavBody,
  padding: "9px 7px",
  alignItems: "center",
  color: theme.palette.text.primary,

  ".MuiDivider-root": {
    margin: "0 3px",
    height: "26px",
    background: theme.palette.background.GF20,
  },

  ".popup-opener": {
    background: "none",
    color: "inherit",
    minWidth: "inherit",
    gap: "2px",
    padding: "2px 6px",
    height: "auto",
    minHeight: "30px",
    opacity: "0.6",

    "&:hover": {
      background: theme.palette.background.SubNavHoverBG,
      opacity: "1",
    },

    svg: {
      height: "auto",
      width: "18px",
    },
  },
}));

const MenuList = styled(List)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "0",
  fontSize: "15px",
  lineHeight: "24px",
  fontWeight: "400",

  li: {
    padding: "0",
    width: "auto",
    margin: "0 2px",

    "> .MuiListItemIcon-root": {
      alignItems: "center",
      justifyContent: "center",
      padding: "2px 6px",
      cursor: "pointer",
      transition: "all 0.4s ease",
      borderRadius: "4px",
      minWidth: "30px",
      minHeight: "30px",
      color: "inherit",
      opacity: "0.6",

      "&:hover, &.isActive": {
        background: theme.palette.background.SubNavHoverBG,
        opacity: "1",
      },

      svg: {
        height: "auto",
      },
    },
  },
}));

const SelectFont = styled(Select)(({ theme }) => ({
  "&.MuiInputBase-root": {
    background: "none",
    transition: "all 0.4s ease",

    "&:hover": {
      background: theme.palette.background.SubNavHoverBG,
    },

    ".MuiOutlinedInput-notchedOutline": {
      border: "none !important",
      outline: "none !important",
      boxShadow: "none",
    },
  },

  ".MuiSelect-select": {
    padding: "5px 4px 5px 8px",
    lineHeight: "20px",
  },

  ".MuiSvgIcon-root": {
    right: "0",
  },
}));

const SelectIndent = styled(Select)(({ theme }) => ({
  "&.MuiInputBase-root": {
    background: "none",
    transition: "all 0.4s ease",

    "&:hover": {
      background: theme.palette.background.SubNavHoverBG,
    },

    ".MuiOutlinedInput-notchedOutline": {
      border: "none !important",
      outline: "none !important",
      boxShadow: "none",
    },
  },

  ".MuiSelect-select": {
    padding: "5px 4px 5px 8px",
    lineHeight: "20px",
    paddingRight: "26px !important",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    svg: {
      height: "14px",
      width: "auto",
    },
  },

  ".MuiSelect-icon": {
    right: "0",
  },
}));

const FontSize = styled(ButtonGroup)(({ theme }) => ({
  padding: "0 9px",
  display: "flex",
  alignItems: "center",

  ".MuiButtonBase-root": {
    padding: "0",
    border: "none",
    outline: "none",
    minWidth: "18px",
    width: "18px",
    lineHeight: "18px",
    height: "18px",
    color: theme.palette.text.primary,
    opacity: "0.6",
    borderRadius: "3px !important",

    "&:hover": {
      border: "none",
      outline: "none",
      background: theme.palette.background.SubNavHoverBG,
    },

    svg: {
      width: "100%",
      height: "auto",
    },
  },

  ".MuiInput-root": {
    width: "38px",
    height: "28px",
    margin: "0 6px",

    "&:before, &:after": {
      display: "none",
    },
  },

  ".MuiInputBase-input": {
    width: "100%",
    height: "100%",
    background: theme.palette.common.blackshades["12p"],
    border: `1px solid ${theme.palette.background.GF60}`,
    color: theme.palette.text.primary,
    padding: "0",
    textAlign: "center",
    borderRadius: "3px",
  },
}));

const ColorPickerHolder = styled(ColorPicker)(({ theme }) => ({
  "&.color-picker": {
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.4s ease",

    "&:hover": {
      background: theme.palette.background.SubNavHoverBG,
    },
  },

  ".gf-color-picker": {
    width: "auto",
  },

  ".MuiStack-root": {
    width: "18px",
    height: "18px",
    borderRadius: "3px",
    padding: "0",

    ".color": {
      width: "100%",
      height: "100%",
      borderRadius: "3px",
      border: "none",
    },

    svg: {
      display: "none",
    },
  },
}));

const PopUpWrapper = styled(Stack)(({ theme }) => ({
  padding: "15px",
  gap: "10px",
}));
const SpinnerOverly = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
}));

const fontAlign = [
  {
    value: "left",
    icon: <FormatAlignLeftOutlinedIcon />,
  },
  {
    value: "center",
    icon: <FormatAlignCenterOutlinedIcon />,
  },
  {
    value: "right",
    icon: <FormatAlignRightOutlinedIcon />,
  },
  //   {
  //     value: "verticalAlign-top",
  //     icon: <VerticalAlignTopOutlinedIcon />,
  //   },
  //   {
  //     value: "verticalAlign-middle",
  //     icon: <VerticalAlignCenterOutlinedIcon />,
  //   },
  //   {
  //     value: "verticalAlign-bottom",
  //     icon: <VerticalAlignBottomOutlinedIcon />,
  //   },
];

type SHAPETYPE = {
  type: string;
  id: string;
  icon: React.ReactNode;
  sides: number;
  radius: number;
};
const useSlideStore = createSelectorFunctions(useSlideSelectedItemsStore);
const checkifWorkFound = (word: string, searchIn: string) => {
  const regex = new RegExp(`\\b${word}\\b`, "i"); // Create a regex pattern to match the word, ignoring case and word boundaries
  const isMatch = regex.test(searchIn); // Test if the word is found in the text
  return !!isMatch;
};

const ExportIcon = () => {
  const { stageDataList } = useStageDataList();
  const {
    stage: { stageRef },
  } = usePresentation();

  const calculateRelativePositions = (attrs: Record<string, any>) => {
    const canvaswidth1 = stageRef.current.width();
    const canvasHeight1 = stageRef.current.height();
    const {
      scaleX = 1,
      scaleY = 1,
      x,
      y,
      shape_name,
      clientX = 0,
      clientY = 0,
    } = attrs;
    const childww = (attrs.width / canvaswidth1) * 100;
    const childhh = (attrs.height / canvasHeight1) * 100;
    let relativew = ((childww / 100) * canvasslideWidth) / 96;
    let relativeh = ((childhh / 100) * canvasslideHeight) / 96;

    const type = attrs["data-item-type"];
    let xx = type !== "shape" ? x : clientX || x;
    let yy = type !== "shape" ? y : clientY || y;
    let newX = (xx / canvaswidth1) * 100;
    let newy = (yy / canvasHeight1) * 100;
    newX = ((newX / 100) * canvasslideWidth) / 96;
    newy = ((newy / 100) * canvasslideHeight) / 96;
    const relWidth = relativew * scaleX * scaleY + 0.1;
    const extra = 10 - (relWidth + newX);
    newX = extra < 0 ? newX + extra : newX;
    return {
      eleHeight: relativeh,
      eleWidth: relativew,
      type,
      shape_name,
      newX,
      newy,
      relWidth,
    };
  };
  const addImageToSlide = (
    slide: PptxGenJS.Slide,
    options: Record<string, any> = {},
    attrs: Record<string, any>
  ) => {
    const { src } = attrs;
    slide.addImage({
      ...options,
      path: src,
    });
  };
  const addTextToSlide = (
    slide: PptxGenJS.Slide,
    options: Record<string, any>,
    attrs?: Record<string, any>
  ) => {
    const newOptions = { ...options };
    const { fill, text, ...rest } = newOptions;

    const newFill = fill?.slice(1);
    rest.color = newFill;
    slide.addText(text, rest);
  };
  const addShapteToSlide = (
    slide: PptxGenJS.Slide,
    options: Record<string, any> = {},
    shapes: Record<string, any>,
    attrs: Record<string, any>
  ) => {
    let {
      h: eleHeight,
      w: eleWidth,
      x: newX,
      y: newy,
      sides,
      id = "",
      fill,
      rotation,
    } = options;
    let { x, y, shape_name } = attrs;
    if (sides !== 4) {
      const canvaswidth1 = stageRef.current.width();
      const canvasHeight1 = stageRef.current.height();
      const poligon = shapes[id];
      if (poligon) {
        eleHeight =
          ((poligon?.clientrect?.height || attrs.height) / canvasHeight1) * 100;
        eleHeight = ((eleHeight / 100) * canvasslideHeight) / 96;
        eleWidth =
          ((poligon?.clientrect?.width || attrs.width) / canvaswidth1) * 100;
        eleWidth = ((eleWidth / 100) * canvasslideWidth) / 96;
        newX = ((poligon?.clientrect?.x || x) / canvaswidth1) * 100;
        newX = ((newX / 100) * canvasslideWidth) / 96;
        newy = ((poligon?.clientrect?.y || y) / canvasHeight1) * 100;
        newy = ((newy / 100) * canvasslideHeight) / 96;
      }
    }
    slide.addShape(shape_name, {
      ...options,
      fill,

      x: newX,
      y: newy,
      w: eleWidth,
      h: eleHeight,
      rotate: rotation,
    });
  };
  const onExport = () => {
    const layers = stageDataList.stageList;
    const keys = Object.keys(stageDataList.stageList || {});

    const pptx = new PptxGenJS();
    pptx.layout = "LAYOUT_16x9";
    // pptx.theme = { headFontFace: "Arial Light" };
    // pptx.theme = { bodyFontFace: "Arial" };
    // pptx.defineLayout({ name: "A3", width: 16.5, height: 11.7 });

    pptx.defineSlideMaster({
      background: {
        color: "#000000",
      },
      title: "MASTER_SLIDE",
    });
    keys.forEach((key, i) => {
      const slide = pptx.addSlide({
        sectionTitle: "",
        masterName: "MASTER_SLIDE",
      });
      const layer = layers[key];
      const stagShapes = stageRef.current.getLayers();
      const shapes: any = {};

      stagShapes.forEach((sh) => {
        sh.children?.forEach((ch) => {
          if (ch.attrs["data-item-type"] === "shape") {
            shapes[ch.attrs.id] = {
              clientrect: ch.getClientRect(),
              abposition: ch.getAbsolutePosition(),
              w: ch.width(),
              h: ch.height(),
              st: stageRef.current.width(),
              ww: window.innerWidth,
            };
          }
        });
      });
      layer?.slide_design?.forEach((child, i) => {
        let { eleHeight, eleWidth, newX, newy } = calculateRelativePositions(
          child.attrs || {}
        );
        const {
          fontSize,
          fontFamily,
          fill,

          opacity,
          rotation,
          scaleX = 1,
          scaleY = 1,
          verticalAlign,

          text,
          align = "left",
          fontWeight,

          textDecoration = "",
          fontStyle,

          color = "ffffff",
          url,
          src,
          id,
          sides,
        } = child.attrs;
        const type = child.attrs["data-item-type"];
        const newOpts: any = {
          x: newX,
          y: newy,
          w: eleWidth * scaleX * scaleY + 0.2,
          // w: relativew,
          h: eleHeight * 1.2,
          fontSize: Math.round(fontSize * 0.52),
          // fontSize: fontSize * scaleX * scaleY * 0.75,
          align: align,
          fontFamily: fontFamily,
          opacity,
          scaleX,
          scaleY,
          verticalAlign,
          rotation,
          isTextBox: true,
          resize: true,
          autoFit: true,
          underline: checkifWorkFound("underline", textDecoration),
          italic: checkifWorkFound("italic", fontStyle),
          bold: checkifWorkFound("bold", fontStyle),
          fontStyle,
          fontWeight,
          strike: checkifWorkFound("line-through", textDecoration),
          color,
          sides,
          id,
          text,
        };

        if (type === "image") {
          addImageToSlide(
            slide,
            {
              path: src,
              x: newX,
              y: newy,
              w: eleWidth,
              h: eleHeight,
              rotate: rotation,
            },
            child.attrs
          );
        } else if (type === "text") {
          addTextToSlide(slide, { ...newOpts, fill });
        } else if (type === "shape") {
          addShapteToSlide(
            slide,
            {
              ...newOpts,
              fill,

              x: newX,
              y: newy,
              w: eleWidth,
              h: eleHeight,
              rotate: rotation,
            },
            shapes,
            child.attrs
          );
        } else if (type === "link") {
          slide.addText(
            [
              {
                text: text,
                options: {
                  hyperlink: {
                    url: url,
                    tooltip: text,
                  },
                },
              },
            ],
            { ...newOpts }
          );
        }
      });
    });

    pptx.writeFile({ fileName: "sampleexample.pptx" });
  };

  return (
    <MenuList>
      <ListItem onClick={onExport}>
        <ListItemIcon className={""}>
          <FileDownload sx={{ width: "16px" }} />
        </ListItemIcon>
      </ListItem>
    </MenuList>
  );
};
const MenuListing = () => {
  const [uploading, setUploading] = useState(false);
  const { stage } = usePresentation();
  const selectedAccount = useStore((state) => state.selectedAccount);
  const accountId = selectedAccount?.slug;
  const store = useSlideStore();
  const selecteditems = store?.currentSelectedItems?.[0]?.attrs;
  const [defaultStyle, setDefaultStyle] = React.useState({
    fontFamily: "serif",
    fontSize: 0,
    fill: "#ffffff",
    align: "left",
    isLineThrough: false,
    isUnderline: false,
    isItalic: false,
    isBold: false,
  });
  const { removeCanvasItem } = useItem();
  useEffect(() => {
    setDefaultStyle((prevStyle) => ({
      ...prevStyle,
      fontSize: selecteditems?.fontSize || prevStyle.fontSize,
      align: selecteditems?.align || prevStyle.align,
      fontFamily: selecteditems?.fontFamily || prevStyle.fontFamily,
      fill: selecteditems?.fill || prevStyle.fill,
      isLineThrough:
        selecteditems?.textDecoration?.includes("line-through") || false,
      isUnderline:
        selecteditems?.textDecoration?.includes("underline") || false,
      isItalic: selecteditems?.fontStyle?.includes("italic") || false,
      isBold: selecteditems?.fontStyle?.includes("bold") || false,
    }));
  }, [selecteditems]);
  const { onUpdateStyle, onToggleFontStyle, onResetStyle, onToggleFontWeight } =
    useStyleSelector();

  const { onAddItem } = useAddTool(stage.stageRef);

  function increment() {
    if (defaultStyle.fontSize < 100) {
      setDefaultStyle((pre) => {
        return { ...pre, fontSize: defaultStyle.fontSize + 1 };
      });
    }
  }

  function decrement() {
    if (defaultStyle.fontSize > 0) {
      setDefaultStyle((pre) => {
        return { ...pre, fontSize: defaultStyle.fontSize - 1 };
      });
    }
  }
  const loadImage = (file: any) => {
    return new Promise((res, rej) => {
      const img = new Image();
      img.src = file.src;
      img.onload = (ev) => {
        const width = 200;
        const height = img.height > 0 ? width * (img.height / img.width) : 200;
        return res({
          type: "image",
          id: nanoid(),
          src: file.src,
          width,
          height,
          name: file.name,
        });
      };
      img.onerror = () => {
        return res({
          type: "image",
          id: nanoid(),
          src: file.src,
          width: 200,
          height: 200,
          name: file.name,
        });
      };
    });
  };
  const uploadImage = (onCallBack: any) => {
    const file = document.createElement("input");
    file.type = "file";
    file.accept = "image/png, image/jpeg";
    file.onchange = (e) => {
      const event = e;
      if (event.target && (event.target as HTMLInputElement).files) {
        Object.values((event.target as HTMLInputElement).files!).forEach(
          (file) => {
            setUploading(true);
            const nameChunks = file.name.split(".");
            const extension = nameChunks.pop();
            const name = nameChunks.join(".");
            const key = `${name}-${v4()}.${extension}`;
            upload({ file, filename: key })
              .then(() => {
                const url = `${S3_CLOUD_FRONT_URL}/${accountId}/uploads/${key}`;
                loadImage({ ...file, src: url }).then((data: any) => {
                  onCallBack(data);
                });
              })
              .finally(() => {
                setUploading(false);
              });
          }
        );
      }
    };
    file.click();
  };
  const handleUPloadImage = (e: any) => {
    return uploadImage((imgData: any) => {
      let width;
      let height;
      if (imgData.width > imgData.height) {
        width = decimalUpToSeven(200);
        height = decimalUpToSeven(width * (imgData.height / imgData.width));
      } else {
        height = decimalUpToSeven(200);
        width = decimalUpToSeven(height * (imgData.width / imgData.height));
      }

      onAddItem({ trigger: Trigger.INSERT.IMAGE, ...imgData }, e);
    });
  };
  const HyperLink = (props: any) => {
    const [hyperLinkValue, setHyperLinkValue] = useState({
      name: "",
      url: "",
    });
    const { handleClose } = props;
    const handleChange = (e: any, field: string) => {
      setHyperLinkValue((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };
    const handleAddLink = () => {
      onAddItem({ trigger: Trigger.INSERT.LINK }, hyperLinkValue);
      handleClose();
    };

    return (
      <PopUpWrapper>
        <TextField
          size="small"
          variant="filled"
          placeholder="Name"
          value={hyperLinkValue.name}
          onChange={(e) => handleChange(e, "name")}
        />
        <TextField
          size="small"
          variant="filled"
          placeholder="URL"
          value={hyperLinkValue.url}
          onChange={(e) => handleChange(e, "url")}
        />
        <Button variant="contained" onClick={handleAddLink}>
          Add Link
        </Button>
      </PopUpWrapper>
    );
  };
  const onDeleteSlideItem = (id: string) => {
    removeCanvasItem(id);
  };

  const ShapeItems = (props: any) => {
    return (
      <>
        {shapes.map((shape: SHAPETYPE) => {
          return (
            <MenuItem
              onClick={() => {
                onAddItem({ trigger: Trigger.INSERT.SHAPE, ...shape }, shape);
                props.handleClose();
              }}
              key={shape?.id}
            >
              {shape.icon}
            </MenuItem>
          );
        })}
      </>
    );
  };
  return (
    <>
      <MenuListWrapper>
        <MenuList>
          <ListItem>
            <AccountMenu
              DropDown={
                <Button
                  className="popup-opener"
                  aria-label="account of current user"
                  aria-haspopup="true"
                >
                  <AddOutlinedIcon />
                  <ArrowDropDown />
                </Button>
              }
            />
          </ListItem>
        </MenuList>
        <Divider orientation="vertical" />
        <MenuList>
          <UndoRedo />
          <ListItem>
            <AccountMenu
              DropDown={
                <Button
                  className="popup-opener"
                  aria-label="account of current user"
                  aria-haspopup="true"
                >
                  <ZoomInIcon />
                  <ArrowDropDown />
                </Button>
              }
            />
          </ListItem>
        </MenuList>
        <Divider orientation="vertical" />
        <MenuList>
          <ListItem>
            <ListItemIcon>
              <MouseArrow sx={{ width: "12px" }} />
            </ListItemIcon>
          </ListItem>
          <ListItem
            onClick={(e) => onAddItem({ trigger: Trigger.INSERT.TEXT }, e)}
          >
            <ListItemIcon>
              <FormatShapesIcon sx={{ width: "20px" }} />
            </ListItemIcon>
          </ListItem>
          <ListItem onClick={(e) => handleUPloadImage(e)}>
            <ListItemIcon>
              <ImageIcon sx={{ width: "20px" }} />
            </ListItemIcon>
          </ListItem>
          <ListItem>
            <AccountMenu
              DropDown={
                <Button
                  className="popup-opener"
                  aria-label="account of current user"
                  aria-haspopup="true"
                >
                  <Shapes sx={{ width: "16px" }} />
                  <ArrowDropDown />
                </Button>
              }
              component={<ShapeItems />}
            />
          </ListItem>
          <ListItem>
            <AccountMenu
              DropDown={
                <Button
                  className="popup-opener"
                  aria-label="account of current user"
                  aria-haspopup="true"
                >
                  <LinearScale />
                  <ArrowDropDown />
                </Button>
              }
            />
          </ListItem>
        </MenuList>
        <Divider orientation="vertical" />
        <MenuList>
          <ListItem>
            <SelectFont
              sx={{
                boxShadow: "none",
                ".MuiOutlinedInput-notchedOutline": { border: 0 },
              }}
              defaultValue={"serif"}
              value={defaultStyle.fontFamily}
              onChange={(event: any) => {
                onUpdateStyle({
                  key: "fontFamily",
                  value: event?.target?.value,
                });
                setDefaultStyle((pre) => {
                  return { ...pre, fontFamily: event?.target?.value };
                });
              }}
            >
              {fonts.map(({ fontFamily }: { fontFamily: string }) => {
                const family = fontFamily?.match(/^'(.+?)'/)?.[1] || "";
                return (
                  <MenuItem
                    value={family ? fontFamily?.split(/,\s*/)[1] : fontFamily}
                    key={`${fontFamily}`}
                  >
                    {family ? family : fontFamily}
                  </MenuItem>
                );
              })}
            </SelectFont>
          </ListItem>
        </MenuList>
        <Divider orientation="vertical" />
        <MenuList>
          <ListItem>
            <FontSize size="small" aria-label="small outlined button group">
              <Button
                onClick={() => {
                  decrement();
                  onUpdateStyle({
                    key: "fontSize",
                    value: defaultStyle.fontSize,
                  });
                }}
              >
                <RemoveOutlinedIcon />
              </Button>
              <Input
                type="number"
                value={defaultStyle.fontSize}
                onChange={(event) => {
                  const value = parseInt(event.target.value.replace(/^0+/, ""));
                  if (value > 100) {
                    return;
                  }
                  setDefaultStyle((pre) => {
                    return { ...pre, fontSize: value };
                  });
                  onUpdateStyle({
                    key: "fontSize",
                    value: value,
                  });
                }}
              />
              <Button
                onClick={() => {
                  increment();
                  onUpdateStyle({
                    key: "fontSize",
                    value: defaultStyle.fontSize,
                  });
                }}
              >
                <AddOutlinedIcon />
              </Button>
            </FontSize>
          </ListItem>
        </MenuList>
        <Divider orientation="vertical" />
        <MenuList>
          <ListItem
            onClick={() => {
              onToggleFontWeight({
                key: "fontStyle",
                value: "bold",
              });
              setDefaultStyle((pre) => {
                return { ...pre, isBold: !defaultStyle.isBold };
              });
            }}
          >
            <ListItemIcon
              className={`${defaultStyle.isBold ? "isActive" : ""}`}
            >
              <FormatBoldOutlinedIcon sx={{ width: "16px" }} />
            </ListItemIcon>
          </ListItem>
        </MenuList>
        <MenuList>
          <ListItem
            onClick={() => {
              onToggleFontWeight({
                key: "fontStyle",
                value: "italic",
              });
              setDefaultStyle((pre) => {
                return { ...pre, isItalic: !defaultStyle.isItalic };
              });
            }}
          >
            <ListItemIcon
              className={`${defaultStyle.isItalic ? "isActive" : ""}`}
            >
              <FormatItalicOutlinedIcon sx={{ width: "16px" }} />
            </ListItemIcon>
          </ListItem>
        </MenuList>
        <MenuList>
          <ListItem
            onClick={() => {
              onToggleFontStyle({
                key: "textDecoration",
                value: "line-through",
              });
              setDefaultStyle((pre) => {
                return { ...pre, isLineThrough: !defaultStyle.isLineThrough };
              });
            }}
          >
            <ListItemIcon
              className={`${defaultStyle.isLineThrough ? "isActive" : ""}`}
            >
              <FormatStrikethroughOutlinedIcon sx={{ width: "16px" }} />
            </ListItemIcon>
          </ListItem>
        </MenuList>
        <MenuList>
          <ListItem
            onClick={() => {
              onToggleFontStyle({
                key: "textDecoration",
                value: "underline",
              });
              setDefaultStyle((pre) => {
                return { ...pre, isUnderline: !defaultStyle.isUnderline };
              });
            }}
          >
            <ListItemIcon
              className={`${defaultStyle.isUnderline ? "isActive" : ""}`}
            >
              <FormatUnderlinedOutlinedIcon sx={{ width: "16px" }} />
            </ListItemIcon>
          </ListItem>
        </MenuList>
        <MenuList>
          <ListItem>
            <ColorPickerHolder
              onChange={(value) => {
                onUpdateStyle({
                  key: "fill",
                  value: value as string,
                });
                setDefaultStyle((pre) => {
                  return { ...pre, fill: value as string };
                });
              }}
              // defaultValue={defaultStyle.fill}
              color={defaultStyle.fill}
            />
          </ListItem>
        </MenuList>

        <Divider orientation="vertical" />
        <MenuList>
          <ListItem>
            <AccountMenu
              DropDown={
                <Button
                  className="popup-opener"
                  aria-label="account of current user"
                  aria-haspopup="true"
                >
                  <InsertLinkOutlinedIcon sx={{ width: "16px" }} />
                </Button>
              }
              component={<HyperLink />}
            />
          </ListItem>
        </MenuList>
        <MenuList>
          <ListItem>
            <ListItemIcon>
              <AddCommentOutlinedIcon sx={{ width: "16px" }} />
            </ListItemIcon>
          </ListItem>
        </MenuList>
        <Divider orientation="vertical" />
        <MenuList>
          <ListItem>
            <SelectIndent
              sx={{
                boxShadow: "none",
                ".MuiOutlinedInput-notchedOutline": { border: 0 },
              }}
              defaultValue={"left"}
              value={defaultStyle.align}
              onChange={(event: any) => {
                //   const key = event?.target?.value?.split("-");
                onUpdateStyle({
                  key: "align",
                  value: event?.target?.value,
                });
              }}
            >
              {fontAlign.map(
                ({ icon, value }: { icon: React.ReactNode; value: string }) => {
                  return (
                    <MenuItem key={value} value={value}>
                      {icon}
                    </MenuItem>
                  );
                }
              )}
            </SelectIndent>
          </ListItem>
        </MenuList>
        <MenuList>
          <ListItem>
            <ListItemIcon>
              <FormatListBulletedOutlinedIcon sx={{ width: "16px" }} />
            </ListItemIcon>
          </ListItem>
        </MenuList>
        <MenuList>
          <ListItem>
            <ListItemIcon>
              <FormatListNumberedOutlinedIcon sx={{ width: "16px" }} />
            </ListItemIcon>
          </ListItem>
        </MenuList>
        <MenuList>
          <ListItem>
            <ListItemIcon>
              <FormatIndentDecreaseOutlinedIcon sx={{ width: "16px" }} />
            </ListItemIcon>
          </ListItem>
        </MenuList>
        <MenuList>
          <ListItem>
            <ListItemIcon>
              <FormatIndentIncreaseOutlinedIcon sx={{ width: "16px" }} />
            </ListItemIcon>
          </ListItem>
        </MenuList>
        <MenuList>
          <ListItem onClick={() => onResetStyle(stage.stageRef)}>
            <ListItemIcon>
              <FormatClearOutlinedIcon sx={{ width: "16px" }} />
            </ListItemIcon>
          </ListItem>
        </MenuList>
        <Divider orientation="vertical" />
        <MenuList>
          <ListItem
            onClick={() => {
              if (!!selecteditems?.id) onDeleteSlideItem(selecteditems?.id);
            }}
          >
            <ListItemIcon>
              <DeleteOutlineOutlinedIcon sx={{ width: "16px" }} />
            </ListItemIcon>
          </ListItem>
        </MenuList>
        <ExportIcon />
        <MenuList>
          <ListItem>
            <ListItemIcon>
              <MoreVertOutlinedIcon sx={{ width: "16px" }} />
            </ListItemIcon>
          </ListItem>
        </MenuList>
      </MenuListWrapper>
      {uploading ? (
        <SpinnerOverly>
          <CircularProgress />
        </SpinnerOverly>
      ) : null}
    </>
  );
};
export default MenuListing;
