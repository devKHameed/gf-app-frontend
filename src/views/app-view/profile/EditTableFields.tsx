import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Box, Stack, styled, Typography } from "@mui/material";
import { DataTableFieldProps } from "components/DataTable/DataTableField";
import DynamicEditForm, {
  DynamicEditFormProps,
  FormRefAttribute,
} from "components/Form/DynamicEditForm";
import { DocumentElementType } from "enums/Form";
import React, { useEffect, useMemo, useRef } from "react";

type Props = {
  onBackClick?: () => void;
  onFormEvent?: DynamicEditFormProps["onFormEvent"];
  data?: Record<string, unknown>;
  fields: DataField[];
  onSubmit: (data: Record<string, unknown>) => void;
  disableTableActions?: DataTableFieldProps["disableTableActions"];
  recordListView?: "list" | "table";
};

const generalFields = [
  { type: "label", name: "label", label: "General Setting" },
  {
    type: DocumentElementType.TextField,
    name: "title",
    label: "Title",
    required: true,
  },
];

const EditBox = styled(Box)(({ theme }) => {
  return {
    padding: "24px",

    [`${theme.breakpoints.down("sm")}`]: {
      padding: "11px 15px",
    },
  };
});

export const BoxHeader = styled(Stack)(({ theme }) => ({
  gap: "24px",
  marginBottom: "48px",

  [`${theme.breakpoints.down("sm")}`]: {
    gap: "8px",
    margin: "-11px -15px 20px",
    padding: "11px 15px 11px",
    background: theme.palette.common.blackshades["30p"],
    borderBottom: `1px solid ${theme.palette.background.GFOutlineNav}`,
  },
}));

const EditTableFields: React.FC<Props> = (props) => {
  const {
    onBackClick,
    onFormEvent,
    data,
    onSubmit,
    fields,
    disableTableActions,
    recordListView = "table",
  } = props;

  const formRef = useRef<FormRefAttribute | undefined>();

  const transformFields = useMemo(() => {
    if (fields?.length) {
      return [
        ...generalFields,
        ...fields.map((field) => ({
          ...field,
          label: field.title,
          type: field.type,
          name: field.slug,
          options: field.list_items,
          date_type: field.date_type,
        })),
      ];
    }
    return [];
  }, [fields]);

  useEffect(() => {
    formRef.current?.reset(data);
  }, [data]);

  //if(datasetLoading) return null;
  return (
    <EditBox className="edit-table-fields-container" p={3}>
      <BoxHeader direction="row">
        <KeyboardBackspaceIcon
          onClick={onBackClick}
          sx={{
            width: "16px",
            height: "auto",
            color: "text.secondary",
          }}
        />
        <Typography component="div" variant="subtitle2">
          Back to List
        </Typography>
      </BoxHeader>
      <DynamicEditForm
        name={"fields"}
        fields={transformFields as any[]}
        ref={formRef}
        defaultValues={data}
        onSubmit={onSubmit}
        onFormEvent={(e) => {
          onFormEvent?.(e);
        }}
        disableTableActions={disableTableActions}
        recordListView={recordListView}
      />
    </EditBox>
  );
};

export default EditTableFields;
