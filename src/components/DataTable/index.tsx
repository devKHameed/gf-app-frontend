import { json } from "@codemirror/lang-json";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Crop32Icon from "@mui/icons-material/Crop32";
import DataObjectIcon from "@mui/icons-material/DataObject";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import EditOutlined from "@mui/icons-material/EditOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import FormatAlignLeftOutlined from "@mui/icons-material/FormatAlignLeftOutlined";
import InsertDriveFileOutlined from "@mui/icons-material/InsertDriveFileOutlined";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PhotoOutlinedIcon from "@mui/icons-material/PhotoOutlined";
import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined";
import StarHalfOutlinedIcon from "@mui/icons-material/StarHalfOutlined";
import TagIcon from "@mui/icons-material/Tag";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import {
  Avatar,
  AvatarGroup,
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  Rating,
  Slider,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { DatePicker, DateTimePicker, TimePicker } from "@mui/x-date-pickers";
import Checklist from "assets/icons/Checklist";
import ClockLoader from "assets/icons/ClockLoader";
import CodeEditor from "components/CodeEditor";
import ColorPicker from "components/ColorPicker";
import BaseCheckboxList from "components/Form/BaseCheckboxList";
import AccountTypeDataProvider from "components/Form/DataProviders/AccountTypeDataProvider";
import AccountUserDataProvider from "components/Form/DataProviders/AccountUserDataProvider";
import {
  CodeEditorWrap,
  SelectWrapper,
} from "components/Form/DynamicEditFields";
import FormFieldTooltipWrapper from "components/Form/FormFieldTooltipWrapper";
import FormFieldWrapper from "components/Form/FormFieldWrapper";
import { getAcceptedFileTypes } from "components/Form/helper";
import TooltipSelector from "components/Form/TooltipSelector";
import Scrollbar from "components/Scrollbar";
import FileUploader from "components/Uploader";
import { DateType, DocumentElementType } from "enums/Form";
import { isArray } from "lodash";
import moment from "moment";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { getNameInitial, stringToColor } from "utils";

export type BaseItemType = { _id: string; [key: string]: unknown };

type Props<T extends BaseItemType> = {
  items: T[];
  name: string;
  fields: DataField[];
  formSubmit?: boolean;
  tableActions?: React.ReactNode;
  rowActions?: React.ReactNode | ((index: number, item: T) => React.ReactNode);
  paginationViewOnly?: boolean;
  disableInlineEdit?: boolean;
  pagination?: boolean;
  className?: string;
  getColumnTitle?: (field: DataField, index: number) => React.ReactNode;
  onAddClick?(): void;
  onEditClick?(index: number, data: T): void;
  onDeleteClick?(index: number, data: T): void;
  onEditSubmit?(index: number, data: T): void;
};

type TableFieldProps = {
  // item: { _id: string; [key: string]: unknown };
  field: DataField;
  namePrefix: string;
  formSubmit?: boolean;
  onSubmit?(name: string, value: unknown): void;
  disableInlineEdit?: boolean;
};

export const TableContainerWrap = styled(TableContainer)(({ theme }) => ({
  [`${theme.breakpoints.down("sm")}`]: {
    marginBottom: "15px",
  },
}));

export const TableSecondary = styled(Table)(({ theme }) => ({
  ".MuiTableCell-head": {
    padding: "0 5px 0 0",
    minHeight: "40px",
    borderBottom: "none",
  },

  ".MuiTableBody-root": {
    ".MuiTableCell-body": {
      minHeight: "40px",
      padding: "5px 5px 5px 8px",
      boxSizing: "border-box",
      background: theme.palette.background.TableBG,
      borderBottomColor: theme.palette.background.ContentArea,
    },

    ".MuiTableRow-root": {
      ".MuiTableCell-root": {
        color: theme.palette.background.GF60,
        "&:first-child": {
          paddingLeft: "15px",
        },
        "&:last-child": {
          paddingLeft: "0",
        },
      },
      "&:first-child": {
        ".MuiTableCell-root": {
          "&:first-child": {
            borderRadius: "8px 0 0 0",
          },

          "&:last-child": {
            borderRadius: "0 8px 0 0",
          },
        },
      },
      "&:last-child": {
        ".MuiTableCell-root": {
          "&:first-child": {
            borderRadius: "0 0 0 8px",
          },

          "&:last-child": {
            borderRadius: "0 0 8px 0",
          },
        },
      },
    },
  },

  ".MuiTablePagination-root": {
    border: "none",
  },
}));

const HorizontalDots = styled(Box)(({ theme }) => ({
  background: theme.palette.background.TableCustomBG,
  width: "16px",
  minWidth: "16px",
  height: "16px",
  borderRadius: "4px",
  marginLeft: "10px",
  color: theme.palette.text.primary,

  svg: {
    width: "100%",
    height: "auto",
    display: "block",
  },
}));

const ArrowIcon = styled(ArrowRightIcon)(({ theme }) => ({
  width: "20px",
  height: "20px",
  color: theme.palette.background.GF20,
  display: "inline-block",
  verticalAlign: "middle",
  margin: "-2px 0 0 -5px",
}));

const UserTypeWrap = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexWrap: "nowrap",
  whiteSpace: "nowrap",

  p: {
    fontSize: "14px",
    lineHeight: "20px",
    "&:not(:first-child)": {
      marginLeft: "4px",
    },
  },
}));

