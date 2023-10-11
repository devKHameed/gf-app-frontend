import { json } from "@codemirror/lang-json";
import { AddPhotoAlternate } from "@mui/icons-material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Rating from "@mui/material/Rating";
import Select from "@mui/material/Select";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import ReactCodeMirror from "@uiw/react-codemirror";
import AddVideo from "assets/icons/AddVideo";
import ColorPicker from "components/ColorPicker";
import DataTableField from "components/DataTable/DataTableField";
import { FormFieldProps } from "components/FormField";
import Uploader from "components/Uploader";
import OpenCloseElement from "components/util-components/OpenCloseElement";
import {
  DateType,
  DocumentElementType,
  ListSource,
  ValidationMessages,
} from "enums/Form";
import React, { PropsWithChildren, useEffect, useState } from "react";
import BaseCheckboxList from "./BaseCheckboxList";
import AccountTypeDataProvider from "./DataProviders/AccountTypeDataProvider";
import AccountUserDataProvider from "./DataProviders/AccountUserDataProvider";
import { FormEvent } from "./DynamicEditFields";
import FormFieldWrapper from "./FormFieldWrapper";
import Label from "./Label";
import TooltipSelector from "./TooltipSelector";
import { getAcceptedFileTypes } from "./helper";
type Props = {
  type: string;
  name: string;
  options?: any[];
  required?: boolean;
  onFormEvent?(event: FormEvent): void;
  [key: string]: any;
} & FormFieldProps &
  Partial<Omit<DataField, "children">>;
export type DynamicFieldProps = Props;

const OptionDataSource: React.FC<PropsWithChildren<{ field: any }>> = (
  props
) => {
  const { field, children, ...rest } = props;

  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (field.list_source === ListSource.RecordAssociation) {
      getOptions();
    } else {
      setOptions(field.list_items || []);
    }
  }, [field]);

  const getOptions = async () => {
    setLoading(true);
    // const res = await DocumentModel.get(field.associated_document);
    // if (res.data?.length > 0) {
    //   setOptions(
    //     res.data.map((d: any) => ({
    //       label: _.get(d, field.associated_document_label_field.join('.')),
    //       value: d.slug,
    //     })),
    //   );
    // }
    setLoading(false);
  };

  if (React.isValidElement(children)) {
    return (
      <React.Fragment>
        {React.cloneElement(children, {
          ...children.props,
          options,
          loading,
          ...field,
          ...rest,
        })}
      </React.Fragment>
    );
  }
  return <React.Fragment>{children}</React.Fragment>;
};

const DynamicCreateFields = ({
  type,
  name,
  label,
  options = [],
  required,
  onFormEvent,
  ...rest
}: Props) => {
  switch (type) {
    case "email":
    case "url":
    case "phone":
    case "money":
    case DocumentElementType.TextField:
      return (
        <FormFieldWrapper
          name={name}
          label={label}
          rules={{
            required: {
              value: !!required,
              message: ValidationMessages.required,
            },
          }}
          render={({ field }) => {
            return (
              <TextField {...field} variant="filled" size="small" hiddenLabel />
            );
          }}
        />
      );

    case DocumentElementType.Number:
      return (
        <FormFieldWrapper
          name={name}
          label={label}
          render={({ field }) => {
            return (
              <TextField
                {...field}
                onChange={(e) =>
                  field.onChange((e.target as HTMLInputElement).valueAsNumber)
                }
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
        <FormFieldWrapper
          name={name}
          label={label}
          render={({ field }) => {
            return (
              <TextField
                {...field}
                rows={4}
                variant="filled"
                multiline
                hiddenLabel
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
            return <ColorPicker {...field} />;
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
            );
          }}
        ></FormFieldWrapper>
      );
    case DocumentElementType.Select:
      return (
        <FormFieldWrapper
          name={name}
          label={label}
          render={({ field }) => {
            const opts = options;

            return (
              <Select
                {...field}
                value={field.value || []}
                size="small"
                variant="filled"
                sx={{ minHeight: "40px" }}
                multiple={rest.multi}
              >
                {opts.map((opt) => (
                  <MenuItem value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            );
          }}
        />
      );
    case DocumentElementType.CodeEditor:
      return (
        <FormFieldWrapper
          name={name}
          label={label}
          render={({ field }) => {
            return (
              <ReactCodeMirror
                {...field}
                // value="console.log('hello world!');"
                height="200px"
                theme="dark"
                extensions={[json()]}
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
                onChange={(e: any) => {
                  console.log({ e });
                  onChange(e);
                }}
                accept={{
                  [getAcceptedFileTypes(
                    DocumentElementType.AudioVideo === type
                      ? rest.file_type ?? "video"
                      : type
                  )]: rest.accept ? rest.accept?.split(",") : [],
                }}
                single={!rest.multi}
                multiple={rest.multi}
                maxFiles={rest.max_count}
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
                  multi={rest?.multi_user}
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
                  multi={rest.multi_user}
                  {...field}
                />
              </AccountTypeDataProvider>
            );
          }}
        />
      );
    case DocumentElementType.RecordList:
      return (
        <FormFieldWrapper
          name={name}
          render={({ field, fieldState, formState }) => {
            return (
              <DataTableField
                {...field}
                value={field.value}
                title={label}
                fields={rest.fields || []}
                formSubmit={rest.formSubmit}
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
                  field.onChange(array);
                }}
              />
            );
          }}
        />
      );
    default:
      return <div>default</div>;
  }
};

export default DynamicCreateFields;
