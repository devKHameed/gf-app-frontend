import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  styled,
} from "@mui/material";
import DynamicCreateForm, {
  FormRefAttribute,
} from "components/Form/DynamicCreateForm";
import { transformFieldsOptions } from "components/Form/helper";
import Scrollbar from "components/Scrollbar";
import { DocumentElementType } from "enums/Form";
import { ApiModels } from "queries/apiModelMapping";
import useCreateItem from "queries/useCreateItem";
import useGetItem from "queries/useGetItem";
import useListItems from "queries/useListItems";
import React, { useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
type Props = {
  onSubmit?: (data: any) => void;
  onClose?: () => void;
} & Omit<DialogProps, "onSubmit">;

const generalFields: DataFieldExtended[] = [
  { type: "label", name: "label", label: "General Setting" },
  {
    type: DocumentElementType.TextField,
    name: "title",
    label: "Title",
    required: true,
  },
];

type DataFieldExtended = Partial<
  Omit<DataField, "fields"> & { [key: string]: unknown }
>;

const transformFields = (fields: Partial<DataField>[]): DataFieldExtended[] => {
  return fields.map((field) => ({
    ...field,
    label: field.title,
    type: field.type,
    name: field.slug,
    options: field.list_items,
    date_type: field.date_type,
    fields: transformFields(field.fields || []),
  }));
};

const ScrollbarStyle = styled(Scrollbar)(({ theme }) => ({
  /* added this style in dialog box to make it gloabl */
  // height: "calc(100vh - 200px) !important",
  // background: theme.palette.background.GFTopNav,
}));
const AddDatasetModel: React.FC<Props> = (props) => {
  const { onClose, onSubmit, open, ...dialogProps } = props;
  const datasetDesignSlug = useParams<{ slug?: string }>()?.slug || "";
  const { mutate: createDataset, isLoading } = useCreateItem({
    modelName: ApiModels.Dataset,
    queryKey: [ApiModels.Dataset, { dataset_type_slug: datasetDesignSlug }],
    isPaginated: true,
  });
  const { data: datasetDesign, isLoading: datasetDesignLoading } = useGetItem({
    modelName: ApiModels.DatasetDesign,
    slug: datasetDesignSlug,
  });
  const { data: AccountUser } = useListItems({
    modelName: ApiModels.AccountUser,
  });
  const formRef = useRef<FormRefAttribute | undefined>();

  const submitHandler = (data: any) => {
    console.log(
      "🚀 ~ file: AddDatasetModal.tsx:62 ~ submitHandler ~ data:",
      data
    );
    //TODO: Sanatize data before sending.
    createDataset(
      { ...data, dataset_type_slug: datasetDesignSlug },
      {
        onSuccess: () => {
          console.log("inner success");
          onClose?.();
        },
      }
    );
  };
  const fields = useMemo(() => {
    if (!open) return [];
    let fields = [...generalFields];
    if (datasetDesign?.fields?.fields?.length) {
      fields = fields.concat(
        transformFieldsOptions(datasetDesign?.fields?.fields || [], {
          prefixName: "fields",
        })
      );
    }
    return fields;
  }, [datasetDesign, open]);
  return (
    <Dialog
      onClose={(e, r) => {
        console.log(e, r);
      }}
      disableEscapeKeyDown
      scroll="body"
      fullWidth
      maxWidth={false}
      open={open}
      {...dialogProps}
    >
      <DialogTitle>
        <Box>Add Dataset</Box>
        <Box>
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Scrollbar className="form-scroller">
        <DialogContent>
          <Box>
            {fields && (
              <DynamicCreateForm
                name={"fields"}
                fields={fields as any}
                ref={formRef}
                submitButton={false}
                onFormEvent={(e) => {
                  if (e.name === "table-edit-complete") {
                    formRef.current?.setValue(e.field, e.data.array);
                  }
                }}
              />
            )}
          </Box>
        </DialogContent>
      </Scrollbar>
      <DialogActions>
        <LoadingButton
          onClick={onClose}
          loading={isLoading}
          startIcon={""}
          loadingPosition="start"
        >
          Cancel
        </LoadingButton>
        <LoadingButton
          onClick={(e) => {
            formRef.current?.handleSubmit(submitHandler)(e);
          }}
          variant="contained"
          startIcon={""}
          loading={isLoading}
          loadingPosition="start"
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddDatasetModel;
