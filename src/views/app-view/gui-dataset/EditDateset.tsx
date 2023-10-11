import { Stack, styled } from "@mui/material";
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
import React, { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useDatasetStore } from "store/stores/dataset";

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
type Props = {
  onFormEvent?: DynamicEditFormProps["onFormEvent"];
  data?: any;
  guiSlug: string;
  datasetDesignSlug?: string;
  datasetSlug?: string;
  includedFieldIds?: string[];
};

const EditDataset: React.FC<Props> = (props) => {
  console.log("props", props);
  const {
    onFormEvent,
    datasetDesignSlug,
    datasetSlug,
    guiSlug,
    includedFieldIds,
  } = props;
  const [searchParams] = useSearchParams();

  const queryClient = useQueryClient();

  const defaultData = useMemo(() => {
    const defaultList = queryClient.getQueryData([
      [ApiModels.Dataset, { dataset_type_slug: datasetDesignSlug, title: "" }],
    ]) as unknown as DatasetDesign[];

    return find(defaultList, { slug: datasetSlug });
  }, [datasetDesignSlug, datasetSlug, queryClient]) as unknown as Dataset;

  const formRef = useRef<FormRefAttribute | undefined>();
  const { data: datasetDesign, isLoading: datasetDesignLoading } = useGetItem({
    modelName: ApiModels.DatasetDesign,
    slug: datasetDesignSlug,
  });
  const { data: gui } = useGetItem({
    modelName: ApiModels.Gui,
    slug: guiSlug,
    queryOptions: { enabled: false },
  });
  const { data: dataset = defaultData, isLoading: datasetLoading } = useGetItem(
    {
      modelName: ApiModels.Dataset,
      slug: datasetSlug,
      requestOptions: { path: datasetDesignSlug },
      // queryOptions: { enabled: false },

      queryKey: [datasetDesignSlug, datasetSlug],
    }
  );
  const { mutate: updateDataset, isLoading: updateingDataset } = useUpdateItem({
    modelName: ApiModels.Dataset,
    requestOptions: { path: datasetDesignSlug },
  });
  const pushDatasetDraft = useDatasetStore.usePushDatasetDraft();

  const initialValueSet = useRef(false);
  const allowNetworkRequest = useRef(false);

  const submitHandler = (data: Record<string, any>) => {
    if (allowNetworkRequest.current && datasetSlug)
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

  const includedFields = useMemo(() => {
    if (includedFieldIds?.length === 0) return [];

    if (datasetDesign?.fields?.fields?.length) {
      const includedGuiFields =
        datasetDesign?.fields?.fields
          .filter((f) => includedFieldIds?.includes(f.id!))
          .sort((a, b) => {
            const indexA = includedFieldIds?.indexOf(a.id) || 0;
            const indexB = includedFieldIds?.indexOf(b.id) || 0;
            return indexA - indexB;
          }) || [];

      return includedGuiFields;
    }
    return [];
  }, [datasetDesign?.fields?.fields, includedFieldIds]);

  const fields = useMemo(() => {
    let fields = [...generalFields];
    if (includedFields?.length) {
      fields = fields.concat(
        transformFieldsOptions(includedFields, {
          prefixName: "fields",
        })
      );
    }
    return fields;
  }, [includedFields]);

  useEffect(() => {
    initialValueSet.current = false;
  }, [datasetSlug]);

  useEffect(() => {
    if (dataset && datasetDesign?.fields?.fields) {
      pushDatasetDraft(
        {
          data: dataset,
          fields: datasetDesign?.fields?.fields,
        },
        false
      );
    }
  }, [dataset, datasetDesign?.fields?.fields, pushDatasetDraft]);

  React.useEffect(() => {
    if (formRef.current?.reset && dataset && !initialValueSet.current) {
      formRef.current?.reset(dataset);
      initialValueSet.current = true;
      setTimeout(() => {
        allowNetworkRequest.current = true;
      }, 1000);
    }
  }, [formRef, dataset]);
  return (
    <React.Fragment>
      {dataset && (
        <DynamicEditForm
          name={"fields"}
          fields={fields as DynamicFieldProps[]}
          ref={formRef}
          defaultValues={{}}
          onSubmit={submitHandler}
          onFormEvent={onFormEvent}
          disableTableActions={{ add: false, edit: true, remove: false }}
        />
      )}
    </React.Fragment>
  );
};

export default EditDataset;
