import { MenuBook } from "@mui/icons-material";
import { Box, DrawerProps, styled } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { DynamicFieldProps } from "components/Form/DynamicEditFields";
import DynamicEditForm, {
  DynamicEditFormProps,
  FormRefAttribute,
} from "components/Form/DynamicEditForm";
import { transformFieldsOptions } from "components/Form/helper";
import GfDrawer from "components/GfDrawer";
import GenericIcon from "components/util-components/Icon";
import { Icons } from "constants/index";
import { DocumentElementType } from "enums/Form";
import AnimationLayout, {
  AnimationLayoutRef,
  Config,
} from "layouts/AnimationLayout";
import find from "lodash/find";
import last from "lodash/last";
import { ApiModels } from "queries/apiModelMapping";
import useGetItem from "queries/useGetItem";
import useUpdateItem from "queries/useUpdateItem";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDatasetStore } from "store/stores/dataset";
import { getSearchParams } from "utils";
import EditTableFields from "./EditTableFields";
const generalFields: DataFieldMapped[] = [
  {
    type: "label",
    name: "label",
    label: "General Setting",
    sx: {
      ".MuiFormLabel-root": {
        color: "text.primary",
        fontSize: "16px",
        lineHeight: "24px",
        fontWeight: "600",
        margin: "0",
        textTransform: "capitalize",
      },
    },
  },
  {
    type: DocumentElementType.TextField,
    name: "title",
    label: "Title",
    required: true,
  },
];
type Props = {
  onFormEvent?: DynamicEditFormProps["onFormEvent"];
  layoutRef: React.RefObject<AnimationLayoutRef>;
} & DrawerProps;

const DrawerBox = styled(GfDrawer)(({ theme }) => ({
  ".MuiPaper-root ": {
    background: theme.palette.background.GFTopNav,
    boxShadow: "none",
  },
}));
const DynamicContentWrap = styled(Box)(({ theme }) => ({
  padding: "20px 20px",

  ".MuiGrid-root": {
    maxWidth: "inherit",
    width: "100%",
    flexBasis: "inherit",
  },

  ".MuiGrid-grid-xs-4": {
    display: "none",
  },

  ".MuiDivider-root": {
    display: "none",
  },

  ".MuiFormLabel-root": {
    fontSize: "12px",
    lineHeight: "1",
    fontWeight: "600",
    color: theme.palette.background.GF80,
    marginBottom: "8px",
    textTransform: "uppercase",
  },

  ".MuiFormControl-root ": {
    margin: "0 0 18px",

    ".MuiFormControl-root ": {
      margin: "0",
    },
  },

  ".MuiCard-root": {
    padding: "0",

    "> div > div": {
      marginTop: "0",
    },
  },
}));
const DatasetEditDrawer = ({ onFormEvent, layoutRef, ...rest }: Props) => {
  const { slug: datasetDesignSlug, datasetSlug } =
    useParams<{ slug?: string; datasetSlug?: string }>();
  const queryClient = useQueryClient();

  const defaultList = queryClient.getQueryData<Dataset[]>([
    [ApiModels.Dataset, { dataset_type_slug: datasetDesignSlug, title: "" }],
  ]);

  const defaultData = find(defaultList, { slug: datasetSlug });

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
  return (
    <DrawerBox
      anchor={"right"}
      title={dataset?.title}
      icon={<GenericIcon iconName={datasetDesign?.icon as Icons} />}
      width="420px"
      tablist={[
        { label: "", key: "tab1", icon: <MenuBook /> },
        { label: "", key: "tab2", icon: <MenuBook /> },
      ]}
      {...rest}
    >
      <DynamicContentWrap>
        {dataset && (
          <DrawerContent
            fields={fields}
            formRef={formRef}
            dataset={dataset}
            submitHandler={submitHandler}
            onFormEvent={onFormEvent}
            layoutRef={layoutRef}
            datasetSlug={datasetSlug}
          />
        )}
      </DynamicContentWrap>
    </DrawerBox>
  );
};

const EditTableFieldsContainer = styled(Box)({
  ".edit-table-fields-container": {
    padding: 0,
  },
});

const DrawerContent: React.FC<{
  fields: DataFieldMapped[];
  formRef: React.MutableRefObject<FormRefAttribute | undefined>;
  dataset: Dataset;
  submitHandler: (data: Record<string, any>) => void;
  onFormEvent?: DynamicEditFormProps["onFormEvent"];
  layoutRef: React.RefObject<AnimationLayoutRef>;
  datasetSlug?: string;
}> = (props) => {
  const { fields, formRef, dataset, submitHandler, layoutRef, datasetSlug } =
    props;

  const datasetDrafts = useDatasetStore.useDatasetDrafts();
  const pushDatasetDraft = useDatasetStore.usePushDatasetDraft();
  const updateDatasetDraft = useDatasetStore.useUpdateDatasetDraft();
  const mergeDatasetDraftTail = useDatasetStore.useMergeDatasetDraftTail();
  const deleteDatasetDraftAtIndex =
    useDatasetStore.useDeleteDatasetDraftAtIndex();

  const [initialComponent, setInitialComponent] = useState("");

  useEffect(() => {
    setInitialComponent(getInitialComponent());
  }, []);

  const getInitialComponent = () => {
    return getSearchParams().get("c_name") || "edit-dataset-form";
  };

  const getComponents: Config["getComponents"] = useCallback(
    (gotoComponent, goBack) => {
      return {
        "edit-dataset-form": (
          <DynamicEditForm
            name={"fields"}
            fields={fields as DynamicFieldProps[]}
            ref={formRef}
            defaultValues={dataset}
            onSubmit={submitHandler}
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
            disableTableActions={{ add: false, edit: true, remove: false }}
            recordListView="list"
            tooltipProps={{ placement: "left" }}
          />
        ),
        "table-fields-form": (
          <EditTableFieldsContainer>
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
              recordListView="list"
            />
          </EditTableFieldsContainer>
        ),
      };
    },
    [
      dataset,
      datasetDrafts,
      deleteDatasetDraftAtIndex,
      fields,
      formRef,
      mergeDatasetDraftTail,
      pushDatasetDraft,
      submitHandler,
      updateDatasetDraft,
    ]
  );
  return initialComponent ? (
    <AnimationLayout
      ref={layoutRef}
      config={{
        getComponents,
        initialComponent,
      }}
    />
  ) : null;
};

export default DatasetEditDrawer;
