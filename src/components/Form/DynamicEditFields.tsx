import { json } from "@codemirror/lang-json";
import { AddPhotoAlternate } from "@mui/icons-material";
import { Box, TooltipProps } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Rating from "@mui/material/Rating";
import Select from "@mui/material/Select";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import { alpha, styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import ReactCodeMirror from "@uiw/react-codemirror";
import AddVideo from "assets/icons/AddVideo";
import CodeEditor from "components/CodeEditor";
import ColorPicker from "components/ColorPicker";
import DataTableField, {
  BaseItemType,
} from "components/DataTable/DataTableField";
import { FormFieldProps } from "components/FormField";
import IconPickerField from "components/IconPicker";
import Uploader from "components/Uploader";
import OpenCloseElement from "components/util-components/OpenCloseElement";
import { AllIconPickerIcons } from "constants/index";
import { DateType, DocumentElementType } from "enums/Form";
import React from "react";
import BaseCheckboxList from "./BaseCheckboxList";
import AccountTypeDataProvider from "./DataProviders/AccountTypeDataProvider";
import AccountUserDataProvider from "./DataProviders/AccountUserDataProvider";
import FormFieldModalWrapper from "./FormFieldModalWrapper";
import FormFieldTooltipWrapper from "./FormFieldTooltipWrapper";
import FormFieldWrapper from "./FormFieldWrapper";
import Label from "./Label";
import ToolTipInput from "./TooltipFields/Input";
import TooltipSelect from "./TooltipFields/Select";
import TooltipSelector from "./TooltipSelector";
import { getAcceptedFileTypes } from "./helper";

// type FormEventName = "table-add" | "table-edit" | "table-delete";

// type FormEventData<T extends FormEventName> = T extends "table-delete"
//   ? { index: number }
//   : T extends "table-edit"
//   ? { index: number; data: unknown }
//   : never;

export type FormEvent = {
  field: string;
} & (
  | {
      name: "table-add";
    }
  | {
      name: "table-edit";
      data: { index: number; data: BaseItemType };
    }
  | {
      name: "table-delete";
      data: { index: number };
    }
  | {
      name: "table-add-complete";
      data: { index: number; data: BaseItemType; array: BaseItemType[] };
    }
  | {
      name: "table-edit-complete";
      data: { index: number; data: BaseItemType; array: BaseItemType[] };
    }
);

type Props = {
  type: string;
  name: string;
  options?: any[];
  onFormEvent?(event: FormEvent): void;
  recordListView?: "list" | "table";
  tooltipProps?: Partial<TooltipProps>;
  [key: string]: any;
} & FormFieldProps &
  Partial<Omit<DataField, "children">>;
export type DynamicFieldProps = Props;

export const SelectWrapper = styled(Select)(() => {
  return {
    ".MuiPopover-root ": {
      position: "absolute",
      left: "0",
      top: "100%",
      bottom: "auto",
    },

    ".MuiPaper-root ": {
      position: "absolute",
      left: "0 !important",
      top: "0 !important",
      maxHeight: "200px !important",
    },
  };
});

export const RadioWrapper = styled(Box)(({ theme }) => {
  return {
    padding: "12px 12px 12px 16px",
    borderRadius: "5px",
    background: theme.palette.background.GF5,

    ".MuiFormControlLabel-root ": {
      margin: "0",
      position: "relative",
      height: "24px",

      "+ .MuiFormControlLabel-root ": {
        marginTop: "16px",
      },
    },

    ".MuiButtonBase-root ": {
      position: "absolute",
      right: "12px",
      top: "50%",
      transform: "translate(0, -50%)",
      width: "24px",
      height: "24px",
      padding: "0",
      background: theme.palette.background.GF5,
      borderRadius: "100%",
      border: `2px solid ${theme.palette.background.GF20}`,
      transition: "all 0.4s ease",

      "&.Mui-checked": {
        background: theme.palette.primary.main,
        "&:before": {
          opacity: "1",
          visibility: "visible",
        },
      },

      "&:before": {
        position: "absolute",
        left: "50%",
        top: "50%",
        width: "10px",
        height: "10px",
        transform: "translate(-50%, -50%)",
        background: theme.palette.text.primary,
        borderRadius: "100%",
        content: `""`,
        transition: "all 0.4s ease",
        opacity: "0",
        visibility: "hidden",
      },
    },

    ".MuiTypography-root": {
      fontSize: "15px",
      lineHeight: "18px",
      fontWeight: "400",
      textTransform: "capitalize",
    },

    ".MuiSvgIcon-root ": {
      display: "none",
    },

    ".MuiTouchRipple-root": {
      display: "none",
    },
  };
});

export const CodeEditorWrap = styled(FormFieldModalWrapper)(() => {
  return {};
});
export const TooltipBaseElement = styled(TextField)<{
  isTooltipOpen?: boolean;
}>(({ isTooltipOpen, theme }) => {
  return {
    ...(isTooltipOpen && {
      ".MuiInputBase-root": {
        border: `2px solid ${alpha(theme.palette.text.primary, 0.3)}`,
        background: `${theme.palette.background.GF10} !important`,
      },
    }),
  };
});
const DynamicEditField = ({
  type,
  name,
  label,
  options = [],
  disableTableActions,
  onFormEvent,
  recordListView = "table",
  tooltipProps,
  ...rest
}: Props) => {
  switch (type) {
    case "email":
    case "url":
    case "phone":
    case "money":
    case DocumentElementType.TextField:
      return (
        <ToolTipInput name={name} label={label} tooltipProps={tooltipProps} />
      );
    case DocumentElementType.Number:
      return (
        <FormFieldTooltipWrapper
          name={name}
          label={label}
          tooltipProps={tooltipProps}
          render={({ field, fieldRef, isTooltipOpen, isBaseElement }) => {
            if (isBaseElement)
              return (
                <TooltipBaseElement
                  value={field.value}
                  variant="filled"
                  size="small"
                  isTooltipOpen={isTooltipOpen}
                  disabled
                  hiddenLabel
                />
              );
            return (
              <TextField
                {...field}
                onChange={(e) =>
                  field.onChange((e.target as HTMLInputElement).valueAsNumber)
                }
                inputRef={fieldRef}
                type="number"
                variant="filled"
                size="small"
                hiddenLabel
              />
            );
          }}
        />
      );
    case DocumentElementType.Label:
      return <Label label={label as string} />;
    case DocumentElementType.TextArea:
      return (
        <FormFieldTooltipWrapper
          name={name}
          label={label}
          tooltipProps={tooltipProps}
          render={({ field, fieldRef, isTooltipOpen, isBaseElement }) => {
            if (isBaseElement)
              return (
                <TooltipBaseElement
                  value={field.value}
                  rows={2}
                  variant="filled"
                  isTooltipOpen={isTooltipOpen}
                  multiline
                  disabled
                  hiddenLabel
                />
              );
            return (
              <TextField
                {...field}
                rows={2}
                variant="filled"
                multiline
                hiddenLabel
                inputRef={fieldRef}
              />
            );
          }}
        />
      );
    case DocumentElementType.Color:
      return (
        <FormFieldWrapper
          name={name}
          label={label}
          render={({ field }) => {
            return <ColorPicker {...field} color={field.value} />;
          }}
        />
      );
    case DocumentElementType.Boolean:
      return (
        <FormFieldWrapper
          name={name}
          label={label}
          render={({ field }) => {
            return (
              <FormControlLabel
                control={<Checkbox {...field} />}
                label={label}
              />
            );
          }}
        />
      );
    case DocumentElementType.Checkbox:
      return (
        <FormFieldWrapper
          name={name}
          label={label}
          defaultValue={[]}
          render={({ field: { value, onChange, name } }) => {
            const opts = options;
            return (
              <BaseCheckboxList
                compact={true}
                options={opts}
                name={name}
                value={value}
                onChange={onChange}
              />
            );
          }}
        />
      );
    case DocumentElementType.Radio:
      return (
        <FormFieldWrapper
          name={name}
          label={label}
          render={({ field }) => {
            const opts = options;

            return (
              <RadioWrapper>
                <RadioGroup {...field}>
                  {opts.map((opt) => {
                    return (
                      <FormControlLabel
                        value={opt.value}
                        control={<Radio />}
                        label={opt.label}
                      />
                    );
                  })}
                </RadioGroup>
              </RadioWrapper>
            );
          }}
        ></FormFieldWrapper>
      );
    case DocumentElementType.Select:
      return (
        <TooltipSelect
          name={name}
          label={label}
          tooltipProps={tooltipProps}
          tooltipInlineElementProps={{ multiple: rest.multi }}
        />
      );
    case DocumentElementType.CodeEditor:
      return (
        <CodeEditorWrap
          name={name}
          label={label}
          render={({ field, fieldRef, isBaseElement }) => {
            if (isBaseElement)
              return (
                <ReactCodeMirror
                  value={field.value || ""}
                  height="200px"
                  extensions={[json()]}
                  theme="dark"
                  readOnly={true}
                  editable={false}
                  // onChange={onChange}
                />
              );
            return (
              <CodeEditor
                {...field}
                value={field.value || ""}
                height="200px"
                extensions={[json()]}
                // autoFocus
                ref={(ref) => {
                  if (fieldRef) fieldRef.current = ref?.view;
                }}

                // onChange={onChange}
              />
            );
          }}
        />
      );
    case DocumentElementType.Progress:
      return (
        <FormFieldWrapper
          name={name}
          label={label}
          render={({ field }) => {
            return (
              <Slider
                {...field}
                valueLabelDisplay="auto"
                value={field.value || 0}
              />
            );
          }}
        />
      );
    case DocumentElementType.Image:
    case DocumentElementType.File:
    case DocumentElementType.AudioVideo:
      return (
        <FormFieldWrapper
          name={name}
          label={label}
          render={({ field: { onChange, value } }) => {
            return (
              <Uploader
                files={value}
                onChange={(...args: any[]) => {
                  console.log({ args });
                  onChange(...args);
                }}
                accept={{
                  [getAcceptedFileTypes(
                    DocumentElementType.AudioVideo === type
                      ? rest.file_type ?? "video"
                      : type
                  )]: rest.accept ? rest.accept?.split(",") : [],
                }}
                single={!rest.multi}
                multiple={rest.multi ?? false}
                maxFiles={rest.multi ? rest.max_count : 1}
                maxSize={rest.max_size && rest.max_size * 1024 * 1024} //Mb to bytes
                extra={{
                  icon:
                    DocumentElementType.Image === type ? (
                      <AddPhotoAlternate />
                    ) : DocumentElementType.AudioVideo === type ? (
                      <AddVideo />
                    ) : undefined,
                  description:
                    DocumentElementType.AudioVideo === type ? (
                      <React.Fragment>
                        mp3,mp4,mov,avi,webm
                        {rest.max_size ? (
                          <React.Fragment>
                            (max {rest.max_size}
                            mb)
                          </React.Fragment>
                        ) : null}
                      </React.Fragment>
                    ) : DocumentElementType.File === type ? (
                      <React.Fragment>
                        {rest.accept || "upload files here"}{" "}
                        {rest.max_size ? (
                          <React.Fragment>
                            (max {rest.max_size}
                            mb)
                          </React.Fragment>
                        ) : null}
                      </React.Fragment>
                    ) : undefined,
                }}
              />
            );
          }}
        />
      );
    case DocumentElementType.Date:
      return (
        <FormFieldWrapper
          name={name}
          label={label}
          render={({ field }) => {
            if (rest.date_type === DateType.DateOnly)
              return (
                <OpenCloseElement>
                  {({ open, onOpen, onClose }) => (
                    <DatePicker
                      {...field}
                      open={open}
                      onOpen={onOpen}
                      onClose={onClose}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="filled"
                          size="small"
                          hiddenLabel
                          onClick={onOpen}
                        />
                      )}
                    />
                  )}
                </OpenCloseElement>
              );
            if (rest.date_type === DateType.TimeOnly)
              return (
                <OpenCloseElement>
                  {({ open, onOpen, onClose }) => (
                    <TimePicker
                      {...field}
                      open={open}
                      onOpen={onOpen}
                      onClose={onClose}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="filled"
                          size="small"
                          hiddenLabel
                          onClick={onOpen}
                        />
                      )}
                    />
                  )}
                </OpenCloseElement>
              );
            return (
              <OpenCloseElement>
                {({ open, onOpen, onClose }) => (
                  <DateTimePicker
                    {...field}
                    open={open}
                    onOpen={onOpen}
                    onClose={onClose}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="filled"
                        size="small"
                        hiddenLabel
                        onClick={onOpen}
                      />
                    )}
                  />
                )}
              </OpenCloseElement>
            );
          }}
        />
      );
    case DocumentElementType.RecordList:
      return (
        <FormFieldWrapper
          name={name}
          // label={label}
          render={({ field }) => {
            // console.log({ field, rest });
            return (
              <DataTableField
                name={field.name}
                value={field.value}
                fields={rest.fields || []}
                title={label}
                onChange={field.onChange}
                disableTableActions={disableTableActions}
                recordListView={recordListView}
                onAddClick={() =>
                  onFormEvent?.({
                    name: "table-add",
                    field: field.name,
                  })
                }
                onEditClick={(index, data) =>
                  onFormEvent?.({
                    name: "table-edit",
                    field: field.name,
                    data: { index, data },
                  })
                }
                onDeleteClick={(index) => {
                  onFormEvent?.({
                    name: "table-delete",
                    field: field.name,
                    data: { index },
                  });
                }}
                onAddComplete={(index, data, array) => {
                  onFormEvent?.({
                    name: "table-add-complete",
                    field: field.name,
                    data: { index, data, array },
                  });
                }}
                onEditComplete={(index, data, array) => {
                  onFormEvent?.({
                    name: "table-edit-complete",
                    field: field.name,
                    data: { index, data, array },
                  });
                }}
              />
            );
          }}
        />
      );
    case DocumentElementType.Rating:
      return (
        <FormFieldWrapper
          name={name}
          label={label}
          render={({ field }) => {
            return <Rating {...field} name="size-large" size="large" />;
          }}
        />
      );
    case DocumentElementType.User:
      return (
        <FormFieldWrapper
          name={name}
          label={label}
          render={({ field }) => {
            return (
              <AccountUserDataProvider
                allowAllUserType={rest?.user_types_allow_all}
                userTypes={rest.user_types}
              >
                <TooltipSelector
                  actionButtons={false}
                  multi={rest?.multi_user ?? false}
                  tooltipProps={tooltipProps}
                  {...field}
                />
              </AccountUserDataProvider>
            );
          }}
        />
      );
    case DocumentElementType.UserType:
      return (
        <FormFieldWrapper
          name={name}
          label={label}
          render={({ field }) => {
            return (
              <AccountTypeDataProvider>
                <TooltipSelector
                  actionButtons={false}
                  multi={rest.multi_user ?? false}
                  tooltipProps={tooltipProps}
                  {...field}
                />
              </AccountTypeDataProvider>
            );
          }}
        />
      );

    case "icon":
      return (
        <FormFieldWrapper
          name={name}
          label={label}
          render={({ field }) => {
            return (
              <IconPickerField
                icons={rest.icons ?? AllIconPickerIcons}
                compact={rest.compact}
                onChange={field.onChange}
                value={field.value}
              />
            );
          }}
        />
      );

    default:
      return (
        <FormFieldTooltipWrapper
          name={name}
          label={label}
          tooltipProps={tooltipProps}
          render={({ field, fieldRef, isTooltipOpen, isBaseElement }) => {
            if (isBaseElement)
              return (
                <TooltipBaseElement
                  value={field.value}
                  variant="filled"
                  size="small"
                  isTooltipOpen={isTooltipOpen}
                  disabled
                  hiddenLabel
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
        />
      );
  }
};

export default DynamicEditField;
