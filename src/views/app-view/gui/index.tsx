import { Box, styled, useMediaQuery } from "@mui/material";
import { Stack, useTheme } from "@mui/system";
import { useQueryClient } from "@tanstack/react-query";
import Scrollbar from "components/Scrollbar";
import RenameModel from "components/share-components/RenameModel";
import { GUI_TYPE } from "constants/gui";
import { DocumentElementType } from "enums/Form";
import useAppNavigate from "hooks/useAppNavigate";
import AnimationLayout, {
  AnimationLayoutRef,
  Config,
  TransitionComponent,
} from "layouts/AnimationLayout";
import { isArray } from "lodash";
import { ApiModels } from "queries/apiModelMapping";
import useGetItem from "queries/useGetItem";
import useListItems from "queries/useListItems";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useSystemLayoutStore from "store";
import { DatasetDraft } from "store/stores/dataset";
import { getSearchParams } from "utils";
import AddGuiModalModal from "./AddGuiModal";
import GuiSetting from "./GuiSetting";
import MiddleComponent from "./MiddleComponent";

const AddModel = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  useSystemLayoutStore.useSetButtonProps()({
    onClick: () => setAddModalOpen(true),
  });

  return (
    <AddGuiModalModal
      open={addModalOpen}
      onClose={() => setAddModalOpen(false)}
      onSubmit={(data) => {}}
    />
  );
};

const CenterBox = styled(Box)(({ theme }) => ({
  flexGrow: "1",
  flexBasis: "0",
  minWidth: "0",
  height: "calc(100vh - 60px)",
}));

const RightSideBox = styled(Box)(({ theme }) => ({
  width: "420px",
  height: "calc(100vh - 60px)",
}));
const getInitialComponent = () => {
  return getSearchParams().get("c_name") || "main";
};
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

const Guis = () => {
  const { slug: guiSlug } = useParams<{ slug: string }>();
  const appNavigate = useAppNavigate();

  const goToRightView = useSystemLayoutStore.useGoToRightView();
  const [initialComponent, setInitialComponent] = useState<string>("");
  const layoutRef = useRef<AnimationLayoutRef>(null);

  const queryClient = useQueryClient();
  const theme = useTheme();
  const xlScreen = useMediaQuery(theme.breakpoints.up("xl"));

  const setMenu = useSystemLayoutStore.useSetMenu();
  const menuItemProps = useSystemLayoutStore.useSetItemProps();
  const historyIsSet = useRef(false);

  const { data: guis, isFetched } = useListItems({
    modelName: ApiModels.Gui,
  });

  const { data: gui } = useGetItem({
    modelName: ApiModels.Gui,
    slug: guiSlug,
  });

  useEffect(() => {
    menuItemProps({
      onClick: (item) => {
        layoutRef.current?.reset();
        goToRightView();
        const data = queryClient.getQueryData<GfGui[]>([ApiModels.Gui]);
        const designItem = data?.find((d) => d.slug === item.key);
        if (designItem) {
          queryClient.setQueryData([ApiModels.Gui, item.key], designItem);

          appNavigate(`/gui-module/${designItem.slug}?t=0`);
        }
      },
      isActive: (item) => item.key === guiSlug,
    });
    setInitialComponent(getInitialComponent());
  }, [guiSlug]);

  useLayoutEffect(() => {
    if (!historyIsSet.current) {
      const c = getSearchParams().get("c_name");
      if (c && gui && layoutRef.current) {
        const transitionHistory: TransitionComponent[] = [
          { name: "main", id: "main" },
          { name: c, id: c },
        ];

        layoutRef.current.setTransitionHistory(transitionHistory);

        historyIsSet.current = true;
      }
    }
  }, [gui, xlScreen]);
  useEffect(() => {
    if (isFetched && guis && guis.length > 0) {
      setMenu(
        guis.map((design) => ({
          title: design.name,
          key: design.slug,
          icon: design.icon,
        }))
      );
    }
  }, [guis, isFetched]);

  const getComponentMiddleComponent: Config["getComponents"] =
    React.useCallback(
      (gotoComponent, goBack) => {
        return {
          main: (
            <MiddleComponent
              onEditDashboardClick={() => {
                if (gui?.gui_type === GUI_TYPE.DATASET_LIST) {
                  appNavigate(
                    `/gui-module/${gui.slug}/document-list/${gui.parent_app_id}`
                  );
                } else if (gui?.gui_type === GUI_TYPE.DASHBOARD) {
                  appNavigate(`/gui-module/${gui.slug}/dashboard`);
                }
              }}
            />
          ),
        };
      },
      [gui, appNavigate]
    );
  return (
    <React.Fragment>
      {gui && (
        <Stack direction="row">
          <CenterBox>
            <Scrollbar>
              <Box>
                {gui?.slug && initialComponent && (
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
              <GuiSetting />
            </RightSideBox>
          )}
        </Stack>
      )}
      <AddModel />
      <RenameModel module={ApiModels.Gui} title="Gui" />
    </React.Fragment>
  );
};

export default Guis;
