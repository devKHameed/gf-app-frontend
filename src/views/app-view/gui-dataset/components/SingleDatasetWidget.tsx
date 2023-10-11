import EditOutlined from "@mui/icons-material/EditOutlined";
import { Box, Stack, styled, useTheme } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { DynamicEditFormProps } from "components/Form/DynamicEditForm";
import { DocumentElementType } from "enums/Form";
import { find } from "lodash";
import { ApiModels } from "queries/apiModelMapping";
import useGetItem from "queries/useGetItem";
import React, { useMemo } from "react";
import InfoList from "stories/CompoundComponent/AccountInfoCard/AccountInfoCard/AccountInfoCard";

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
  onEdit?: (_: Dataset) => void;
};

const InfoListWrap = styled(InfoList)(({ theme }) => {
  return {
    ".MuiList-root": {
      padding: "12px 0 8px",
    },
  };
});

const EditDataset: React.FC<Props> = (props) => {
  console.log("props", props);
  const {
    onFormEvent,
    datasetDesignSlug,
    datasetSlug,
    guiSlug,
    includedFieldIds,
    onEdit,
  } = props;
  const theme = useTheme();
  const queryClient = useQueryClient();

  const defaultData = useMemo(() => {
    const defaultList = queryClient.getQueryData([
      [ApiModels.Dataset, { dataset_type_slug: datasetDesignSlug, title: "" }],
    ]) as unknown as DatasetDesign[];

    return find(defaultList, { slug: datasetSlug });
  }, [datasetDesignSlug, datasetSlug, queryClient]) as unknown as Dataset;

  const { data: datasetDesign, isLoading: datasetDesignLoading } = useGetItem({
    modelName: ApiModels.DatasetDesign,
    slug: datasetDesignSlug,
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

  return (
    <React.Fragment>
      <InfoListWrap
        data={includedFields?.map((f) => {
          return {
            title: dataset?.fields?.[f.slug!],
            icon: `${f.title} :`,
          };
        })}
        headerRightIcon={
          <Box className="edit-icon">
            <EditOutlined
              onClick={() => onEdit?.(dataset)}
              sx={{ color: "grey.500" }}
            />
          </Box>
        }
        title={dataset?.title}
        sx={{
          "&:hover": {
            background: theme.palette.background.GFRightNavForeground,
          },
        }}
      />
    </React.Fragment>
  );
};

export default EditDataset;
