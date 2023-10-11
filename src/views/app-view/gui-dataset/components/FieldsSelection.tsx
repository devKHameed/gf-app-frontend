import { UniqueIdentifier } from "@dnd-kit/core/dist/types";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { ArrowBack } from "@mui/icons-material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Box, Stack } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import SidebarSection from "components/RightSidebar";
import { MultipleContainers } from "components/drag-drop/MultipleContainer";
import { Handle } from "components/drag-drop/components";
import { DraggableItemProps } from "components/drag-drop/components/Item/Item";
import { ApiModels } from "queries/apiModelMapping";
import useGetItem from "queries/useGetItem";
import useUpdateItem from "queries/useUpdateItem";
import React, { CSSProperties, useMemo } from "react";
import { useParams } from "react-router-dom";
import ProfileCard from "stories/CompoundComponent/ProfileCard/ProfileCard";
const ListItemStyle = styled(Box)(() => ({
  marginBottom: 10,
}));

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

const FieldsWrapper = styled(Box)(({ theme }) => {
  return {
    margin: "0 0 6px",

    ".title": {
      fontSize: "14px",
      lineHeight: "20px",
      fontWeight: "400",
      margin: "0 0 16px",
      textTransform: "capitalize",
    },
  };
});

const FieldsWrap = styled(Stack)(({ theme }) => {
  return {
    ".draggable-handle": {
      color: theme.palette.background.GF20,

      "&:hover": {
        background: "none",
        color: theme.palette.background.GF80,
      },

      svg: {
        color: "currentColor",
        fill: "currentColor",
      },
    },
  };
});

const FieldsSelection: React.FC<{
  gui: GfGui;
  indexKey: "form_fields" | "search_fields";
  onClickBack: () => void;
}> = ({ gui, onClickBack, indexKey = "search_fields" }) => {
  const includedFields = useMemo(
    () => gui?.dataset_list_settings?.[indexKey] || [],
    [gui?.dataset_list_settings, indexKey]
  );

  const theme = useTheme();
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
  const { mutate: updateGui } = useUpdateItem({ modelName: ApiModels.Gui });

  const { fieldsMap, items } = useMemo(() => {
    const excludedFields: string[] = [];
    const fieldsMap = new Map<string, DataField>();
    datasetDesign?.fields?.fields?.forEach((field) => {
      fieldsMap.set(field.id, field);
      if (!includedFields.includes(field.id)) {
        excludedFields.push(field.id);
      }
    });

    return {
      items: { included: includedFields, excluded: excludedFields },
      fieldsMap,
    };
  }, [datasetDesign, includedFields]);

  const onSortEndHandler = (
    _: UniqueIdentifier[],
    items: Record<UniqueIdentifier, UniqueIdentifier[]>
  ) => {
    if (guiSlug) {
      updateGui(
        {
          slug: guiSlug,
          data: {
            dataset_list_settings: {
              ...gui.dataset_list_settings,
              [indexKey]: items.included,
            },
          },
        },
        {
          onSuccess: () => {
            console.log("AccountUser edit success");
          },
        }
      );
    }
  };
  return (
    <React.Fragment>
      <SidebarSectionWrap
        title="Back to Dataset"
        rightIcon={false}
        leftIcon={<ArrowBack />}
        onLeftIconClick={onClickBack}
      >
        <MultipleContainers
          items={items}
          minimal
          vertical={true}
          modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
          style={{ padding: 0 }}
          renderContainer={(prps: any) => {
            return (
              <FieldsWrapper>
                <Box className="title">{prps.id}</Box>
                <FieldsWrap ref={prps.ref} sx={{ minHeight: 60 }}>
                  {prps.children}
                </FieldsWrap>
              </FieldsWrapper>
            );
          }}
          renderItem={(prps: DraggableItemProps & { ref: any }) => {
            const item = fieldsMap.get(prps.value as unknown as string);
            if (!item) return null;

            const {
              transition,
              handleProps,
              listeners,
              transform,
              index,
              color,
              dragging,
              style,
              ref,
              ...rest
            } = prps;

            const styles: CSSProperties = {
              opacity: dragging ? 0.4 : undefined,
              transform: CSS.Translate.toString(transform as any),
              transition: transition as any,
            };
            return (
              <ListItemStyle
                style={styles as CSSProperties}
                id={item.id}
                ref={ref}
              >
                <ProfileCard
                  options={{
                    draggable: true,
                    switcher: false,
                  }}
                  subTitle={item.slug}
                  title={item.title}
                  DragHandle={
                    <Handle
                      // className="DragHandle"
                      {...handleProps}
                      {...listeners}
                    >
                      <DragIndicatorIcon
                        sx={{
                          verticalAlign: "middle",
                          color: theme.palette.background.GF20,
                          cursor: "grab",
                        }}
                      />
                    </Handle>
                  }
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
                />
              </ListItemStyle>
            );
          }}
          onSortEnd={onSortEndHandler as any}
        />
      </SidebarSectionWrap>
    </React.Fragment>
  );
};

export default FieldsSelection;