const Counter = styled(Box)(({ theme }) => ({
  minWidth: "22px",
  height: "22px",
  display: "inline-block",
  verticalAlign: "top",
  borderRadius: "4px",
  background: theme.palette.background.TableCustomBG,
  color: theme.palette.text.primary,
  fontSize: "13px",
  fontWeight: "600",
  textAlign: "center",
  marginLeft: "10px",
}));

const BoxRating = styled(Box)(({ theme }) => ({
  ".MuiRating-iconFilled": {
    color: theme.palette.text.primary,
  },
}));

const MediaBox = styled(Stack)(({ theme }) => ({}));
const FileBox = styled(Stack)(({ theme }) => ({}));
const TextBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  whiteSpace: "nowrap",
}));

const AvatarBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  ".MuiAvatarGroup-root ": {
    alignItems: "center",
    margin: 0,
  },
  ".MuiAvatar-root": {
    width: "26px",
    height: "26px",
    marginLeft: "-12px",
  },

  ".MuiAvatar-colorDefault": {
    marginLeft: "10px !important",
    width: "auto",
    minWidth: "22px",
    height: "22px",
    background: theme.palette.background.TableCustomBG,
    color: theme.palette.text.primary,
    fontSize: "13px",
    lineHeight: "16px",
    textAlign: "center",
    borderRadius: "4px",
  },
}));

const ProgressBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",

  ".MuiLinearProgress-root ": {
    height: "14px",
    borderRadius: "4px",
    flexGrow: "1",
    flexBasis: "0",
    minWidth: "0",
    background: theme.palette.background.GF10,
  },

  ".MuiLinearProgress-bar ": {
    background: theme.palette.background.GF20,
  },

  ".MuiTypography-body2": {
    fontSize: "13px",
    marginLeft: "14px",
  },
}));

const TablePaginationWrap = styled(TablePagination)(({ theme }) => ({
  ".MuiSelect-select": {
    background: theme.palette.background.GF5,
    padding: "10px 18px 10px 43px !important",
    borderRadius: "6px",
  },

  ".MuiTablePagination-selectIcon": {
    position: "absolute",
    left: "8px",
    right: "auto",
  },

  ".MuiInputBase-root ": {
    marginLeft: "0",
    marginRight: "5px",
  },

  ".MuiButtonBase-root": {
    width: "26px",
    height: "26px",
    borderRadius: "4px",
    fontSize: "16px",
    lineHeight: "24px",
    padding: "1px 2px",
    textAlign: "center",
    marginLeft: "8px",
    color: theme.palette.background.GF40,

    "&:hover:not(.Mui-disabled)": {
      background: theme.palette.background.GF20,
    },
  },

  ".MuiToolbar-root": {
    padding: "20px 0 10px",
    justifyContent: "space-between",
  },

  ".MuiTablePagination-selectLabel": {
    display: "none",
  },

  ".MuiTablePagination-spacer": {
    display: "none",
  },

  ".MuiTablePagination-displayedRows": {
    display: "none",
  },
}));

const CodeIcon = styled(Box)(({ theme }) => ({
  svg: {
    width: "16px",
    height: "auto",
    display: "inline-block",
    verticalAlign: "middle",
  },
}));

const ArrowButton = styled(IconButton)(({ theme }) => ({
  background: theme.palette.background.GFRightNavForeground,
  "&.Mui-disabled": {
    background: theme.palette.background.GF5,
    color: theme.palette.common.whiteshades?.["30p"],
  },
}));

const PaginationButton = styled(IconButton)(({ theme }) => ({
  "&.Mui-disabled": {
    background: theme.palette.background.GF20,
    color: theme.palette.background.GF80,
  },
}));

const DefaultCellContainer = styled(Box)({
  textAlign: "center",
});

const EmptyTableRow = styled(TableRow)({
  ".MuiTableCell-root": {
    background: "none !important",
  },
});

export const DefaultCell: React.FC<{ type: DocumentElementType }> = (props) => {
  const { type } = props;

  switch (type) {
    case DocumentElementType.TextArea:
      return <Crop32Icon />;
    case DocumentElementType.User:
      return <AccountBoxOutlinedIcon />;
    case DocumentElementType.UserType:
      return <BadgeOutlinedIcon />;
    case DocumentElementType.Select:
    case DocumentElementType.Radio:
    case DocumentElementType.Checkbox:
      return <Checklist />;
    case DocumentElementType.Rating:
      return <StarHalfOutlinedIcon />;
    case DocumentElementType.AudioVideo:
      return <PlayCircleOutlinedIcon />;
    case DocumentElementType.Image:
      return <PhotoOutlinedIcon />;
    case DocumentElementType.File:
      return <InsertDriveFileOutlined />;
    case DocumentElementType.Progress:
      return <ClockLoader />;
    case DocumentElementType.CodeEditor:
      return <DataObjectIcon />;
    case DocumentElementType.Number:
      return <TagIcon />;
    case DocumentElementType.Date:
      return <CalendarTodayIcon />;
    default:
      return <TextFieldsIcon />;
  }
};

