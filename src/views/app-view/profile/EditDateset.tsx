import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Box, Stack, styled, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { DynamicFieldProps } from "components/Form/DynamicEditFields";
import DynamicEditForm, {
  DynamicEditFormProps,
  FormRefAttribute,
} from "components/Form/DynamicEditForm";
import { transformFieldsOptions } from "components/Form/helper";
import { DocumentElementType } from "enums/Form";
import { find } from "lodash";
import { ApiModels } from "queries/apiModelMapping";
import useGetItem from "queries/useGetItem";
import useUpdateItem from "queries/useUpdateItem";
import React, { useMemo, useRef } from "react";
import { useParams } from "react-router-dom";

type Props = {
  onBackClick?: () => void;
  onFormEvent?: DynamicEditFormProps["onFormEvent"];
  data?: any;
};

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

const generalFields: DataFieldMapped[] = [
  { type: "label", name: "label", label: "General Setting" },
  {
    type: DocumentElementType.TextField,
    name: "title",
    label: "Title",
    required: true,
  },
];

const EditDataset: React.FC<Props> = (props) => {
  const { onBackClick, onFormEvent, data } = props;
  const { slug: datasetDesignSlug, datasetSlug } =
    useParams<{ slug?: string; datasetSlug?: string }>();
  const queryClient = useQueryClient();

  const defaultList = queryClient.getQueryData([
    [ApiModels.Dataset, { dataset_type_slug: datasetDesignSlug, title: "" }],
  ]) as unknown as DatasetDesign[];

  const defaultData = find(defaultList, { slug: datasetSlug }) as DatasetDesign;

  const formRef = useRef<FormRefAttribute | undefined>();
  const { data: datasetDesign, isLoading: datasetDesignLoading } = useGetItem({
    modelName: ApiModels.DatasetDesign,
    slug: datasetDesignSlug,
  });
  const { data: dataset = defaultData, isLoading: datasetLoading } = useGetItem(
    {
      modelName: ApiModels.Dataset,
      slug: datasetSlug,
      requestOptions: { path: datasetDesignSlug },
    }
  );
  const { mutate: updateDataset, isLoading: updateingDataset } = useUpdateItem({
    modelName: ApiModels.Dataset,
    requestOptions: { path: datasetDesignSlug },
  });

  const defaultDatasetValues = data || dataset;

  const submitHandler = (data: Record<string, any>) => {
    if (datasetSlug)
      updateDataset(
        { slug: datasetSlug, data: data },
        {
          onSuccess: () => {},
          onError: () => {
            //TODO:HandleError
          },
        }
      );
  };

  const fields = useMemo(() => {
    let fields = [...generalFields];
    if (datasetDesign?.fields?.fields?.length) {
      fields = fields.concat(
        transformFieldsOptions(datasetDesign?.fields?.fields || [], {
          prefixName: "fields",
        })
      );
    }
    return fields;
  }, [datasetDesign]);

  //if(datasetLoading) return null;
  return (
    <EditBox>
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
      {defaultDatasetValues && (
        <DynamicEditForm
          name={"fields"}
          fields={fields as DynamicFieldProps[]}
          ref={formRef}
          defaultValues={defaultDatasetValues}
          onSubmit={submitHandler}
          onFormEvent={onFormEvent}
          disableTableActions={{ add: false, edit: true, remove: false }}
        />
      )}
    </EditBox>
  );
};

export default EditDataset;
