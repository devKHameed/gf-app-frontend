import { Box, Stack, styled, useMediaQuery, useTheme } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import Scrollbar from "components/Scrollbar";
import useAppNavigate from "hooks/useAppNavigate";
import { ApiModels } from "queries/apiModelMapping";
import useGetItem from "queries/useGetItem";
import useListItems from "queries/useListItems";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSystemLayoutStore } from "store/stores/systemLayout";
import AddFinetuneKnowledgebaseModal from "./AddFinetuneKnowledgebaseModal";
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
    <AddFinetuneKnowledgebaseModal
      open={addModalOpen}
      onClose={() => setAddModalOpen(false)}
      onSubmit={(data) => {}}
    />
  );
};

type FinetuneKnowledgebaseProps = {};

const FinetuneKnowledgebase: React.FC<FinetuneKnowledgebaseProps> = (props) => {
  const { slug: finetuneKnowledgebaseSlug } = useParams<{ slug: string }>();

  const { data: finetuneKnowledgebaseList, isFetched } = useListItems({
    modelName: ApiModels.FinetuneKnowledgebase,
  });

  const { data: finetuneKnowledgebase } = useGetItem({
    modelName: ApiModels.FinetuneKnowledgebase,
    slug: finetuneKnowledgebaseSlug,
  });

  const setMenu = useSystemLayoutStore.useSetMenu();
  const menuItemProps = useSystemLayoutStore.useSetItemProps();
  const setSideNavButtonOptions = useSystemLayoutStore.useSetButtonOptions();
  const setDisableFolders = useSystemLayoutStore.useSetDisableFolders();

  const queryClient = useQueryClient();
  const appNavigate = useAppNavigate();
  const theme = useTheme();
  const xlScreen = useMediaQuery(theme.breakpoints.up("xl"));

  useEffect(() => {
    setSideNavButtonOptions({ addFolder: false });
    setDisableFolders(true);
  }, []);

  useEffect(() => {
    menuItemProps({
      onClick: (item) => {
        const data = queryClient.getQueryData<DatasetDesign[]>([
          ApiModels.FinetuneKnowledgebase,
        ]);
        const listItem = data?.find((d) => d.slug === item.key);
        if (listItem) {
          queryClient.setQueryData(
            [ApiModels.FinetuneKnowledgebase, item.key],
            listItem
          );

          appNavigate(`/finetune-knowledgebase-module/${listItem.slug}?t=0`);
        }
      },
      isActive: (item) => item.key === finetuneKnowledgebaseSlug,
    });
  }, [finetuneKnowledgebaseSlug]);

  useEffect(() => {
    if (
      isFetched &&
      finetuneKnowledgebaseList &&
      finetuneKnowledgebaseList.length > 0
    ) {
      setMenu(
        finetuneKnowledgebaseList.map((vk) => ({
          title: vk.name,
          key: vk.slug,
        }))
      );
    }
  }, [finetuneKnowledgebaseList, isFetched]);

  return (
    <>
      {finetuneKnowledgebase && (
        <Stack direction="row">
          <CenterBox>
            <ChatWindow />
          </CenterBox>
          <RightSideBox
            sx={{ background: theme.palette.background.GFRightNavBackground }}
          >
            <Scrollbar>
              <RightSidebar finetuneKnowledgebase={finetuneKnowledgebase} />
            </Scrollbar>
          </RightSideBox>
        </Stack>
      )}
      <AddModal />
    </>
  );
};

export default FinetuneKnowledgebase;
