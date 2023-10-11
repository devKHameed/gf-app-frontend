import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import InnerPageLayout from "layouts/inner-app-layout";

import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { DynamicEditFormProps } from "components/Form/DynamicEditForm";
import { List } from "components/List";
import GenericIcon from "components/util-components/Icon";
import useAppNavigate from "hooks/useAppNavigate";
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
import { useParams, useSearchParams } from "react-router-dom";
import { DatasetDraft, useDatasetStore } from "store/stores/dataset";
import Swal from "sweetalert2";
import { getSearchParams } from "utils";
import { generateDatasetTransitionHistoryAndDrafts } from ".";
import AddDatasetModel from "./AddDatasetModal";
import DatasetDesignHistory from "./DatasetDesignHistory";
import DatasetDesignSetting from "./DatasetDesignSetting";
import DatasetEditDrawer from "./DatasetEditDrawer";

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
}: {
  onEditHandler: (item?: Record<string, any>) => void;
  onFormEvent?: DynamicEditFormProps["onFormEvent"];
}) => {
  const [searchParams] = useSearchParams();
  const { slug, datasetSlug } =
    useParams<{ slug: string; datasetSlug: string }>();

  const [value, setValue] = useState(Number(searchParams.get("t")) || 0);
  const [addDatasetModalOpen, setAddDatasetModalOpen] = useState(false);
  const appNavigate = useAppNavigate();
  const [searchTitle, setSearchTitle] = useState("");
  const theme = useTheme();
  const xlScreen = useMediaQuery(theme.breakpoints.up("xl"));
  const smScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [isDrawerOpen, onDrawerOpen, closeDrawer] = useOpenClose(
    xlScreen && !!datasetSlug
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
    slug: datasetSlug,
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
      },
      path: `list/${slug}`,
    },
    queryKey: [
      ApiModels.Dataset,
      { dataset_type_slug: slug, title: searchTitle },
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

  const tabLists = useMemo(() => {
    const tabs = [
      {
        label: <TabStyle title="Records" />,
      },
      {
        label: <TabStyle title="History" />,
      },
    ];
    if (!xlScreen)
      tabs.push({
        label: <TabStyle title="Setting" />,
      });
    return tabs;
  }, [xlScreen]);

  useLayoutEffect(() => {
    if (!historyIsSet.current && xlScreen) {
      setTimeout(() => {
        const c = getSearchParams().get("c");
        if (datasetDesign && layoutRef.current) {
          const transitionHistory: TransitionComponent[] = [];
          const drafts: DatasetDraft[] = [];
          if (dataset && datasetSlug) {
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

          if (datasetSlug && dataset) {
            historyIsSet.current = true;
          }

          if (slug && datasetDesign && !datasetSlug) {
            historyIsSet.current = true;
          }
        }
      }, Infinity - 1);
    }
  }, [datasetDesign, dataset]);

  useEffect(() => {
    if (datasetSlug) {
      if (xlScreen) {
        onDrawerOpen();
      }
    }
  }, []);

  //Check if you has unmounted tab active
  useEffect(() => {
    if (xlScreen) {
      setValue((prev) => {
        if (prev === 2) return 0;
        return prev;
      });
    }
  }, [xlScreen]);

  const onDrawerClose = () => {
    appNavigate(`/dataset-design/${slug}`);
    closeDrawer();
    popDatasetDraft();
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleEdit = (item: Record<string, any>) => {
    appNavigate(`${item.slug}`);
    if (item) {
      if (xlScreen) {
        pushDatasetDraft(
          {
            data: item,
            fields: datasetDesign?.fields?.fields,
          },
          false
        );
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
      <InnerPageLayout
        icon={
          (datasetDesign?.icon && (
            <GenericIcon
              sx={{
                width: "40px",
                height: "40px",
                color: "text.secondary",
              }}
              iconName={datasetDesign?.icon as any}
              key={datasetDesign?.icon}
            />
          )) as any
        }
        title={datasetDesign?.name}
        onChange={handleChange}
        subtitle={
          <Typography variant="body1" color="text.secondary">
            Description:{" "}
            <Typography
              component="span"
              variant="subtitle1"
              color="text.primary"
            >
              <>{datasetDesign?.description}</>
            </Typography>
          </Typography>
        }
        tabList={tabLists}
        value={value}
      >
        {value === 0 && (
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
        )}
        {value === 1 && <DatasetDesignHistory />}
        {value === 2 && !xlScreen && (
          <Box>
            <DatasetDesignSetting disableScrollbar={true} />
          </Box>
        )}
      </InnerPageLayout>
      <AddDatasetModel
        open={addDatasetModalOpen}
        onClose={() => setAddDatasetModalOpen(false)}
      />
      <DatasetEditDrawer
        onFormEvent={onFormEvent}
        open={isDrawerOpen}
        onClose={onDrawerClose}
        layoutRef={layoutRef}
      />
    </React.Fragment>
  );
};

export default DatasetListing;
