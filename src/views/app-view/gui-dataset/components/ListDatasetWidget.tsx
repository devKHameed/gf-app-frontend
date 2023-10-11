import styled from "@emotion/styled";
import EditOutlined from "@mui/icons-material/EditOutlined";
import { Box } from "@mui/material";
import useTheme from "@mui/material/styles/useTheme";
import { DynamicEditFormProps } from "components/Form/DynamicEditForm";
import { ApiModels } from "queries/apiModelMapping";
import useGetItem from "queries/useGetItem";
import useListInfiniteItems from "queries/useListInfiniteItems";
import React, { useMemo } from "react";
import InfoList from "stories/CompoundComponent/AccountInfoCard/AccountInfoCard/AccountInfoCard";

const InfoListWrap = styled(InfoList)(({ theme }) => {
  return {
    ".MuiList-root": {
      padding: "12px 0 8px",
    },
  };
});

const DatasetListing = ({
  onEditHandler,
  onFormEvent,
  includedFieldIds,
  // datasetSlug,
  datasetDesignSlug: slug,
  datasetQueryFilter,
}: {
  onEditHandler: (item?: Record<string, any>) => void;
  onFormEvent?: DynamicEditFormProps["onFormEvent"];
  includedFieldIds?: string[];
  // datasetSlug?: string;
  datasetDesignSlug: string;
  datasetQueryFilter: { [key: string]: any };
}) => {
  const { data: datasetDesign } = useGetItem({
    modelName: "dataset-design",
    slug: slug,
  });

  const theme = useTheme();

  const {
    data: datasetResult,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetched,
  } = useListInfiniteItems({
    modelName: ApiModels.Dataset,
    requestOptions: {
      query: {
        dataset_type_slug: slug,
        ...datasetQueryFilter,
      },
      path: `list/${slug}`,
    },
    queryKey: [
      ApiModels.Dataset,
      { dataset_type_slug: slug, ...datasetQueryFilter },
    ],
  });

  const datasets = useMemo(() => {
    const paginatedData: Dataset[] = [];
    datasetResult?.pages.forEach((group) => {
      group.data.forEach((data) => {
        paginatedData.push(data);
      });
    });
    return paginatedData;
  }, [datasetResult]);

  return (
    <React.Fragment>
      <InfoListWrap
        data={datasets?.map((d) => {
          return {
            title: d.title,
            icon: "Record title:",
            rightIcon: (
              <Box className="edit-icon">
                <EditOutlined
                  onClick={() => onEditHandler?.(d)}
                  sx={{ color: "grey.500" }}
                />
              </Box>
            ),
          };
        })}
        title={datasetDesign?.name}
        sx={{
          "&:hover": {
            background: theme.palette.background.GFRightNavForeground,
          },
        }}
      />
    </React.Fragment>
  );
};

export default DatasetListing;
