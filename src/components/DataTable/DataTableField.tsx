import Close from "@mui/icons-material/Close";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  Stack,
  styled,
} from "@mui/material";
import DynamicCreateForm from "components/Form/DynamicCreateForm";
import DynamicEditForm from "components/Form/DynamicEditForm";
import SidebarSection from "components/RightSidebar/SidebarSection";
import { DocumentElementType } from "enums/Form";
import useOpenClose from "hooks/useOpenClose";
import cloneDeep from "lodash/cloneDeep";
import React, { useEffect, useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import ProfileCard from "stories/CompoundComponent/ProfileCard/ProfileCard";
import { v4 } from "uuid";
import type { BaseItemType as DTBaseItemType } from "./index";
import DataTable from "./index";

const getColWith = (type: string) => {
  switch (type) {
    case "email":
    case "url":
    case "phone":
    case "money":
    case DocumentElementType.Color:
    case DocumentElementType.Boolean:
    case DocumentElementType.Select:
    case DocumentElementType.Number:
    case DocumentElementType.TextField:
      return { xs: 12, sm: 6 };
    default:
      return { xs: 12 };
  }
};

const DialogActionsArea = styled(DialogActions)(({ theme }) => {
  return {
    margin: "-30px -30px -20px",

    [`${theme.breakpoints.down("sm")}`]: {
      margin: "0 -10px -10px",
    },
  };
});

export const AddDatasetItemModel: React.FC<
  {
    fields: DataField[];
    title?: string;
    mode?: "add" | "edit";
    onClose?(): void;
    onSubmit?(value: any): void;
    selected?: any;
    defaultTitleField?: boolean;
  } & Omit<DialogProps, "onSubmit" | "onClose">
> = ({
  fields,
  onClose,
  mode,
  open,
  selected,
  onSubmit,
  title,
  defaultTitleField = true,
  ...dialogProps
}) => {
  const formRef = React.useRef<any>();

  useEffect(() => {
    setTimeout(() => {
      if (open && selected && formRef.current) {
        formRef.current.reset(selected);
      }
    }, Infinity - 1);
  }, [selected, open, formRef]);

  const transformFields = useMemo(
    () =>
      (
        [
          {
            type: DocumentElementType.Label,
            name: "label",
            label: title,
          },
          ...(defaultTitleField
            ? [
                {
                  type: DocumentElementType.TextField,
                  name: "title",
                  label: "Title",
                  required: true,
                },
              ]
            : []),
          ...fields,
        ] as any[]
      ).map((field) => ({
        label: field.title,
        name: field.slug,
        options: field.list_items,
        date_type: field.date_type,
        ...field,
      })),
    [fields, defaultTitleField]
  );

  return (
    <Dialog
      onClose={(e, r) => {
        onClose?.();
      }}
      disableEscapeKeyDown
      scroll="body"
      fullWidth
      maxWidth="xl"
      open={open}
      {...dialogProps}
    >
      <DialogTitle>
        <Box>Add Dataset</Box>
        <Box>
          <IconButton onClick={() => onClose?.()}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box>
          {mode === "edit" ? (
            <DynamicEditForm
              name=""
              ref={formRef}
              fields={transformFields as any}
              onSubmit={(data) => {
                onSubmit?.(data);
              }}
            />
          ) : (
            <DynamicCreateForm
              name=""
              ref={formRef}
              fields={transformFields as any}
              submitButtonComponent={({ handleSubmit }) => {
                return (
                  <DialogActionsArea>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                      onClick={handleSubmit((values) => {
                        onSubmit?.(values);
                      })}
                      variant="contained"
                    >
                      Submit
                    </Button>
                  </DialogActionsArea>
                );
              }}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export type BaseItemType = DTBaseItemType;

export type DataTableFieldProps = {
  value?: BaseItemType[];
  name: string;
  fields: DataField[];
  title?: string;
  formSubmit?: boolean;
  recordListView?: "list" | "table";
  onChange?: (value: BaseItemType[]) => void;
  onEditClick?(index: number, data: BaseItemType): void;
  onAddClick?(): void;
  onDeleteClick?(index: number): void;
  onAddComplete?(
    index: number,
    data: BaseItemType,
    array: BaseItemType[]
  ): void;
  onEditComplete?(
    index: number,
    data: BaseItemType,
    array: BaseItemType[]
  ): void;
  disableTableActions?: true | { add: boolean; edit: boolean; remove: boolean };
};

const getTableActionBits = (
  actions: DataTableFieldProps["disableTableActions"]
) => {
  if (actions == null) {
    return { add: true, edit: true, remove: true };
  }

  if (actions === true) {
    return {
      add: false,
      edit: false,
      remove: false,
    };
  }

  return { add: !actions.add, edit: !actions.edit, remove: !actions.remove };
};

const DataTableField: React.FC<DataTableFieldProps> = (props) => {
  const {
    name,
    fields: formFields,
    // value: items = [],
    title,
    onChange,
    onEditClick,
    onAddClick,
    onDeleteClick,
    disableTableActions,
    onAddComplete,
    onEditComplete,
    formSubmit,
    recordListView = "table",
  } = props;

  const { add, remove, edit } = getTableActionBits(disableTableActions);
  const { getValues } = useFormContext();

  const _ = useWatch({ name, exact: true }) || [];
  const items: BaseItemType[] = getValues(name) || [];

  const [isOpen, open, close] = useOpenClose();

  const [selected, setSelected] = useState<any>();

  const fields: DataField[] = [
    {
      type: DocumentElementType.TextField,
      slug: "title",
      title: "Title",
      required: true,
      id: "title",
    },
    ...formFields,
  ];

  return (
    <Box>
      {recordListView === "table" && (
        <DataTable
          fields={fields}
          name={name}
          items={items}
          onAddClick={() => {
            if (add) {
              open();
            }

            onAddClick?.();
          }}
          onDeleteClick={(idx) => {
            if (remove) {
              const array = [...items];
              array.splice(idx, 1);
              onChange?.(array);
            }

            onDeleteClick?.(idx);
          }}
          onEditClick={(idx, data) => {
            if (edit) {
              setSelected({ ...data });
              open();
            }

            onEditClick?.(idx, data);
          }}
          onEditSubmit={(index, data) => {
            const array = [...items] || [];
            const formValue = array.map((a) => (a._id === data._id ? data : a));
            onEditComplete?.(index, data, formValue);
          }}
          formSubmit={formSubmit}
        />
      )}
      {recordListView === "list" && (
        <SidebarSection
          title={title || ""}
          onRightIconClick={() => {
            if (add) {
              open();
            }

            onAddClick?.();
          }}
        >
          <Stack spacing={1}>
            {items.map((item, idx: number) => {
              const getTitle = (i: any) => {
                if (i.title) {
                  return i.title;
                }

                const k = Object.keys(i).find((key: string) => key !== "_id");
                if (k) {
                  return i[k];
                }

                return "";
              };
              return (
                <ProfileCard
                  AvatarImage={<TextFieldsIcon />}
                  key={item._id}
                  options={{
                    draggable: false,
                    switcher: false,
                  }}
                  rightIcon={
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        if (remove) {
                          const array = [...items];
                          array.splice(idx, 1);
                          onChange?.(array);
                        }

                        onDeleteClick?.(idx);
                      }}
                    >
                      <DeleteOutline />
                    </IconButton>
                  }
                  subTitle={item._id}
                  title={getTitle(item)}
                  sx={(theme: any) => ({
                    background: theme.palette.background.GFRightNavForeground,
                    height: 48,
                    ".DragHandle": {
                      lineHeight: "1",
                    },
                  })}
                  onClick={() => {
                    if (edit) {
                      setSelected({ ...item });
                      open();
                    }

                    onEditClick?.(idx, item);
                  }}
                />
              );
            })}
          </Stack>
        </SidebarSection>
      )}
      <AddDatasetItemModel
        open={isOpen}
        onClose={close}
        fields={formFields}
        title={title}
        selected={selected}
        mode={selected ? "edit" : "add"}
        onSubmit={(values: any) => {
          const array = [...items] || [];
          if (!selected) {
            const item = { _id: v4(), ac: "ac", ...cloneDeep(values) };
            const formValue = [item, ...array];
            onChange?.(cloneDeep(formValue));
            onAddComplete?.(0, cloneDeep(item), cloneDeep(formValue));
          } else {
            const index = array.findIndex((item) => item._id === selected._id);
            const item = { ...array[index], ...cloneDeep(values) };
            const formValue = array.map((a) =>
              a._id === selected._id ? item : a
            );
            onChange?.(cloneDeep(formValue));
            onEditComplete?.(index, cloneDeep(item), cloneDeep(formValue));
          }

          setSelected(undefined);
          close();
        }}
      />
    </Box>
  );
};

export default DataTableField;
