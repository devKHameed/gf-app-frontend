import { Box, Stack, styled } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import useAppNavigate from "hooks/useAppNavigate";
import { ApiModels } from "queries/apiModelMapping";
import useListItems from "queries/useListItems";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSystemLayoutStore } from "store/stores/systemLayout";
import AddUploadDesignModal from "./AddUploadDesignModal";
import ImporterUploads from "./ImporterUploads";
import UploadDesignSettings from "./UploadDesignSettings";

const CenterBox = styled(Box)(({ theme }) => ({
  flexGrow: "1",
  flexBasis: "0",
  minWidth: "0",
  height: "calc(100vh - 60px)",
}));

const RightSideBox = styled(Box)(({ theme }) => ({
  width: "420px",
  height: "calc(100vh - 60px)",
  background: "#1E1E23",
}));

const AddModal = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);

  const setButtonProps = useSystemLayoutStore.useSetButtonProps();

  useEffect(() => {
    setButtonProps({
      onClick: () => setAddModalOpen(true),
    });
  }, []);

  return (
    <AddUploadDesignModal
      open={addModalOpen}
      onClose={() => setAddModalOpen(false)}
      onSubmit={(data) => {}}
    />
  );
};

type UploadDesignProps = {};

const UploadDesign: React.FC<UploadDesignProps> = () => {
  const { slug: uploadDesignSlug } = useParams<{ slug: string }>();

  const queryClient = useQueryClient();
  const appNavigate = useAppNavigate();

  const setMenu = useSystemLayoutStore.useSetMenu();
  const setItemProps = useSystemLayoutStore.useSetItemProps();

  const { data: uploadDesigns } = useListItems({
    modelName: ApiModels.UploadDesign,
  });

  useEffect(() => {
    setItemProps({
      onClick(item) {
        const data = queryClient.getQueryData<UploadDesign[]>([
          ApiModels.UploadDesign,
        ]);
        const designItem = data?.find((d) => d.slug === item.key);
        if (designItem) {
          queryClient.setQueryData(
            [ApiModels.UploadDesign, item.key],
            designItem
          );

          appNavigate(`/import-module/${designItem.slug}?t=0`);
        }
      },
      isActive(item) {
        return item.key === uploadDesignSlug;
      },
    });
  }, [uploadDesignSlug]);

  useEffect(() => {
    if (uploadDesigns && uploadDesigns.length > 0) {
      setMenu(
        uploadDesigns.map((design) => ({
          title: design.title,
          key: design.slug,
        }))
      );
    }
  }, [uploadDesigns]);

  return (
    <Box>
      <Stack direction="row">
        <CenterBox>
          <ImporterUploads />
        </CenterBox>
        <RightSideBox>
          <UploadDesignSettings />
        </RightSideBox>
      </Stack>
      <AddModal />
    </Box>
  );
};

export default UploadDesign;