type TableCellElementProps = {
  field: DataField;
} & (
  | {
      type: DocumentElementType.User;
      value: string | string[];
    }
  | {
      type: DocumentElementType.UserType;
      value: string | string[];
    }
  | {
      type: DocumentElementType.Select | DocumentElementType.Checkbox;
      value: string[] | string;
    }
  | {
      type:
        | DocumentElementType.Rating
        | DocumentElementType.Progress
        | DocumentElementType.Number;
      value: number;
    }
  | {
      type: DocumentElementType.AudioVideo;
      value:
        | { url: string; name: string; thumb: string }
        | { url: string; name: string; thumb: string }[];
    }
  | {
      type: DocumentElementType.Image | DocumentElementType.File;
      value: { url: string; name: string } | { url: string; name: string }[];
    }
  | {
      type:
        | DocumentElementType.TextArea
        | DocumentElementType.TextField
        | DocumentElementType.CodeEditor
        | DocumentElementType.Label
        | DocumentElementType.Date
        | DocumentElementType.Color
        | DocumentElementType.Radio
        | DocumentElementType.Boolean;
      value: string;
    }
);

const TableCellElement: React.FC<TableCellElementProps> = (props) => {
  const { value, field, type } = props;

  if (!value || (isArray(value) && value.length === 0)) {
    return (
      <DefaultCellContainer>
        <DefaultCell type={type} />
      </DefaultCellContainer>
    );
  }

  switch (type) {
    case DocumentElementType.TextArea:
    case DocumentElementType.TextField:
      return (
        <TextBox>
          <>
            {`${value}`.slice(0, 30)}
            {`${value}`.length > 30 && (
              <Tooltip
                title={
                  <Typography variant="body2">{value as string}</Typography>
                }
                arrow
                slotProps={{
                  tooltip: {
                    sx: { maxWidth: 300 },
                  },
                }}
              >
                <HorizontalDots>
                  <MoreHorizIcon />
                </HorizontalDots>
              </Tooltip>
            )}
          </>
        </TextBox>
      );
    case DocumentElementType.User:
      const users = isArray(value) ? value : [value];
      return (
        <AvatarBox>
          <AvatarGroup
            sx={{ margin: "auto" }}
            max={users.slice(0, 4).length || 0}
          >
            {users.slice(0, 4).map((v, idx, arr) => (
              <Avatar
                sx={{
                  backgroundColor: stringToColor(v),
                }}
                // src={v.url}
              >
                {getNameInitial(v)}
              </Avatar>
            ))}
          </AvatarGroup>
          {users.length > 4 && (
            <Tooltip
              componentsProps={{
                tooltip: {
                  sx: {
                    padding: 0,
                  },
                },
              }}
              title={
                <Scrollbar autoHeight autoHeightMax={200}>
                  <List sx={{ padding: "0" }}>
                    {users.map((v) => (
                      <ListItem>
                        <ListItemAvatar
                          sx={{
                            width: "auto",
                            minWidth: "auto",
                            marginRight: "8px",
                          }}
                        >
                          <Avatar
                            sx={{
                              backgroundColor: stringToColor(v),
                              height: "24px",
                              width: "24px",
                              fontSize: "14px",
                            }}
                            // src={v.image}
                          >
                            {getNameInitial(v)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography variant="body2">{v}</Typography>}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Scrollbar>
              }
              arrow
            >
              <Counter>+{value.length - 4}</Counter>
            </Tooltip>
          )}
        </AvatarBox>
      );
    case DocumentElementType.UserType:
      const userTypes = isArray(value) ? value : [value];
      return (
        <UserTypeWrap>
          {userTypes.slice(0, 3).map((v, idx, arr) => (
            <Typography>
              {v} {idx < arr.length - 1 ? ", " : ""}
            </Typography>
          ))}
          {userTypes.length > 3 && (
            <Tooltip
              componentsProps={{
                tooltip: {
                  sx: {
                    padding: 0,
                  },
                },
              }}
              title={
                <Scrollbar autoHeight autoHeightMax={200}>
                  <List sx={{ padding: "0" }}>
                    {userTypes.map((v) => (
                      <ListItem>
                        <ListItemAvatar
                          sx={{
                            width: "auto",
                            minWidth: "auto",
                            marginRight: "8px",
                          }}
                        >
                          <Avatar
                            sx={{
                              backgroundColor: stringToColor(v),
                              height: "24px",
                              width: "24px",
                              fontSize: "14px",
                            }}
                            variant="square"
                          >
                            {getNameInitial(v)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography variant="body2">{v}</Typography>}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Scrollbar>
              }
              arrow
            >
              <Counter>+{value.length - 3}</Counter>
            </Tooltip>
          )}
        </UserTypeWrap>
      );
    case DocumentElementType.Select:
    case DocumentElementType.Checkbox: {
      const fieldValue = isArray(value) ? value : [value];
      return (
        <UserTypeWrap>
          {fieldValue.slice(0, 3).map((v, idx, arr) => (
            <Typography>
              {v} {idx < arr.length - 1 ? ", " : ""}
            </Typography>
          ))}
          {fieldValue.length > 3 && (
            <Tooltip
              componentsProps={{
                tooltip: {
                  sx: {
                    padding: 0,
                  },
                },
              }}
              title={
                <Scrollbar autoHeight autoHeightMax={150}>
                  <Stack
                    direction="column"
                    spacing={1}
                    justifyContent="flex-start"
                    sx={{ padding: "16px" }}
                  >
                    {fieldValue.map((v) => (
                      <Typography variant="body2">{v}</Typography>
                    ))}
                  </Stack>
                </Scrollbar>
              }
              arrow
            >
              <Counter>+{fieldValue.length - 3}</Counter>
            </Tooltip>
          )}
        </UserTypeWrap>
      );
    }
    case DocumentElementType.Rating:
      return (
        <BoxRating>
          <Rating value={value} readOnly />
        </BoxRating>
      );
    case DocumentElementType.AudioVideo: {
      const videos = isArray(value) ? value : [value];
      return (
        <>
          <MediaBox gap={0.5} direction="row" alignItems="center">
            <Avatar src={videos[0].thumb} variant="rounded" />
            <Typography variant="body2">{videos[0].name}</Typography>
          </MediaBox>
          {videos.length > 1 && (
            <Tooltip
              componentsProps={{
                tooltip: {
                  sx: {
                    padding: 0,
                  },
                },
              }}
              title={
                <Scrollbar autoHeight autoHeightMax={200}>
                  <List sx={{ padding: "0" }}>
                    {videos.map((v) => (
                      <ListItem>
                        <ListItemAvatar
                          sx={{
                            width: "auto",
                            minWidth: "auto",
                            marginRight: "8px",
                          }}
                        >
                          <Avatar
                            sx={{
                              backgroundColor: stringToColor(v.name),
                              height: "24px",
                              width: "24px",
                              fontSize: "14px",
                            }}
                            variant="square"
                            src={v.thumb}
                          >
                            {getNameInitial(v.name)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2">{v.name}</Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Scrollbar>
              }
              arrow
            >
              <Counter>+{videos.length - 1}</Counter>
            </Tooltip>
          )}
        </>
      );
    }
    case DocumentElementType.Image: {
      const images = isArray(value) ? value : [value];
      return (
        <>
          <MediaBox gap={0.5} direction="row" alignItems="center">
            <Avatar src={images[0].url} variant="rounded" />
            <Typography variant="body2">{images[0].name}</Typography>
          </MediaBox>
          {images.length > 1 && (
            <Tooltip
              componentsProps={{
                tooltip: {
                  sx: {
                    padding: 0,
                  },
                },
              }}
              title={
                <Scrollbar autoHeight autoHeightMax={200}>
                  <List sx={{ padding: "0" }}>
                    {images.map((v) => (
                      <ListItem>
                        <ListItemAvatar
                          sx={{
                            width: "auto",
                            minWidth: "auto",
                            marginRight: "8px",
                          }}
                        >
                          <Avatar
                            sx={{
                              backgroundColor: stringToColor(v.name),
                              height: "24px",
                              width: "24px",
                              fontSize: "14px",
                            }}
                            variant="square"
                            src={v.url}
                          >
                            {getNameInitial(v.name)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2">{v.name}</Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Scrollbar>
              }
              arrow
            >
              <Counter>+{images.length - 1}</Counter>
            </Tooltip>
          )}
        </>
      );
    }
    case DocumentElementType.File: {
      const files = isArray(value) ? value : [value];
      return (
        <>
          <FileBox gap={0.5} direction="row" alignItems="center">
            <InsertDriveFileOutlined />
            <Typography variant="body2">{files[0].name}</Typography>
          </FileBox>
          {files.length > 1 && (
            <Tooltip
              componentsProps={{
                tooltip: {
                  sx: {
                    padding: 0,
                  },
                },
              }}
              title={
                <Scrollbar autoHeight autoHeightMax={200}>
                  <List sx={{ padding: "0" }}>
                    {files.map((v) => (
                      <ListItem>
                        <ListItemAvatar
                          sx={{
                            width: "auto",
                            minWidth: "auto",
                            marginRight: "8px",
                          }}
                        >
                          <Avatar
                            sx={{
                              backgroundColor: stringToColor(v.name),
                              height: "24px",
                              width: "24px",
                              fontSize: "14px",
                            }}
                            variant="square"
                            src={v.url}
                          >
                            {getNameInitial(v.name)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2">{v.name}</Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Scrollbar>
              }
              arrow
            >
              <Counter>+{files.length - 1}</Counter>
            </Tooltip>
          )}
        </>
      );
    }
    case DocumentElementType.Progress:
      return (
        <ProgressBox>
          <LinearProgress variant="determinate" value={value} />
          <Typography variant="body2">
            <>{value}%</>
          </Typography>
        </ProgressBox>
      );
    case DocumentElementType.CodeEditor:
      return (
        <CodeIcon>
          {"{"}
          <FormatAlignLeftOutlined />
          {"}"}
        </CodeIcon>
      );
    default:
      return (
        <Box>
          <>{value}</>
        </Box>
      );
  }
};

const TableField: React.FC<TableFieldProps> = (props) => {
  const {
    field: formField,
    namePrefix,
    onSubmit,
    disableInlineEdit,
    ...rest
  } = props;
  const { type, slug, title: label } = formField;
  const name = `${namePrefix}.${slug}`;

  switch (type) {
    case DocumentElementType.TextField:
      return (
        <FormFieldTooltipWrapper
          name={name}
          label={label}
          showBaseLabel={false}
          onSubmit={onSubmit}
          tooltipProps={disableInlineEdit ? { open: false } : {}}
          render={({ field, fieldRef, isBaseElement }) => {
            if (isBaseElement)
              return (
                <TableCellElement
                  field={formField}
                  value={field.value}
                  type={type}
                />
              );
            return (
              <TextField
                {...field}
                inputRef={fieldRef}
                variant="filled"
                size="small"
                hiddenLabel
              />
            );
          }}
          {...rest}
        />
      );
    case DocumentElementType.Number:
      return (
        <FormFieldTooltipWrapper
          name={name}
          label={label}
          showBaseLabel={false}
          onSubmit={onSubmit}
          tooltipProps={disableInlineEdit ? { open: false } : {}}
          render={({ field, fieldRef, isBaseElement }) => {
            if (isBaseElement)
              return (
                <TableCellElement
                  type={type}
                  field={formField}
                  value={field.value}
                />
              );
            return (
              <TextField
                {...field}
                inputRef={fieldRef}
                type="number"
                variant="filled"
                size="small"
                hiddenLabel
              />
            );
          }}
          {...rest}
        />
      );
    case DocumentElementType.Label:
      return (
        <TableCellElement
          type={type}
          field={formField}
          value={label}
          {...rest}
        />
      );
    case DocumentElementType.TextArea:
      return (
        <FormFieldTooltipWrapper
          name={name}
          label={label}
          showBaseLabel={false}
          onSubmit={onSubmit}
          tooltipProps={disableInlineEdit ? { open: false } : {}}
          render={({ field, fieldRef, isBaseElement }) => {
            if (isBaseElement)
              return (
                <TableCellElement
                  field={formField}
                  value={field.value}
                  type={type}
                />
              );
            return (
              <TextField
                {...field}
                rows={2}
                variant="filled"
                hiddenLabel
                multiline
                inputRef={fieldRef}
              />
            );
          }}
          {...rest}
        />
      );
    case DocumentElementType.Color:
      return (
        <FormFieldWrapper
          name={name}
          label={label}
          labelProps={{ sx: { display: "none" } }}
          render={({ field }) => {
            if (disableInlineEdit) {
              return (
                <TableCellElement
                  field={formField}
                  value={field.value}
                  type={type}
                />
              );
            }

            return (
              <ColorPicker
                {...field}
                onChange={(value) => {
                  field.onChange(value);
                  onSubmit?.(name, value);
                }}
              >
                <TableCellElement
                  field={formField}
                  value={field.value}
                  type={type}
                />
              </ColorPicker>
            );
          }}
          {...rest}
        />
      );
    case DocumentElementType.Boolean:
      return (
        <FormFieldWrapper
          name={name}
          label={label}
          labelProps={{ sx: { display: "none" } }}
          render={({ field }) => {
            return (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    onChange={(e) => {
                      if (!disableInlineEdit) {
                        field.onChange(e.target.checked);
                        onSubmit?.(name, e.target.checked);
                      }
                    }}
                  />
                }
                label={label}
              />
            );
          }}
          {...rest}
        />
      );
    case DocumentElementType.Checkbox:
      return (
        <FormFieldTooltipWrapper
          name={name}
          label={label}
          showBaseLabel={false}
          defaultValue={[]}
          onSubmit={onSubmit}
          tooltipProps={disableInlineEdit ? { open: false } : {}}
          render={({ field: { value, onChange, name }, isBaseElement }) => {
            if (isBaseElement) {
              return (
                <TableCellElement type={type} field={formField} value={value} />
              );
            }

            return (
              <BaseCheckboxList
                options={
                  formField.list_items?.map((i) => ({
                    label: i.label,
                    value: i.value,
                  })) || []
                }
                name={name}
                value={value}
                onChange={onChange}
              />
            );
          }}
          {...rest}
        />
      );
    case DocumentElementType.Radio:
      return (
        <FormFieldTooltipWrapper
          name={name}
          label={label}
          showBaseLabel={false}
          onSubmit={onSubmit}
          tooltipProps={disableInlineEdit ? { open: false } : {}}
          render={({ field, isBaseElement }) => {
            const options = formField.list_items || [];

            if (isBaseElement) {
              return (
                <TableCellElement
                  field={formField}
                  value={field.value}
                  type={type}
                />
              );
            }

            return (
              <RadioGroup {...field}>
                {options.map((opt) => {
                  return (
                    <FormControlLabel
                      value={opt.value}
                      control={<Radio />}
                      label={opt.label}
                    />
                  );
                })}
              </RadioGroup>
            );
          }}
          {...rest}
        />
      );
    case DocumentElementType.Select:
      return (
        <FormFieldTooltipWrapper
          name={name}
          label={label}
          showBaseLabel={false}
          onSubmit={onSubmit}
          tooltipProps={disableInlineEdit ? { open: false } : {}}
          render={({ field, fieldRef, isBaseElement }) => {
            const options = formField.list_items || [];
            if (isBaseElement) {
              return (
                <TableCellElement
                  field={formField}
                  value={field.value}
                  type={type}
                />
              );
            }

            return (
              <SelectWrapper
                {...field}
                value={field.value || ""}
                size="small"
                variant="filled"
                id="test"
                defaultOpen
                sx={{
                  minHeight: "40px",
                }}
                MenuProps={{
                  disablePortal: true,
                }}
                inputRef={fieldRef}
              >
                {options.map((opt) => (
                  <MenuItem value={opt.value}>{opt.label}</MenuItem>
                ))}
              </SelectWrapper>
            );
          }}
          {...rest}
        />
      );
    case DocumentElementType.CodeEditor:
      return (
        <CodeEditorWrap
          name={name}
          label={label}
          showBaseLabel={false}
          onSubmit={onSubmit}
          dialogProps={disableInlineEdit ? { open: false } : {}}
          render={({ field, fieldRef, isBaseElement }) => {
            if (isBaseElement) {
              return (
                <TableCellElement
                  field={formField}
                  value={field.value}
                  type={type}
                />
              );
            }

            return (
              <CodeEditor
                {...field}
                height="200px"
                extensions={[json()]}
                ref={(ref) => {
                  if (fieldRef) fieldRef.current = ref?.view;
                }}
              />
            );
          }}
          {...rest}
        />
      );
    case DocumentElementType.Progress:
      return (
        <FormFieldTooltipWrapper
          name={name}
          label={label}
          showBaseLabel={false}
          onSubmit={onSubmit}
          tooltipProps={disableInlineEdit ? { open: false } : {}}
          render={({ field, isBaseElement }) => {
            if (isBaseElement) {
              return (
                <TableCellElement
                  field={formField}
                  value={field.value}
                  type={type}
                />
              );
            }

            return (
              <Slider
                {...field}
                valueLabelDisplay="auto"
                value={field.value || 0}
              />
            );
          }}
          {...rest}
        />
      );
    case DocumentElementType.Image:
    case DocumentElementType.File:
    case DocumentElementType.AudioVideo:
      return (
        <FormFieldTooltipWrapper
          name={name}
          label={label}
          showBaseLabel={false}
          onSubmit={onSubmit}
          tooltipProps={disableInlineEdit ? { open: false } : {}}
          render={({ field: { onChange, value }, isBaseElement }) => {
            if (isBaseElement) {
              return (
                <TableCellElement type={type} field={formField} value={value} />
              );
            }

            return (
              <FileUploader
                title={label}
                files={value}
                onChange={onChange}
                accept={{
                  [getAcceptedFileTypes(
                    DocumentElementType.AudioVideo === type
                      ? formField.file_type ?? "video"
                      : type
                  )]: [],
                }}
              />
            );
          }}
          {...rest}
        />
      );
    case DocumentElementType.Date:
      return (
        <FormFieldWrapper
          name={name}
          label={label}
          labelProps={{ sx: { display: "none" } }}
          render={({ field }) => {
            if (disableInlineEdit) {
              return (
                <TableCellElement
                  field={formField}
                  value={field.value}
                  type={type}
                />
              );
            }

            if (formField.date_type === DateType.DateOnly) {
              return (
                <DatePicker
                  value={moment(field.value)}
                  onChange={(value) => {
                    field.onChange(value?.format());
                    onSubmit?.(name, value?.format());
                  }}
                  renderInput={(params) => (
                    <Box {...(params as any)}>
                      <TableCellElement
                        type={type}
                        field={formField}
                        value={field.value as string}
                      />
                    </Box>
                  )}
                />
              );
            }

            if (formField.date_type === DateType.TimeOnly)
              return (
                <TimePicker
                  value={moment(field.value)}
                  onChange={(value) => {
                    field.onChange(value);
                    onSubmit?.(name, value);
                  }}
                  renderInput={(params) => (
                    <Box {...(params as any)}>
                      <TableCellElement
                        type={type}
                        field={formField}
                        value={field.value as string}
                      />
                    </Box>
                  )}
                />
              );
            return (
              <DateTimePicker
                value={moment(field.value)}
                onChange={(value) => {
                  field.onChange(value);
                  onSubmit?.(name, value);
                }}
                renderInput={(params) => (
                  <Box {...(params as any)}>
                    <TableCellElement
                      type={type}
                      field={formField}
                      value={field.value as string}
                    />
                  </Box>
                )}
              />
            );
          }}
          {...rest}
        />
      );
    case DocumentElementType.Rating:
      return (
        <FormFieldTooltipWrapper
          name={name}
          label={label}
          showBaseLabel={false}
          onSubmit={onSubmit}
          tooltipProps={disableInlineEdit ? { open: false } : {}}
          render={({ field, isBaseElement }) => {
            if (isBaseElement) {
              return (
                <TableCellElement
                  field={formField}
                  value={field.value}
                  type={type}
                />
              );
            }

            return <Rating {...field} name="size-large" size="large" />;
          }}
          {...rest}
        />
      );
    case DocumentElementType.User:
      return (
        <FormFieldTooltipWrapper
          name={name}
          label={label}
          showBaseLabel={false}
          onSubmit={onSubmit}
          tooltipProps={disableInlineEdit ? { open: false } : {}}
          render={({ field, isBaseElement }) => {
            if (isBaseElement) {
              return (
                <TableCellElement
                  field={formField}
                  value={field.value}
                  type={type}
                />
              );
            }

            return (
              <AccountUserDataProvider>
                <TooltipSelector
                  actionButtons={false}
                  multi={!!formField.multi_user}
                  {...field}
                />
              </AccountUserDataProvider>
            );
          }}
          {...rest}
        />
      );
    case DocumentElementType.UserType:
      return (
        <FormFieldTooltipWrapper
          name={name}
          label={label}
          showBaseLabel={false}
          onSubmit={onSubmit}
          tooltipProps={disableInlineEdit ? { open: false } : {}}
          render={({ field, isBaseElement }) => {
            if (isBaseElement) {
              return (
                <TableCellElement
                  field={formField}
                  value={field.value}
                  type={type}
                />
              );
            }

            return (
              <AccountTypeDataProvider>
                <TooltipSelector
                  actionButtons={false}
                  multi={!!formField.multi_user}
                  {...field}
                />
              </AccountTypeDataProvider>
            );
          }}
          {...rest}
        />
      );
    default:
      return (
        <FormFieldTooltipWrapper
          name={name}
          label={label}
          showBaseLabel={false}
          onSubmit={onSubmit}
          tooltipProps={disableInlineEdit ? { open: false } : {}}
          render={({ field, fieldRef, isBaseElement }) => {
            if (isBaseElement) {
              return (
                <TableCellElement
                  field={formField}
                  value={field.value}
                  type={type as any}
                />
              );
            }

            return (
              <TextField
                {...field}
                inputRef={fieldRef}
                variant="filled"
                size="small"
                hiddenLabel
              />
            );
          }}
          {...rest}
        />
      );
  }
};

type TablePaginationActionsProps = {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
};

const TablePaginationActions: React.FC<TablePaginationActionsProps> = (
  props
) => {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  const PageNumbers = React.useMemo(() => {
    const numberComponents = [];
    if (page - 1 >= 0) {
      numberComponents.push(
        <IconButton onClick={(e) => onPageChange(e, page - 1)}>
          {page}
        </IconButton>
      );
    }

    numberComponents.push(
      <PaginationButton disabled>{page + 1}</PaginationButton>
    );

    if (!(page >= Math.ceil(count / rowsPerPage) - 1)) {
      numberComponents.push(
        <PaginationButton onClick={(e) => onPageChange(e, page + 1)}>
          {page + 2}
        </PaginationButton>
      );
    }

    if (numberComponents.length === 2) {
      if (!(page + 1 >= Math.ceil(count / rowsPerPage) - 1)) {
        numberComponents.push(
          <PaginationButton onClick={(e) => onPageChange(e, page + 2)}>
            {page + 3}
          </PaginationButton>
        );
      } else if (page - 2 >= 0) {
        numberComponents.unshift(
          <IconButton onClick={(e) => onPageChange(e, page - 2)}>
            {page - 1}
          </IconButton>
        );
      }
    }

    return numberComponents;
  }, [count, onPageChange, page, rowsPerPage]);

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <ArrowButton onClick={handleFirstPageButtonClick} disabled={page === 0}>
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </ArrowButton>
      <ArrowButton onClick={handleBackButtonClick} disabled={page === 0}>
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </ArrowButton>
      {PageNumbers.map((comp) => comp)}
      <ArrowButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </ArrowButton>
      <ArrowButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </ArrowButton>
    </Box>
  );
};

const DataTable = <T extends BaseItemType>(props: Props<T>) => {
  const {
    items = [],
    name,
    fields: propFields,
    getColumnTitle,
    onAddClick,
    onDeleteClick,
    onEditClick,
    onEditSubmit,
    tableActions,
    rowActions,
    paginationViewOnly = false,
    disableInlineEdit = false,
    pagination = true,
    className,
    ...rest
  } = props;
  const theme = useTheme();

  const tableRef = useRef<HTMLDivElement | null>(null);

  const [fields, setFields] = useState<DataField[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const open = Boolean(anchorEl);
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - items.length) : 0;

  useEffect(() => {
    if (!pagination) {
      setRowsPerPage(items.length);
    }
  }, [items.length, pagination]);

  const handleAddClick = () => {
    onAddClick?.();
  };
  const handleEditClick = () => {
    if (selectedItem != null) {
      onEditClick?.(selectedItem, items[selectedItem]);
      handleMenuClose();
    }
  };
  const handleDeleteClick = () => {
    if (selectedItem != null) {
      onDeleteClick?.(selectedItem, items[selectedItem]);
      handleMenuClose();
    }
  };

  const handleMoreClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    item: number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useLayoutEffect(() => {
    const divWidth = tableRef.current?.offsetWidth;
    const columnCount =
      divWidth != null ? Math.floor(divWidth / 200) - 1 : null;

    if (columnCount != null) {
      setFields(
        propFields
          .filter(
            (f) =>
              ![
                DocumentElementType.RecordList,
                DocumentElementType.SubRecord,
              ].includes(f.type as DocumentElementType)
          )
          .slice(0, columnCount)
      );
    }
  }, [propFields]);

  return (
    <TableContainerWrap
      sx={{ maxWidth: 1600, overflowX: "auto" }}
      ref={tableRef}
      className={`${className} table-holder`}
    >
      <TableSecondary>
        <TableHead sx={{ height: "40px" }}>
          <TableRow>
            {fields.map((field, idx) => (
              <TableCell
                align={idx === 0 ? "left" : "center"}
                sx={{ minWidth: 200 }}
              >
                {getColumnTitle ? (
                  getColumnTitle(field, idx)
                ) : (
                  <>
                    <ArrowIcon /> {field.title}
                  </>
                )}
              </TableCell>
            ))}
            <TableCell
              align="right"
              sx={{
                position: "sticky",
                right: 0,
                // background: theme.palette.background.default,
              }}
            >
              {tableActions ?? (
                <IconButton onClick={handleAddClick}>
                  <AddCircleIcon />
                </IconButton>
              )}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? items?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : items
          ).map((item, rowIdx) => (
            <TableRow
              key={item._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {fields.map((field, colIdx) => (
                <TableCell
                  key={`${item._id}:${field.slug}`}
                  align={colIdx === 0 ? "left" : "center"}
                >
                  <TableField
                    namePrefix={`${name}[${rowIdx}]`}
                    field={field}
                    disableInlineEdit={disableInlineEdit}
                    onSubmit={(_, value) =>
                      onEditSubmit?.(page * rowsPerPage + rowIdx, {
                        ...item,
                        [field.slug]: value,
                      })
                    }
                    {...rest}
                  />
                </TableCell>
              ))}
              <TableCell
                align="right"
                sx={{
                  position: "sticky",
                  right: 0,
                  background: theme.palette.background.default,
                }}
              >
                {typeof rowActions === "function" ? (
                  rowActions(page * rowsPerPage + rowIdx, item)
                ) : rowActions ? (
                  rowActions
                ) : (
                  <IconButton
                    onClick={(e) => {
                      handleMoreClick(e, page * rowsPerPage + rowIdx);
                    }}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <EmptyTableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </EmptyTableRow>
          )}
          <Menu
            id="edit-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={() => handleEditClick()}>
              <EditOutlined /> Edit
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handleDeleteClick()}>
              <DeleteOutline /> Delete
            </MenuItem>
          </Menu>
        </TableBody>
        {pagination && (
          <TableFooter>
            <TableRow>
              <TablePaginationWrap
                rowsPerPageOptions={[
                  { label: "5 records per page", value: 5 },
                  { label: "10 records per page", value: 10 },
                  { label: "25 records per page", value: 25 },
                  { label: "All", value: -1 },
                ]}
                count={items.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per pages",
                  },
                  native: false,
                }}
                labelRowsPerPage={null}
                onPageChange={paginationViewOnly ? () => {} : handleChangePage}
                onRowsPerPageChange={
                  paginationViewOnly ? () => {} : handleChangeRowsPerPage
                }
                ActionsComponent={(pageProps) => (
                  <TablePaginationActions {...pageProps} />
                )}
                labelDisplayedRows={() => null}
              />
            </TableRow>
          </TableFooter>
        )}
      </TableSecondary>
    </TableContainerWrap>
  );
};

export default DataTable;
