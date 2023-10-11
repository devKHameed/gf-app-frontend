import { SettingsOutlined } from "@mui/icons-material";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import { Box, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import GfDrawer from "components/GfDrawer";
import Scrollbar from "components/Scrollbar";
import useOpenClose from "hooks/useOpenClose";
import AnimationLayout, {
  AnimationLayoutRef,
  Config,
} from "layouts/AnimationLayout";
import { queryClient } from "queries";
import { ApiModels } from "queries/apiModelMapping";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import useSystemLayoutStore from "store";
import { getSearchParams } from "utils";
import FieldsSelection from "./FieldsSelection";
import TabCreator from "./TabCreator";
import GuiSidenavMain from "./WidgetMain";
import GuiSideRules from "./WidgetRules";

const DrawerBox = styled(GfDrawer)(({ theme }) => ({
  ".MuiDrawer-paper ": {
    ".MuiPaper-root ": {
      background: `${theme.palette.background.GFTopNav} !important`,
      boxShadow: "none",

      ".MuiCard-root": {
        background: `${theme.palette.background.GFRightNavForeground} !important`,
        transition: "all 0.4s ease",

        "&:hover": {
          background: `${theme.palette.background.GF20} !important`,
        },
      },
    },

    ".drawer-head": {
      background: theme.palette.background.GFTopNav,
      padding: "15px 20px",
      borderBottom: `1px solid ${theme.palette.other?.divider}`,

      ".drawer-icon-holder": {
        width: "auto",
        height: "auto",
        background: "none",
      },

      ".drawer-title-holder": {
        padding: "0 0 0 11px",
      },
    },

    ".draggable-handle": {
      padding: "0",
    },
  },
}));

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
  const [initialComponent, setInitialComponent] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, onOpen, onClose] = useOpenClose();
  const setAppBarProps = useSystemLayoutStore.useSetAppBarProps();
  const { datasetDesignSlug } =
    useParams<{
      slug: string;
      datasetDesignSlug: string;
      datasetSlug: string;
    }>();
  const getComponentMiddleComponent: Config["getComponents"] =
    React.useCallback(
      (gotoComponent, goBack) => {
        return {
          main: (
            <GuiSidenavMain
              gui={gui}
              onEditRules={() => {
                gotoComponent({ name: "rules", id: "rules" });
              }}
              onEditSeachFields={() => {
                gotoComponent({
                  name: "field-selection-search",
                  id: "field-selection-search",
                });
              }}
              onEditFieldToInclude={() => {
                gotoComponent({
                  name: "field-selection-form",
                  id: "field-selection-form",
                });
              }}
              onNewTabAddition={() => {
                searchParams.set("selectedTabId", "new-tab");
                setSearchParams(searchParams);
                setTimeout(() => {
                  gotoComponent({
                    name: "additional-tabs",
                    id: "additional-tabs",
                  });
                }, 0);
              }}
              onEditAddition={(item: IncludeTabs) => {
                searchParams.set("selectedTabId", item.id);
                setSearchParams(searchParams);
                setTimeout(() => {
                  gotoComponent({
                    name: "additional-tabs",
                    id: "additional-tabs",
                  });
                }, 0);
              }}
              onNewWidget={() => {
                searchParams.set("selectedTabId", "new-tab");
                setSearchParams(searchParams);
                setTimeout(() => {
                  gotoComponent({
                    name: "additional-widget",
                    id: "additional-widget",
                  });
                }, 0);
              }}
              onEditWidge={(item: IncludeTabs) => {
                searchParams.set("selectedTabId", item.id);
                setSearchParams(searchParams);
                setTimeout(() => {
                  gotoComponent({
                    name: "additional-widget",
                    id: "additional-widget",
                  });
                }, 0);
              }}
            />
          ),
          "field-selection-search": (
            <FieldsSelection
              gui={gui}
              indexKey={"search_fields"}
              onClickBack={() => goBack()}
            />
          ),
          "field-selection-form": (
            <FieldsSelection
              gui={gui}
              indexKey={"form_fields"}
              onClickBack={() => goBack()}
            />
          ),
          "additional-tabs": (
            <TabCreator
              gui={gui}
              onClickBack={() => {
                searchParams.delete("selectedTabId");
                setSearchParams(searchParams);
                setTimeout(goBack, 0);
              }}
              indexKey="included_tabs"
            />
          ),
          "additional-widget": (
            <TabCreator
              gui={gui}
              onClickBack={() => {
                searchParams.delete("selectedTabId");
                setSearchParams(searchParams);
                setTimeout(goBack, 0);
              }}
              indexKey="included_sidebar_widgets"
            />
          ),
          rules: <GuiSideRules gui={gui} onClickBack={() => goBack()} />,
        };
      },
      [gui]
    );

  useEffect(() => {
    setInitialComponent(getInitialComponent());
  }, []);

  useEffect(() => {
    setAppBarProps({
      // DropDown: <ListingNavBar rightMenu={rightMenu} />,
      rightComponent: (
        <IconButton onClick={onOpen}>
          <SettingsOutlined />
        </IconButton>
      ),

      color: "primary",
    });

    return () => {
      setAppBarProps({});
    };
  }, []);
  const handleClose = () => {
    queryClient.refetchQueries([ApiModels.Dataset, datasetDesignSlug]);
    onClose();
  };
  return (
    <DrawerBox
      anchor={"right"}
      open={open}
      width="420px"
      title="Widget Editor"
      icon={<GridViewOutlinedIcon />}
      onClose={handleClose}
    >
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
    </DrawerBox>
  );
};

export default GuiRightSidenav;
