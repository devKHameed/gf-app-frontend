import { Box, Stack, styled, useTheme } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import Scrollbar from "components/Scrollbar";
import useAppNavigate from "hooks/useAppNavigate";
import { ApiModels } from "queries/apiModelMapping";
import useGetItem from "queries/useGetItem";
import useListItems from "queries/useListItems";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSystemLayoutStore } from "store/stores/systemLayout";
import AddVectorKnowledgebaseModal from "./AddVectorKnowledgebaseModal";
import ChatWindow from "./ChatWindow";
import RightSidebar from "./RightSidebar";

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

const AddModal = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  useSystemLayoutStore.useSetButtonProps()({
    onClick: () => setAddModalOpen(true),
  });

  return (
    <AddVectorKnowledgebaseModal
      open={addModalOpen}
      onClose={() => setAddModalOpen(false)}
      onSubmit={(data) => {}}
    />
  );
};

type VectorKnowledgebaseProps = {};

const VectorKnowledgebase: React.FC<VectorKnowledgebaseProps> = (props) => {
  const { slug: vectorKnowledgebaseSlug } = useParams<{ slug: string }>();

  const { data: vectorKnowledgebaseList, isFetched } = useListItems({
    modelName: ApiModels.VectorKnowledgebase,
  });

  const { data: vectorKnowledgebase } = useGetItem({
    modelName: ApiModels.VectorKnowledgebase,
    slug: vectorKnowledgebaseSlug,
  });

  const setMenu = useSystemLayoutStore.useSetMenu();
  const menuItemProps = useSystemLayoutStore.useSetItemProps();
  const setSideNavButtonOptions = useSystemLayoutStore.useSetButtonOptions();
  const setDisableFolders = useSystemLayoutStore.useSetDisableFolders();

  const queryClient = useQueryClient();
  const appNavigate = useAppNavigate();
  const theme = useTheme();

  useEffect(() => {
    setSideNavButtonOptions({ addFolder: false });
    setDisableFolders(true);
  }, []);

  useEffect(() => {
    menuItemProps({
      onClick: (item) => {
        const data = queryClient.getQueryData<DatasetDesign[]>([
          ApiModels.VectorKnowledgebase,
        ]);
        const listItem = data?.find((d) => d.slug === item.key);
        if (listItem) {
          queryClient.setQueryData(
            [ApiModels.VectorKnowledgebase, item.key],
            listItem
          );

          appNavigate(`/vector-knowledgebase-module/${listItem.slug}?t=0`);
        }
      },
      isActive: (item) => item.key === vectorKnowledgebaseSlug,
    });
  }, [vectorKnowledgebaseSlug]);

  useEffect(() => {
    if (
      isFetched &&
      vectorKnowledgebaseList &&
      vectorKnowledgebaseList.length > 0
    ) {
      setMenu(
        vectorKnowledgebaseList.map((vk) => ({
          title: vk.name,
          key: vk.slug,
        }))
      );
    }
  }, [vectorKnowledgebaseList, isFetched]);

  return (
    <>
      {vectorKnowledgebase && (
        <Stack direction="row">
          <CenterBox>
            <ChatWindow />
          </CenterBox>
          <RightSideBox
            sx={{ background: theme.palette.background.GFRightNavBackground }}
          >
            <Scrollbar>
              <RightSidebar vectorKnowledgebase={vectorKnowledgebase} />
            </Scrollbar>
          </RightSideBox>
        </Stack>
      )}
      <AddModal />
    </>
  );
};

export default VectorKnowledgebase;
