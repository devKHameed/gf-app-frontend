import { Box, styled, useMediaQuery } from "@mui/material";
import { Stack, useTheme } from "@mui/system";
import { useQueryClient } from "@tanstack/react-query";
import Scrollbar from "components/Scrollbar";
import RenameModel from "components/share-components/RenameModel";
import { DocumentElementType } from "enums/Form";
import useAppNavigate from "hooks/useAppNavigate";
import AnimationLayout, {
  AnimationLayoutRef,
  Config,
  TransitionComponent,
} from "layouts/AnimationLayout";
import { isArray, throttle } from "lodash";
import last from "lodash/last";
import { ApiModels } from "queries/apiModelMapping";
import useGetItem from "queries/useGetItem";
import useListItems from "queries/useListItems";
import useUpdateItem from "queries/useUpdateItem";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import useSystemLayoutStore from "store";
import { DatasetDraft, useDatasetStore } from "store/stores/dataset";
import { getSearchParams } from "utils";
import AddDatasetModel from "./AddDatasetModal";
import EditTableFields from "./EditTableFields";
import MiddleComponent from "./MiddleComponet";
import RightSidebar from "./components/RightSidebar";
import WidgetEditorDrawer from "./components/WidgetEditorDrawer";
const RightSideBox = styled(Box)(({ theme }) => ({
  width: "420px",
  height: "calc(100vh - 60px)",
}));
const CenterBox = styled(Box)(({ theme }) => ({
  flexGrow: "1",
  flexBasis: "0",
  minWidth: "0",
  height: "calc(100vh - 60px)",
}));

export const generateDatasetTransitionHistoryAndDrafts = (
  currentCompId: string | null,
  fieldValues: Record<string, unknown>,
  fields: DataField[],
  parentKey = "fields"
) => {
  if (!currentCompId) return { transitionHistory: [], datasetDrafts: [] };
  const transitionHistory: TransitionComponent[] = [];
  const datasetDrafts: DatasetDraft[] = [];

  const recordListFields = fields.filter(
    (f) => f.type === DocumentElementType.RecordList
  );
  for (const f of recordListFields) {
    const fieldKey = f.slug;
    const completeKey = parentKey ? `${parentKey}.${fieldKey}` : fieldKey;
    const dataValues = fieldValues[fieldKey];
    if (isArray(dataValues)) {
      for (const d of dataValues) {
        if (d._id === currentCompId) {
          transitionHistory.push({
            name: "table-fields-form",
            id: d._id,
          });

          datasetDrafts.push({
            field: completeKey,
            data: d,
            fields: f.fields,
          });

          return { transitionHistory, datasetDrafts };
        }

        if (f.fields?.length) {
          const nextHistoryAndDrafts =
            generateDatasetTransitionHistoryAndDrafts(
              currentCompId,
              d,
              f.fields,
              fieldKey
            );
          if (nextHistoryAndDrafts.transitionHistory.length) {
            transitionHistory.push(
              {
                name: "table-fields-form",
                id: d._id,
              },
              ...nextHistoryAndDrafts.transitionHistory
            );
            datasetDrafts.push(
              {
                field: completeKey,
                data: d,
                fields: f.fields,
              },
              ...nextHistoryAndDrafts.datasetDrafts
            );
            return { transitionHistory, datasetDrafts };
          }
        }
      }
    }
  }

  return { transitionHistory, datasetDrafts };
};

const AddModal = ({
  gui,
  includedFieldIds,
  datasetDesignSlug,
}: {
  gui?: GfGui;
  includedFieldIds: string[];
  datasetDesignSlug: string;
}) => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  useSystemLayoutStore.useSetButtonProps()({
    onClick: () => setAddModalOpen(true),
  });

  return (
    <AddDatasetModel
      open={addModalOpen}
      onClose={() => setAddModalOpen(false)}
      onSubmit={(data) => {}}
      includedFieldIds={includedFieldIds}
      datasetDesignSlug={datasetDesignSlug}
      // gui={gui}
    />
  );
};

