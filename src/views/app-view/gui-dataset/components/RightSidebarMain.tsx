import { styled } from "@mui/material/styles";
import SidebarSection from "components/RightSidebar/SidebarSection";
import useOpenClose from "hooks/useOpenClose";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import AddDatasetModel from "../AddDatasetModal";
import DatasetWidget from "./DatasetWidgets";
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

const GuiSidenavMain: React.FC<{
  gui: GfGui;
  onEditDataset: (_: Dataset, w: IncludeTabs) => void;
}> = ({ gui, onEditDataset }) => {
  const widgets = gui.dataset_list_settings?.included_sidebar_widgets;
  const [open, onOpen, onClose] = useOpenClose();
  const [selectedDatasetDesignProps, setSelectedDatasetDesignProps] =
    useState<IncludeTabs>();

  const {
    slug: guiSlug,
    datasetDesignSlug,
    datasetSlug,
  } = useParams<{
    slug: string;
    datasetDesignSlug: string;
    datasetSlug: string;
  }>();

  return (
    <React.Fragment>
      {widgets?.map((widget) => (
        <SidebarSectionWrap
          title={widget.name!}
          // rightIcon={false}
          key={widget.id}
          onRightIconClick={() => {
            onOpen();
            setSelectedDatasetDesignProps(widget);
          }}
        >
          <DatasetWidget
            guiSlug={guiSlug!}
            datasetDesignSlug={datasetDesignSlug}
            datasetSlug={datasetSlug}
            selectedTabData={widget}
            onEdit={(d) => {
              onEditDataset(d, widget);
            }}
          />
        </SidebarSectionWrap>
      ))}
      <AddDatasetModel
        // gui={gui!}
        includedFieldIds={selectedDatasetDesignProps?.included_fields || []}
        datasetDesignSlug={selectedDatasetDesignProps?.dataset_to_include!}
        onClose={onClose}
        open={open}
      />
    </React.Fragment>
  );
};

export default GuiSidenavMain;
