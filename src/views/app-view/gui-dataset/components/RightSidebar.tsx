import { ArrowBack } from "@mui/icons-material";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import SidebarSection from "components/RightSidebar";
import Scrollbar from "components/Scrollbar";
import AnimationLayout, {
  AnimationLayoutRef,
  Config,
} from "layouts/AnimationLayout";
import React, { useEffect, useRef, useState } from "react";
import { useDatasetStore } from "store/stores/dataset";
import { getSearchParams } from "utils";
import { DatasetEditDrawerForm } from "../DatasetEditDrawer";
import RightSidebarMain from "./RightSidebarMain";

const SidebarSectionWrap = styled(SidebarSection)(({ theme }) => {
  return {
    ".MuiCard-root:hover": {
      background: `${theme.palette.background.GFRightNavForeground} !important`,

      ".edit-icon": {
        opacity: "1",
        visibility: "visible",
      },
    },

    ".record-item": {
      transition: "all 0.4s ease",

      "&:hover ": {
        background: theme.palette.background.GF20,

        ".edit-icon": {
          opacity: "1",
          visibility: "visible",
        },
      },
    },

    ".edit-icon": {
      width: "16px",
      height: "16px",
      color: theme.palette.background.GF60,
      transition: "all 0.4s ease",
      opacity: "0",
      visibility: "hidden",
      cursor: "pointer",

      "&:hover": {
        color: theme.palette.text.primary,
      },

      svg: {
        width: "100%",
        height: "auto",
        display: "block",
        color: "currentColor",
      },
    },
  };
});

const DatasetSidebarContainerWrap = styled(Box)(({ theme }) => {
  return {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    marginBottom: 20,

    [`${theme.breakpoints.down("sm")}`]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  };
});

const ScrollbarParent = styled(Box)(({ theme }) => {
  return {
    height: `calc(100vh - 60px)`,
    overflow: "hidden",
  };
});

const getInitialComponent = () => {
  return getSearchParams().get("s_name") || "main";
};
const GuiRightSidenav: React.FC<{ gui: GfGui }> = ({ gui }) => {
  const layoutRef = useRef<AnimationLayoutRef>(null);
  const editFormlayoutRef = useRef<AnimationLayoutRef>(null);
  const [selectedTabData, setSelectedTabData] =
    useState<{ dataset: Dataset; widget: IncludeTabs }>();
  const [initialComponent, setInitialComponent] = useState<string>("");

  const datasetDraft = useDatasetStore.useDatasetDraft();
  const datasetDrafts = useDatasetStore.useDatasetDrafts();
  const setDatasetDrafts = useDatasetStore.useSetDatasetDrafts();
  const pushDatasetDraft = useDatasetStore.usePushDatasetDraft();
  const popDatasetDraft = useDatasetStore.usePopDatasetDraft();
  const updateDatasetDraft = useDatasetStore.useUpdateDatasetDraft();
  const mergeDatasetDraftTail = useDatasetStore.useMergeDatasetDraftTail();
  const deleteDatasetDraftAtIndex =
    useDatasetStore.useDeleteDatasetDraftAtIndex();

  const getComponentMiddleComponent: Config["getComponents"] =
    React.useCallback(
      (gotoComponent, goBack) => {
        return {
          main: (
            <RightSidebarMain
              gui={gui}
              onEditDataset={(dataset, widget) => {
                setSelectedTabData({ dataset, widget });
                setTimeout(() => {
                  gotoComponent({
                    name: "edit-dataset-form",
                    id: "edit-dataset-form",
                  });
                });
              }}
            />
          ),
          "edit-dataset-form": (
            <SidebarSectionWrap
              title={"Go back"}
              onLeftIconClick={() => {
                goBack();
                setSelectedTabData(undefined);
              }}
              rightIcon={false}
              leftIcon={<ArrowBack />}
            >
              <DatasetEditDrawerForm
                layoutRef={editFormlayoutRef}
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
                datasetDesignSlug={selectedTabData?.dataset?.dataset_type_slug}
                datasetSlug={selectedTabData?.dataset?.slug}
                includedFieldIds={
                  selectedTabData?.widget?.included_fields || []
                }
              />
            </SidebarSectionWrap>
          ),
        };
      },
      [
        deleteDatasetDraftAtIndex,
        gui,
        mergeDatasetDraftTail,
        pushDatasetDraft,
        selectedTabData?.dataset?.dataset_type_slug,
        selectedTabData?.dataset?.slug,
        selectedTabData?.widget?.included_fields,
      ]
    );

  useEffect(() => {
    setInitialComponent(getInitialComponent());
  }, []);

  return (
    <Box>
      <ScrollbarParent>
        <Scrollbar>
          <DatasetSidebarContainerWrap>
            {initialComponent && (
              <AnimationLayout
                ref={layoutRef}
                config={{
                  getComponents: getComponentMiddleComponent,
                  initialComponent,
                }}
              />
            )}
          </DatasetSidebarContainerWrap>
        </Scrollbar>
      </ScrollbarParent>
    </Box>
  );
};

export default GuiRightSidenav;