const DatasetDesign = ({
  publicAccess = false,
}: {
  publicAccess?: boolean;
}) => {
  const {
    slug: guiSlug,
    datasetDesignSlug,
    datasetSlug,
  } = useParams<{
    slug: string;
    datasetDesignSlug: string;
    datasetSlug: string;
  }>();
  const appNavigate = useAppNavigate();
  const goToRightView = useSystemLayoutStore.useGoToRightView();
  const setButtonOptions = useSystemLayoutStore.useSetButtonOptions();
  const { data: gui } = useGetItem({
    modelName: ApiModels.Gui,
    slug: guiSlug,
  });
  const queryClient = useQueryClient();
  const theme = useTheme();
  const xlScreen = useMediaQuery(theme.breakpoints.up("xl"));

  const searchValue = useSystemLayoutStore.useSearchValue?.();
  const datasetDraft = useDatasetStore.useDatasetDraft();
  const datasetDrafts = useDatasetStore.useDatasetDrafts();
  const setDatasetDrafts = useDatasetStore.useSetDatasetDrafts();
  const pushDatasetDraft = useDatasetStore.usePushDatasetDraft();
  const popDatasetDraft = useDatasetStore.usePopDatasetDraft();
  const updateDatasetDraft = useDatasetStore.useUpdateDatasetDraft();
  const mergeDatasetDraftTail = useDatasetStore.useMergeDatasetDraftTail();
  const deleteDatasetDraftAtIndex =
    useDatasetStore.useDeleteDatasetDraftAtIndex();

  const setMenu = useSystemLayoutStore.useSetMenu();
  const menuItemProps = useSystemLayoutStore.useSetItemProps();

  const { data: datasets, isFetched } = useListItems({
    modelName: ApiModels.Dataset,
    requestOptions: {
      query: {
        dataset_type_slug: datasetDesignSlug,
        gui_slug: guiSlug,
        title: searchValue,
      },
      path: `list/${datasetDesignSlug}`,
    },
    queryKey: [
      ApiModels.Dataset,
      {
        dataset_type_slug: datasetDesignSlug,
        gui_slug: guiSlug,
        title: searchValue,
      },
    ],
  });

  const { data: datasetDesigns } = useListItems({
    modelName: ApiModels.DatasetDesign,
  });
  const { data: datasetDesign } = useGetItem({
    modelName: "dataset-design",
    slug: datasetDesignSlug,
  });

  const { data: dataset } = useGetItem({
    modelName: ApiModels.Dataset,
    slug: datasetSlug,
    requestOptions: { path: datasetDesignSlug },
  });

  const { mutate: updateDataset } = useUpdateItem({
    modelName: ApiModels.Dataset,
    requestOptions: { path: datasetDesignSlug },
  });

  const [initialComponent, setInitialComponent] = useState<string>("");
  const layoutRef = useRef<AnimationLayoutRef>(null);
  const historyIsSet = useRef(false);

  const debouncedUpdateDataset = useCallback(throttle(updateDataset, 1000), [
    updateDataset,
  ]);

  useEffect(() => {
    if (!datasetSlug && datasets && datasets?.length > 0) {
      if (publicAccess) {
        appNavigate(
          `/gui-module-public/${guiSlug}/document-list/${datasetDesignSlug}/${datasets[0]?.slug}?t=0`,
          { replace: true }
        );
      } else {
        appNavigate(
          `/gui-module/${guiSlug}/document-list/${datasetDesignSlug}/${datasets[0]?.slug}?t=0`,
          { replace: true }
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasets, datasetSlug, appNavigate, guiSlug, datasetDesignSlug]);

  useEffect(() => {
    useSystemLayoutStore.setState({
      layout: "search",
      customSearch: true,
    });
    setButtonOptions({ addFolder: false, addItem: true });
    return () => {
      useSystemLayoutStore.setState({
        layout: "default",
        showActionButtons: true,
        customSearch: false,
      });
      setButtonOptions({ addFolder: true, addItem: true });
    };
  }, []);
  useEffect(() => {
    menuItemProps({
      onClick: (item) => {
        layoutRef.current?.reset();
        goToRightView();
        const data = queryClient.getQueryData<Dataset[]>([
          [ApiModels.Dataset, { dataset_type_slug: datasetDesignSlug }],
        ]);
        const designItem = data?.find((d) => d.slug === item.key);
        if (designItem) {
          queryClient.setQueryData([ApiModels.Dataset, item.key], designItem);
        }

        if (publicAccess) {
          appNavigate(
            `/gui-module-public/${guiSlug}/document-list/${datasetDesignSlug}/${item.key}?t=0`
          );
        } else {
          appNavigate(
            `/gui-module/${guiSlug}/document-list/${datasetDesignSlug}/${item.key}?t=0`
          );
        }
      },
      isActive: (item) => {
        return item.key.toString() === datasetSlug;
      },
    });
    setInitialComponent(getInitialComponent());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasetDesignSlug, datasetSlug, guiSlug]);

  useEffect(() => {
    if (datasets) {
      setMenu(
        datasets.map((design) => ({
          title: design.title,
          key: design.slug,
          icon: "Dataset",
        }))
      );
    }
  }, [datasets, isFetched]);

  useEffect(() => {
    return () => {
      useSystemLayoutStore.setState({ menu: [] });
    };
  }, []);

  useLayoutEffect(() => {
    if (!historyIsSet.current && !xlScreen) {
      const c = getSearchParams().get("c");
      if (datasetDesign && layoutRef.current) {
        const transitionHistory: TransitionComponent[] = xlScreen
          ? []
          : [{ name: "main", id: "main" }];
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
        layoutRef.current.setTransitionHistory(transitionHistory);
        setDatasetDrafts(drafts);

        if (datasetSlug && dataset) {
          historyIsSet.current = true;
        }

        if (datasetDesignSlug && datasetDesign && !datasetSlug) {
          historyIsSet.current = true;
        }
      }
    }
  }, [datasetDesign, dataset]);

  const getInitialComponent = () => {
    if (!xlScreen) {
      return getSearchParams().get("c_name") || "main";
    }

    return "main";
  };

  const getComponentMiddleComponent: Config["getComponents"] =
    React.useCallback(
      (gotoComponent, goBack) => {
        return {
          main: (
            <MiddleComponent
              data={last(datasetDrafts)?.data}
              onFormEvent={(event) => {
                if (event.name === "table-delete") {
                  deleteDatasetDraftAtIndex(event.data.index, event.field);
                } else if (event.name === "table-add") {
                } else if (event.name === "table-edit") {
                  pushDatasetDraft({
                    field: event.field,
                    data: event.data.data as Record<string, unknown>,
                  });
                  gotoComponent({
                    name: "table-fields-form",
                    id: event.data.data._id,
                  });
                } else if (event.name === "table-add-complete") {
                  pushDatasetDraft({
                    field: event.field,
                    data: event.data.data,
                  });
                  mergeDatasetDraftTail();
                } else if (event.name === "table-edit-complete") {
                  pushDatasetDraft({
                    field: event.field,
                    data: event.data.data,
                  });
                  mergeDatasetDraftTail();
                }
              }}
            />
          ),
          "table-fields-form": (
            <EditTableFields
              data={last(datasetDrafts)?.data}
              fields={last(datasetDrafts)?.fields || []}
              onBackClick={() => {
                mergeDatasetDraftTail();
                goBack();
              }}
              onFormEvent={(event) => {
                if (event.name === "table-delete") {
                  deleteDatasetDraftAtIndex(event.data.index, event.field);
                } else if (event.name === "table-add") {
                } else if (event.name === "table-edit") {
                  pushDatasetDraft({
                    field: event.field,
                    data: event.data.data as Record<string, unknown>,
                  });
                  gotoComponent({
                    name: "table-fields-form",
                    id: event.data.data._id,
                  });
                } else if (event.name === "table-add-complete") {
                  pushDatasetDraft({
                    field: event.field,
                    data: event.data.data,
                  });
                  mergeDatasetDraftTail();
                } else if (event.name === "table-edit-complete") {
                  pushDatasetDraft({
                    field: event.field,
                    data: event.data.data,
                  });
                  mergeDatasetDraftTail();
                }
              }}
              onSubmit={(data) => {
                const field = last(datasetDrafts)?.field;
                if (field) {
                  updateDatasetDraft(field, data);
                }
              }}
              disableTableActions={{ add: false, edit: true, remove: false }}
            />
          ),
        };
      },
      [
        datasetDrafts,
        pushDatasetDraft,
        deleteDatasetDraftAtIndex,
        mergeDatasetDraftTail,
        updateDatasetDraft,
      ]
    );

  useEffect(() => {
    if (datasetSlug && datasetDraft.pushUpdate && datasetDraft.draft) {
      debouncedUpdateDataset({ slug: datasetSlug, data: datasetDraft.draft });
    }
  }, [datasetDraft, datasetSlug, debouncedUpdateDataset]);

  return (
    <React.Fragment>
      {datasetDesign?.slug && dataset?.slug && (
        <Stack direction="row">
          <CenterBox>
            <Scrollbar>
              <Box>
                {initialComponent && (
                  <AnimationLayout
                    ref={layoutRef}
                    config={{
                      getComponents: getComponentMiddleComponent,
                      initialComponent,
                    }}
                  />
                )}
              </Box>
            </Scrollbar>
          </CenterBox>
          {xlScreen && (
            <RightSideBox
              sx={{ background: theme.palette.background.GFRightNavBackground }}
            >
              <RightSidebar gui={gui!} />
            </RightSideBox>
          )}
        </Stack>
      )}

      <AddModal
        // gui={gui!}
        includedFieldIds={gui?.dataset_list_settings?.form_fields || []}
        datasetDesignSlug={datasetDesignSlug!}
      />
      <RenameModel module={ApiModels.DatasetDesign} title="Dataset Design" />
      <WidgetEditorDrawer gui={gui!} />
    </React.Fragment>
  );
};

export default DatasetDesign;
