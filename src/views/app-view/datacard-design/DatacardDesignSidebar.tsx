import { DeleteOutline } from "@mui/icons-material";
import EditOutlined from "@mui/icons-material/EditOutlined";
import LocalOfferOutlined from "@mui/icons-material/LocalOfferOutlined";
import { Box, Stack, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import FieldIcon from "components/Form/FieldIcon";
import SidebarSection from "components/RightSidebar/SidebarSection";
import { SortableList } from "components/SortableList";
import { ApiModels } from "queries/apiModelMapping";
import useUpdateItem from "queries/useUpdateItem";
import { useEffect, useState } from "react";
import InfoList from "stories/CompoundComponent/AccountInfoCard/AccountInfoCard/AccountInfoCard";
import ProfileCard from "stories/CompoundComponent/ProfileCard/ProfileCard";

const DatacardSidebarContainer = styled(Box)(({ theme }) => {
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

const DatacardDesignSidebar: React.FC<{
  onAddFieldClick?(): void;
  onFieldClick?(field: DataField): void;
  datacardDesign?: DatacardDesign;
}> = (props) => {
  const { onAddFieldClick, onFieldClick, datacardDesign } = props;

  const [items, setItems] = useState<DataField[]>([]);

  const theme = useTheme();

  const { mutate: updateDatacardDesign } = useUpdateItem({
    modelName: ApiModels.DatacardDesign,
    mutationOptions: {
      mutationKey: [ApiModels.DatacardDesign],
    },
    requestOptions: { path: "contacts" },
  });

  useEffect(() => {
    setItems(datacardDesign?.associated_fields?.fields || []);
  }, [datacardDesign]);

  return (
    <DatacardSidebarContainer>
      <SidebarSectionWrap
        title="Associated Fields"
        onRightIconClick={() => onAddFieldClick?.()}
      >
        <SortableList
          items={items}
          onChange={(updatedItems) => {
            setItems(updatedItems);
            if (datacardDesign) {
              updateDatacardDesign({
                slug: datacardDesign.slug,
                data: {
                  associated_fields: {
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
                            if (datacardDesign) {
                              const filtered = items.filter(
                                (f) => f.id !== item.id
                              );
                              updateDatacardDesign({
                                slug: datacardDesign.slug,
                                data: {
                                  associated_fields: {
                                    fields: filtered,
                                  },
                                },
                              });
                              setItems(filtered);
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
    </DatacardSidebarContainer>
  );
};

export default DatacardDesignSidebar;
