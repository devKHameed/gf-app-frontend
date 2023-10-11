import { Stack, styled } from "@mui/material";
import { DynamicEditFormProps } from "components/Form/DynamicEditForm";
import DatasetModel from "models/Dataset";
import { ApiModels } from "queries/apiModelMapping";
import useGetItem from "queries/useGetItem";
import React, { useEffect, useState } from "react";
import ListDatasetWidget from "./ListDatasetWidget";
import EditDatasetWidget from "./SingleDatasetWidget";
type Props = {
  onFormEvent?: DynamicEditFormProps["onFormEvent"];
  data?: any;
  guiSlug: string;
  datasetDesignSlug?: string;
  datasetSlug?: string;
  selectedTabData?: IncludeTabs;
  onEdit?: (_: Dataset) => void;
};

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

const DatasetWidget: React.FC<Props> = ({
  selectedTabData,
  datasetSlug,
  guiSlug,
  onEdit,
  ...rest
}) => {
  const { data: dataset } = useGetItem({
    modelName: ApiModels.Dataset,
    slug: datasetSlug,

    queryOptions: { enabled: false },
  });

  const [selectDatasetSlug, setSelectDatasetSlug] =
    useState<string | undefined>();

  useEffect(() => {
    if (
      selectedTabData?.record_type === "single" &&
      selectedTabData?.association_type === "reference_table"
    ) {
      setSelectDatasetSlug(
        dataset?.fields?.[selectedTabData.linking_field] as string
      );
    } else if (
      selectedTabData?.record_type === "single" &&
      selectedTabData?.association_type === "this_table"
    ) {
      DatasetModel.list({
        query: {
          dataset_type_slug: selectedTabData.dataset_to_include,
          limit: 1,
          field_name: selectedTabData.linking_field,
          field_value: datasetSlug,
        },
        path: `list/${selectedTabData.dataset_to_include}`,
      }).then((res) => {
        const otherDataset = res.data?.[0];
        setSelectDatasetSlug(otherDataset?.slug);
      });
    }
  }, [
    dataset?.fields,
    datasetSlug,
    selectedTabData?.association_type,
    selectedTabData?.dataset_to_include,
    selectedTabData?.linking_field,
    selectedTabData?.record_type,
  ]);

  const handleEdit = (d: Dataset) => {
    onEdit?.(d);
  };
  return (
    <React.Fragment>
      {selectDatasetSlug && selectedTabData?.record_type === "single" && (
        <EditDatasetWidget
          {...rest}
          datasetDesignSlug={selectedTabData.dataset_to_include}
          datasetSlug={selectDatasetSlug}
          includedFieldIds={selectedTabData.included_fields}
          guiSlug={guiSlug}
          onEdit={handleEdit}
        />
      )}
      {selectedTabData?.record_type === "list" && (
        <ListDatasetWidget
          {...rest}
          key={selectedTabData?.id}
          datasetDesignSlug={selectedTabData?.dataset_to_include!}
          includedFieldIds={selectedTabData?.included_fields}
          datasetQueryFilter={{
            field_name:
              selectedTabData?.association_type === "reference_table"
                ? "slug"
                : selectedTabData?.linking_field,
            field_value:
              selectedTabData?.association_type === "reference_table"
                ? (dataset?.fields?.[selectedTabData?.linking_field!] as string)
                : datasetSlug,
          }}
          onEditHandler={handleEdit as any}
        />
      )}
    </React.Fragment>
  );
};

export default DatasetWidget;
