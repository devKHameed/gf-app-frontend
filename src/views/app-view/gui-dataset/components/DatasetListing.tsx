import { Stack, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { DynamicEditFormProps } from "components/Form/DynamicEditForm";
import { List } from "components/List";
import useOpenClose from "hooks/useOpenClose";
import {
  AnimationLayoutRef,
  TransitionComponent,
} from "layouts/AnimationLayout";
import debounce from "lodash/debounce";
import { ApiModels } from "queries/apiModelMapping";
import useDeleteItem from "queries/useDeleteItem";
import useGetItem from "queries/useGetItem";
import useListInfiniteItems from "queries/useListInfiniteItems";
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DatasetDraft, useDatasetStore } from "store/stores/dataset";
import Swal from "sweetalert2";
import { getSearchParams } from "utils";
import { generateDatasetTransitionHistoryAndDrafts } from "..";
import AddDatasetModel from "../AddDatasetModal";
import DatasetEditDrawer from "../DatasetEditDrawer";

const TabStyle = ({ title }: { title: string }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" spacing={1}>
      <Typography className="tab-text" sx={{ color: "#fff" }}>
        {title}
      </Typography>
      <Typography
        sx={{ color: theme.palette.background.GF40 }}
        className="counter"
      >
        4
      </Typography>
    </Stack>
  );
};
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
  const [searchParams] = useSearchParams();
  const [selectDatasetSlug, setSelectDatasetSlug] = useState();
  const [addDatasetModalOpen, setAddDatasetModalOpen] = useState(false);
  const navigate = useNavigate();
  const [searchTitle, setSearchTitle] = useState("");
  const theme = useTheme();
  const xlScreen = useMediaQuery(theme.breakpoints.up("xl"));
  const smScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [isDrawerOpen, onDrawerOpen, closeDrawer] = useOpenClose(
    xlScreen && !!selectDatasetSlug
  );

  const pushDatasetDraft = useDatasetStore.usePushDatasetDraft();
  const popDatasetDraft = useDatasetStore.usePopDatasetDraft();
  const setDatasetDrafts = useDatasetStore.useSetDatasetDrafts();

  const { data: datasetDesign } = useGetItem({
    modelName: "dataset-design",
    slug: slug,
  });

  const { data: dataset } = useGetItem({
    modelName: ApiModels.Dataset,
    slug: selectDatasetSlug,
    requestOptions: { path: slug },
  });

  const { mutate: deleteDataset } = useDeleteItem({
    modelName: ApiModels.Dataset,
  });

  const queryClient = useQueryClient();

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
        title: searchTitle,
        ...datasetQueryFilter,
      },
      path: `list/${slug}`,
    },
    queryKey: [
      ApiModels.Dataset,
      { dataset_type_slug: slug, title: searchTitle, ...datasetQueryFilter },
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
  const layoutRef = useRef<AnimationLayoutRef>(null);
  const historyIsSet = useRef(false);

  useLayoutEffect(() => {
    if (!historyIsSet.current && xlScreen) {
      setTimeout(() => {
        const c = getSearchParams().get("c");
        if (datasetDesign && layoutRef.current) {
          const transitionHistory: TransitionComponent[] = [];
          const drafts: DatasetDraft[] = [];
          if (dataset && selectDatasetSlug) {
            drafts.push({ data: dataset, fields: datasetDesign.fields.fields });
            transitionHistory.push({
              name: "edit-dataset-form",
              id: dataset.slug,
            });
            const { transitionHistory: tHistory, datasetDrafts: dDrafts } =
              generateDatasetTransitionHistoryAndDrafts(
                c,
                dataset.fields,
                datasetDesign.fields.fields || []
              );
            transitionHistory.push(...tHistory);
            drafts.push(...dDrafts);
          }
          // console.log(
          //   "🚀 ~ file: index.tsx:154 ~ useLayoutEffect ~ transitionHistory:",
          //   transitionHistory,
          //   drafts
          // );
          layoutRef.current.setTransitionHistory(transitionHistory);
          setDatasetDrafts(drafts);

          if (selectDatasetSlug && dataset) {
            historyIsSet.current = true;
          }

          if (slug && datasetDesign && !selectDatasetSlug) {
            historyIsSet.current = true;
          }
        }
      }, Infinity - 1);
    }
  }, [datasetDesign, dataset]);

  useEffect(() => {
    if (selectDatasetSlug) {
      if (xlScreen) {
        onDrawerOpen();
      }
    }
  }, []);

  const onDrawerClose = () => {
    closeDrawer();
    popDatasetDraft();
  };

  const handleEdit = (item: Record<string, any>) => {
    // navigate(`${item.slug}`);
    // console.log("navigate");
    if (item) {
      if (xlScreen) {
        pushDatasetDraft(
          {
            data: item,
            fields: datasetDesign?.fields?.fields,
          },
          false
        );
        setSelectDatasetSlug(item.slug);
        onDrawerOpen();
      } else {
        onEditHandler?.(item);
      }
    }
  };

  const handleDeleteClick = (item: Dataset) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        deleteDataset(
          { slug: `${slug}/${item.slug}` },
          {
            onSuccess(data, variables, context) {
              queryClient.setQueryData<InfiniteData<ApiResponse<Dataset[]>>>(
                [
                  [
                    ApiModels.Dataset,
                    { dataset_type_slug: slug, title: searchTitle },
                  ],
                ],
                (prev) => {
                  if (!prev) return prev;

                  return {
                    ...prev,
                    pages: prev.pages.map((page) => ({
                      ...page,
                      data: page.data.filter((i) => i.slug !== item.slug),
                    })),
                  };
                }
              );
            },
          }
        );
      }
    });
  };

  const handleItemClick = (item: Record<string, any>) => {
    if (smScreen) handleEdit(item);
  };
  return (
    <React.Fragment>
      <List
        data={datasets}
        handleSearch={debounce((e) => {
          setSearchTitle(e.target.value);
        }, 300)}
        keyBinding={{
          title: "title",
          createdAt: "created_at",
          updatedAt: "updated_at",
        }}
        addButtonProps={{ onClick: () => setAddDatasetModalOpen(true) }}
        onEditHandler={handleEdit}
        showLoadMoreButton={hasNextPage}
        loading={isFetching}
        onLoadMore={fetchNextPage}
        onItemClick={handleItemClick}
        onDeleteClick={handleDeleteClick}
      />
      <AddDatasetModel
        open={addDatasetModalOpen}
        onClose={() => setAddDatasetModalOpen(false)}
        includedFieldIds={includedFieldIds!}
        datasetDesignSlug={slug}
      />
      <DatasetEditDrawer
        onFormEvent={onFormEvent}
        open={isDrawerOpen}
        onClose={onDrawerClose}
        layoutRef={layoutRef}
        // guiSlug={guiSlug}
        datasetDesignSlug={slug}
        datasetSlug={selectDatasetSlug}
        includedFieldIds={includedFieldIds!}
      />
    </React.Fragment>
  );
};

export default DatasetListing;
