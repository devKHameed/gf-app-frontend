import { DeleteOutline } from "@mui/icons-material";
import EditOutlined from "@mui/icons-material/EditOutlined";
import LocalOfferOutlined from "@mui/icons-material/LocalOfferOutlined";
import { Box, Stack } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import FieldIcon from "components/Form/FieldIcon";
import SidebarSection from "components/RightSidebar/SidebarSection";
import { ApiModels } from "queries/apiModelMapping";
import useGetItem from "queries/useGetItem";
import useListItems from "queries/useListItems";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import InfoList from "stories/CompoundComponent/AccountInfoCard/AccountInfoCard/AccountInfoCard";
import ProfileCard from "stories/CompoundComponent/ProfileCard/ProfileCard";

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

const InfoListWrap = styled(InfoList)(({ theme }) => {
  return {
    ".MuiList-root": {
      padding: "12px 0 8px",
    },
  };
});

const GuiSidenavMain: React.FC<{
  gui: GfGui;
  onEditSeachFields: () => void;
  onEditFieldToInclude: () => void;
  onEditRules: () => void;
  onNewTabAddition: () => void;
  onEditAddition: (_: IncludeTabs) => void;
  onNewWidget: () => void;
  onEditWidge: (_: IncludeTabs) => void;
}> = ({
  gui,
  onEditSeachFields,
  onEditRules,
  onNewTabAddition,
  onEditFieldToInclude,
  onEditAddition,
  onNewWidget,
  onEditWidge,
}) => {
  const { view_filters = [] } = gui?.filter_settings || {};
  const searchFieldsIds = gui.dataset_list_settings?.search_fields;
  const formFieldsIds = gui.dataset_list_settings?.form_fields;
  const includedTabs = gui.dataset_list_settings?.included_tabs;
  const includedWdigets = gui.dataset_list_settings?.included_sidebar_widgets;

  const {
    slug: guiSlug,
    datasetDesignSlug,
    // datasetSlug,
  } =
    useParams<{
      slug: string;
      datasetDesignSlug: string;
      datasetSlug: string;
    }>();
  const { data: datasetDesign } = useGetItem({
    modelName: ApiModels.DatasetDesign,
    slug: datasetDesignSlug,
    queryOptions: { enabled: false },
  });

  const { data: datasetDesigns } = useListItems({
    modelName: ApiModels.DatasetDesign,
    queryOptions: { enabled: false },
  });
  const theme = useTheme();

  const searchFields = useMemo(() => {
    return datasetDesign?.fields?.fields?.filter((f) =>
      searchFieldsIds?.includes(f.id)
    );
  }, [searchFieldsIds, datasetDesign?.fields?.fields]);

  const formFields = useMemo(() => {
    return datasetDesign?.fields?.fields?.filter((f) =>
      formFieldsIds?.includes(f.id)
    );
  }, [formFieldsIds, datasetDesign?.fields?.fields]);

  const datasetDesignsMap = useMemo(() => {
    const datasetMap = new Map<string, DatasetDesign>();
    datasetDesigns?.find((dd) => {
      datasetMap.set(dd.slug, dd);
    });
    return datasetMap;
  }, [datasetDesigns]);
  return (
    <React.Fragment>
      <SidebarSectionWrap title="Data View Filters" rightIcon={false}>
        <ProfileCard
          options={{
            draggable: false,
            switcher: false,
          }}
          rightIcon={
            <Stack direction="row" spacing={1}>
              <Box className="edit-icon">
                <DeleteOutline
                  sx={{ color: "grey.500" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Delete logic
                  }}
                />
              </Box>
              <Box className="edit-icon">
                <EditOutlined sx={{ color: "grey.500" }} />
              </Box>
            </Stack>
          }
          subTitle={`${view_filters?.length} Inactive`}
          title={`${view_filters?.length} Active Rules`}
          sx={{
            background: theme.palette.background.GFRightNavForeground,
            height: 48,
            ".MuiTypography-subtitle1": {
              margin: "0 0 2px",
            },

            ".card-inner-content": {
              gap: "2px",
            },
          }}
          onClick={() => onEditRules?.()}
        />
      </SidebarSectionWrap>
      <SidebarSectionWrap title="Data Search Fields" rightIcon={false}>
        <InfoListWrap
          data={searchFields?.map((f) => {
            const Icon =
              FieldIcon[f.type as keyof typeof FieldIcon] || LocalOfferOutlined;
            return {
              title: f.title,
              icon: <Icon />,
            };
          })}
          headerRightIcon={
            <Box className="edit-icon">
              <EditOutlined
                onClick={onEditSeachFields}
                sx={{ color: "grey.500" }}
              />
            </Box>
          }
          title={"Included Fields"}
          sx={{
            "&:hover": {
              background: theme.palette.background.GFRightNavForeground,
            },
          }}
        />
      </SidebarSectionWrap>

      <SidebarSectionWrap title="Fields to Include" rightIcon={false}>
        <InfoListWrap
          data={formFields?.map((f) => {
            const Icon =
              FieldIcon[f.type as keyof typeof FieldIcon] || LocalOfferOutlined;
            return {
              title: f.title,
              icon: <Icon />,
            };
          })}
          headerRightIcon={
            <Box className="edit-icon">
              <EditOutlined
                onClick={onEditFieldToInclude}
                sx={{ color: "grey.500" }}
              />
            </Box>
          }
          title={"Included Fields"}
          sx={{
            "&:hover": {
              background: theme.palette.background.GFRightNavForeground,
            },
          }}
        />
      </SidebarSectionWrap>

      <SidebarSectionWrap
        title="Additional Tabs"
        onRightIconClick={onNewTabAddition}
      >
        {includedTabs?.map((tab) => {
          const fieldName = datasetDesignsMap
            .get(tab.dataset_to_include)
            ?.fields?.fields?.find(
              (f) => f.id === tab.parent_dataset_field
            )?.title;
          const inforList = [
            {
              title: tab.name,
              icon: "Name :",
            },
            {
              title: datasetDesignsMap.get(tab.dataset_to_include)?.name,
              icon: "Included Dataset :",
            },
            {
              title: tab.association_type,
              icon: "Association Type :",
            },
            {
              title: fieldName,
              icon: "Parent Dataset Field :",
            },
          ];
          if (tab.association_type !== "parent") {
            inforList.push({
              title: tab.record_type,
              icon: "Record Type :",
            });
          }
          return (
            <InfoListWrap
              data={inforList}
              headerRightIcon={
                <Box className="edit-icon">
                  <EditOutlined
                    onClick={() => onEditAddition(tab)}
                    sx={{ color: "grey.500" }}
                  />
                </Box>
              }
              title={"Included Fields"}
              sx={{
                marginBottom: "10px",
                "&:hover": {
                  background: theme.palette.background.GFRightNavForeground,
                },
              }}
            />
          );
        })}
      </SidebarSectionWrap>
      <SidebarSectionWrap title="Sidebar Widget" onRightIconClick={onNewWidget}>
        {includedWdigets?.map((tab) => {
          const fieldName = datasetDesignsMap
            .get(tab.dataset_to_include)
            ?.fields?.fields?.find(
              (f) => f.id === tab.parent_dataset_field
            )?.title;
          const inforList = [
            {
              title: tab.name,
              icon: "Name :",
            },
            {
              title: datasetDesignsMap.get(tab.dataset_to_include)?.name,
              icon: "Included Dataset :",
            },
            {
              title: tab.association_type,
              icon: "Association Type :",
            },
            {
              title: fieldName,
              icon: "Parent Dataset Field :",
            },
          ];
          if (tab.association_type !== "parent") {
            inforList.push({
              title: tab.record_type,
              icon: "Record Type :",
            });
          }
          return (
            <InfoListWrap
              data={inforList}
              headerRightIcon={
                <Box className="edit-icon">
                  <EditOutlined
                    onClick={() => onEditWidge(tab)}
                    sx={{ color: "grey.500" }}
                  />
                </Box>
              }
              title={"Included Fields"}
              sx={{
                marginBottom: "10px",
                "&:hover": {
                  background: theme.palette.background.GFRightNavForeground,
                },
              }}
            />
          );
        })}
      </SidebarSectionWrap>
    </React.Fragment>
  );
};

export default GuiSidenavMain;
