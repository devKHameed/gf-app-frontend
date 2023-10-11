import { DeleteOutline } from "@mui/icons-material";
import EditOutlined from "@mui/icons-material/EditOutlined";
import LocalOfferOutlined from "@mui/icons-material/LocalOfferOutlined";
import { Box, Chip, Stack, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import FieldIcon from "components/Form/FieldIcon";
import TagEditWithDataProvider from "components/Form/TagEditor/TagEditWithDataProvider";
import SidebarSection from "components/RightSidebar/SidebarSection";
import { SortableList } from "components/SortableList";
import GenericIcon from "components/util-components/Icon";
import { Icons } from "constants/index";
import useUpdateItem from "queries/useUpdateItem";
import { useEffect, useState } from "react";
import InfoList from "stories/CompoundComponent/AccountInfoCard/AccountInfoCard/AccountInfoCard";
import ProfileCard from "stories/CompoundComponent/ProfileCard/ProfileCard";
import Swal from "sweetalert2";

const DatasetSidebarContainer = styled(Box)(({ theme }) => {
  return {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    height: "100%",
    // width: "420px",

    [`${theme.breakpoints.down("sm")}`]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  };
});

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

const BoxIcon = styled(Box)(({ theme }) => {
  return {
    width: "20px",
    color: theme.palette.background.GF70,

    svg: {
      maxWidth: "100%",
      height: "20px",
      width: "auto",
      display: "block",
      margin: "auto",

      path: {
        fill: "currentColor",
      },
    },
  };
});

let render = 1;
const DatasetDesignSidebar: React.FC<{
  onAddFieldClick?(): void;
  odEditSettingsClick?(): void;
  onAddCardFieldClick?(): void;
  onCardFieldClick?(datacardDesign: DatacardDesign): void;
  onFieldClick?(field: DataField): void;
  datasetDesign?: DatasetDesign;
  datacardDesigns?: DatacardDesign[];
}> = (props) => {
  const {
    onAddFieldClick,
    odEditSettingsClick,
    onAddCardFieldClick,
    onCardFieldClick,
    onFieldClick,
    datasetDesign,
    datacardDesigns,
  } = props;

  const [items, setItems] = useState<DataField[]>([]);
  const [datacardItems, setDatacardItems] = useState<{ id: string }[]>([]);

  const theme = useTheme();

  const { mutate: updateDatasetDesign } = useUpdateItem({
    modelName: "dataset-design",
    mutationOptions: {
      mutationKey: ["dataset-design"],
    },
  });

  useEffect(() => {
    setItems(datasetDesign?.fields?.fields || []);
  }, [datasetDesign]);

  useEffect(() => {
    if (datacardDesigns) {
      setDatacardItems(datacardDesigns.map((m) => ({ id: m.slug })));
    }
  }, [datacardDesigns]);

  return (
    <DatasetSidebarContainer>
      <SidebarSectionWrap
        title="Associated Fields"
        onRightIconClick={() => onAddFieldClick?.()}
      >
        <SortableList
          items={items}
          onChange={(updatedItems) => {
            setItems(updatedItems);
            if (datasetDesign) {
              updateDatasetDesign({
                slug: datasetDesign.slug,
                data: {
                  fields: {
                    fields: updatedItems,
                  },
                },
              });
            }
          }}
          renderItem={(item) => {
            const Icon =
              FieldIcon[item.type as keyof typeof FieldIcon] ||
              LocalOfferOutlined;

            return (
              <SortableList.Item id={item.id} handle>
                <ProfileCard
                  AvatarImage={
                    <BoxIcon>
                      <Icon />
                    </BoxIcon>
                  }
                  options={{
                    draggable: true,
                    switcher: false,
                  }}
                  rightIcon={
                    <Stack direction="row" spacing={1}>
                      <Box className="edit-icon">
                        <DeleteOutline
                          sx={{ color: "grey.500" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (datasetDesign) {
                              Swal.fire({
                                title: "Are you sure?",
                                text: "You won't be able to revert this!",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Yes, delete it!",
                              }).then(async (result) => {
                                if (result.isConfirmed) {
                                  const filtered = items.filter(
                                    (f) => f.id !== item.id
                                  );
                                  updateDatasetDesign({
                                    slug: datasetDesign.slug,
                                    data: {
                                      fields: {
                                        fields: filtered,
                                      },
                                    },
                                  });
                                  setItems(filtered);
                                }
                              });
                            }
                          }}
                        />
                      </Box>
                      <Box className="edit-icon">
                        <EditOutlined sx={{ color: "grey.500" }} />
                      </Box>
                    </Stack>
                  }
                  subTitle={item.slug}
                  title={item.title}
                  sx={{
                    background: theme.palette.background.GFRightNavForeground,
                    height: 48,
                    ".MuiTypography-subtitle1": {
                      margin: "0 0 2px",
                    },
                    ".DragHandle": {
                      lineHeight: "1",
                      width: "20px",
                      height: "20px",
                      margin: "0 6px 0 -6px",
                      color: theme.palette.background.GF20,

                      "&:hover": {
                        color: theme.palette.background.GF50,

                        path: {
                          fill: theme.palette.background.GF50,
                        },
                      },

                      path: {
                        fill: theme.palette.background.GF20,
                        transition: "all 0.4s ease",
                      },

                      svg: {
                        width: "100%",
                        height: "auto",
                        display: "block",
                      },
                    },

                    ".card-inner-content": {
                      gap: "2px",
                    },
                  }}
                  onClick={() => onFieldClick?.(item)}
                />
              </SortableList.Item>
            );
          }}
        />
      </SidebarSectionWrap>
      <SidebarSectionWrap title="General Settings" rightIcon={false}>
        <InfoListWrap
          data={[
            {
              icon: "Dataset Color: ",
              title: (
                <Chip
                  sx={{
                    border: "1px solid",
                    borderColor: "text.primary",
                    borderRadius: "5px",
                    height: "28px",
                    width: "54px",
                    backgroundColor: datasetDesign?.color || "#ffffff",
                  }}
                />
              ),
            },
          ]}
          description={datasetDesign?.description}
          headerIcon={
            <GenericIcon
              sx={{ color: "grey.500" }}
              iconName={(datasetDesign?.icon as Icons) || "AdUnitsOutlined"}
            />
          }
          headerRightIcon={
            <Box className="edit-icon">
              <EditOutlined
                onClick={() => odEditSettingsClick?.()}
                sx={{ color: "grey.500" }}
              />
            </Box>
          }
          title={datasetDesign?.name}
          sx={{
            "&:hover": {
              background: theme.palette.background.GFRightNavForeground,
            },
          }}
        />
      </SidebarSectionWrap>
      <SidebarSectionWrap
        title="Associated Dataset Cards"
        onRightIconClick={() => onAddCardFieldClick?.()}
      >
        <SortableList
          items={datacardItems}
          onChange={(updatedItems) => {
            setDatacardItems(updatedItems);
          }}
          renderItem={(dragItem) => {
            const item = datacardDesigns?.find((m) => m.slug === dragItem.id);
            if (!item) return null;
            return (
              <SortableList.Item id={dragItem.id} handle>
                <ProfileCard
                  AvatarImage={
                    <BoxIcon>
                      <GenericIcon iconName={item.icon as Icons} />
                    </BoxIcon>
                  }
                  options={{
                    draggable: true,
                    switcher: false,
                  }}
                  rightIcon={
                    <Box className="edit-icon">
                      <EditOutlined sx={{ color: "grey.500" }} />
                    </Box>
                  }
                  title={item.name}
                  sx={{
                    background: theme.palette.background.GFRightNavForeground,
                    height: 48,
                    ".MuiTypography-subtitle1": {
                      margin: "0 0 2px",
                    },
                    ".DragHandle": {
                      lineHeight: "1",
                      width: "20px",
                      height: "20px",
                      margin: "0 6px 0 -6px",
                      color: theme.palette.background.GF20,

                      "&:hover": {
                        color: theme.palette.background.GF50,

                        path: {
                          fill: theme.palette.background.GF50,
                        },
                      },

                      path: {
                        fill: theme.palette.background.GF20,
                        transition: "all 0.4s ease",
                      },

                      svg: {
                        width: "100%",
                        height: "auto",
                        display: "block",
                      },
                    },

                    ".card-inner-content": {
                      gap: "2px",
                    },
                  }}
                  onClick={() => onCardFieldClick?.(item)}
                />
              </SortableList.Item>
            );
          }}
        />
      </SidebarSectionWrap>
      <Box sx={{ mt: 2.5 }}>
        <TagEditWithDataProvider recordType={datasetDesign?.slug!} />
      </Box>
    </DatasetSidebarContainer>
  );
};

export default DatasetDesignSidebar;
