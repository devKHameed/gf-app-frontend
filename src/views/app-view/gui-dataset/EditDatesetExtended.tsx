import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {
  Box,
  Stack,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DynamicEditFormProps } from "components/Form/DynamicEditForm";
import AnimationLayout, {
  AnimationLayoutRef,
  Config,
} from "layouts/AnimationLayout";
import { last } from "lodash";
import DatasetModel from "models/Dataset";
import { ApiModels } from "queries/apiModelMapping";
import useGetItem from "queries/useGetItem";
import useListItems from "queries/useListItems";
import React, { useEffect, useRef, useState } from "react";
import { useDatasetStore } from "store/stores/dataset";
import { getSearchParams } from "utils";
import EditDataset from "./EditDateset";
import EditTableFields from "./EditTableFields";
import DatasetListing from "./components/DatasetListing";
type Props = {
  onFormEvent?: DynamicEditFormProps["onFormEvent"];
  data?: any;
  guiSlug: string;
  datasetDesignSlug?: string;
  datasetSlug?: string;
  selectedTabData?: IncludeTabs;
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

const EditDatasetExtended: React.FC<Props> = ({
  selectedTabData,
  datasetSlug,
  guiSlug,
  ...rest
}) => {
  const { data: dataset } = useGetItem({
    modelName: ApiModels.Dataset,
    slug: datasetSlug,

    queryOptions: { enabled: false },
  });
  const { data: listDataset } = useListItems({
    modelName: ApiModels.Dataset,
    queryOptions: { enabled: false },
  });
  const theme = useTheme();
  const xlScreen = useMediaQuery(theme.breakpoints.up("xl"));
  const [initialComponent, setInitialComponent] = useState<string>("");
  const layoutRef = useRef<AnimationLayoutRef>(null);

  const [selectDatasetSlug, setSelectDatasetSlug] =
    useState<string | undefined>();
  const datasetDraft = useDatasetStore.useDatasetDraft();
  const datasetDrafts = useDatasetStore.useDatasetDrafts();
  const setDatasetDrafts = useDatasetStore.useSetDatasetDrafts();
  const pushDatasetDraft = useDatasetStore.usePushDatasetDraft();
  const popDatasetDraft = useDatasetStore.usePopDatasetDraft();
  const updateDatasetDraft = useDatasetStore.useUpdateDatasetDraft();
  const mergeDatasetDraftTail = useDatasetStore.useMergeDatasetDraftTail();
  const deleteDatasetDraftAtIndex =
    useDatasetStore.useDeleteDatasetDraftAtIndex();

  const getInitialComponent = () => {
    if (!xlScreen) {
      return getSearchParams().get("c_name") || "main";
    }

    return "main";
  };

  useEffect(() => {
    setInitialComponent(getInitialComponent());
  }, []);

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

  const getComponentMiddleComponent: Config["getComponents"] =
    React.useCallback(
      (gotoComponent, goBack) => {
        return {
          main: (
            <DatasetListing
              {...rest}
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
                    ? (dataset?.fields?.[
                        selectedTabData?.linking_field!
                      ] as string)
                    : datasetSlug,
              }}
              onEditHandler={(i: any) => {
                setSelectDatasetSlug(i.slug);
                setTimeout(() => {
                  gotoComponent({
                    name: "edit-dataset-form",
                    id: "edit-dataset-form",
                  });
                }, 0);
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
          "edit-dataset-form": (
            <EditBox>
              <BoxHeader direction="row">
                <KeyboardBackspaceIcon
                  onClick={() => {
                    mergeDatasetDraftTail();
                    goBack();
                  }}
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
              <EditDataset
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
                // onSubmit={(data) => {
                //   const field = last(datasetDrafts)?.field;
                //   if (field) {
                //     updateDatasetDraft(field, data);
                //   }
                // }}
                // disableTableActions={{ add: false, edit: true, remove: false }}
                datasetDesignSlug={selectedTabData?.dataset_to_include}
                datasetSlug={selectDatasetSlug}
                includedFieldIds={selectedTabData?.included_fields}
                guiSlug={guiSlug}
              />
            </EditBox>
          ),
        };
      },
      [
        rest,
        selectedTabData?.dataset_to_include,
        selectedTabData?.included_fields,
        selectedTabData?.linking_field,
        datasetSlug,
        datasetDrafts,
        selectDatasetSlug,
        guiSlug,
        deleteDatasetDraftAtIndex,
        pushDatasetDraft,
        mergeDatasetDraftTail,
        updateDatasetDraft,
      ]
    );

  return (
    <React.Fragment>
      {selectDatasetSlug && selectedTabData?.record_type === "single" && (
        <EditDataset
          {...rest}
          datasetDesignSlug={selectedTabData.dataset_to_include}
          datasetSlug={selectDatasetSlug}
          includedFieldIds={selectedTabData.included_fields}
          guiSlug={guiSlug}
        />
      )}
      {selectedTabData?.record_type === "list" && initialComponent && (
        <AnimationLayout
          ref={layoutRef}
          config={{
            getComponents: getComponentMiddleComponent,
            initialComponent,
          }}
        />
      )}
    </React.Fragment>
  );
};

export default EditDatasetExtended;
