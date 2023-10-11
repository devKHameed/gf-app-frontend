import { Box, styled, useMediaQuery } from "@mui/material";
import { Stack, useTheme } from "@mui/system";
import { useQueryClient } from "@tanstack/react-query";
import Scrollbar from "components/Scrollbar";
import RenameModel from "components/share-components/RenameModel";
import { DocumentElementType } from "enums/Form";
import useAppNavigate from "hooks/useAppNavigate";
import { TransitionComponent } from "layouts/AnimationLayout";
import { isArray } from "lodash";
import { ApiModels } from "queries/apiModelMapping";
import useGetItem from "queries/useGetItem";
import useListItems from "queries/useListItems";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useSystemLayoutStore from "store";
import { DatasetDraft } from "store/stores/dataset";
import AddDatasetDesignModal from "./AddDatacardDesignModal";
import DatacardDesignSetting from "./DatacardDesignSetting";
import MiddleComponent from "./MiddleComponent";

const AddModel = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  useSystemLayoutStore.useSetButtonProps()({
    onClick: () => setAddModalOpen(true),
  });

  return (
    <AddDatasetDesignModal
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

const DataCardDesign = () => {
  const { slug: datacardDesignSlug } =
    useParams<{ slug: string; datasetSlug: string }>();
  const appNavigate = useAppNavigate();
  const goToRightView = useSystemLayoutStore.useGoToRightView();

  const queryClient = useQueryClient();
  const theme = useTheme();
  const xlScreen = useMediaQuery(theme.breakpoints.up("xl"));

  const setMenu = useSystemLayoutStore.useSetMenu();
  const menuItemProps = useSystemLayoutStore.useSetItemProps();

  const { data: datacardDesigns, isFetched } = useListItems({
    modelName: ApiModels.DatacardDesign,
    requestOptions: {
      path: `contacts`,
    },
  });

  const { data: datacardDesign } = useGetItem({
    modelName: ApiModels.DatacardDesign,
    slug: datacardDesignSlug,
    requestOptions: {
      path: `contacts`,
    },
  });

  useEffect(() => {
    menuItemProps({
      onClick: (item) => {
        goToRightView();
        const data = queryClient.getQueryData<DatacardDesign[]>([
          ApiModels.DatacardDesign,
        ]);
        const designItem = data?.find((d) => d.slug === item.key);
        if (designItem) {
          queryClient.setQueryData(
            [ApiModels.DatacardDesign, item.key],
            designItem
          );

          appNavigate(`/datacard-design-module/${designItem.slug}?t=0`);
        }
      },
      isActive: (item) => item.key === datacardDesignSlug,
    });
  }, [datacardDesignSlug]);

  useEffect(() => {
    if (isFetched && datacardDesigns && datacardDesigns.length > 0) {
      setMenu(
        datacardDesigns.map((design) => ({
          title: design.name,
          key: design.slug,
          icon: design.icon,
        }))
      );
    }
  }, [datacardDesigns, isFetched]);

  return (
    <React.Fragment>
      {datacardDesign && (
        <Stack direction="row">
          <CenterBox>
            <Scrollbar>
              <Box>
                <MiddleComponent />
              </Box>
            </Scrollbar>
          </CenterBox>
          {xlScreen && (
            <RightSideBox
              sx={{ background: theme.palette.background.GFRightNavBackground }}
            >
              <DatacardDesignSetting />
            </RightSideBox>
          )}
        </Stack>
      )}
      <AddModel />
      <RenameModel module={ApiModels.DatacardDesign} title="Datacard Design" />
    </React.Fragment>
  );
};

export default DataCardDesign;
