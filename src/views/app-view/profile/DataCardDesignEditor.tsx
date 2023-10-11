import { zodResolver } from "@hookform/resolvers/zod";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import CheckBoxOutlined from "@mui/icons-material/CheckBoxOutlined";
import FormatListBulleted from "@mui/icons-material/FormatListBulleted";
import LocalOfferOutlined from "@mui/icons-material/LocalOfferOutlined";
import {
  Box,
  Button,
  CardActions,
  CircularProgress,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useIsMutating } from "@tanstack/react-query";
import FormField from "components/FormField";
import IconPickerField from "components/IconPicker";
import SidebarSection from "components/RightSidebar/SidebarSection";
import { SortableList } from "components/SortableList";
import GenericIcon from "components/util-components/Icon";
import { Icons, NativeMaterialIconNames } from "constants/index";
import useUpdateItem from "queries/useUpdateItem";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ProfileCard from "stories/CompoundComponent/ProfileCard/ProfileCard";
import { z } from "zod";

const associatedFields = [
  {
    title: "New Space",
    subtitle: "zach@globalist.com",
    icon: <LocalOfferOutlined />,
  },
  {
    title: "Page",
    subtitle: "zach@globalist.com",
    icon: <LocalOfferOutlined />,
  },
  {
    title: "Check one of these plz",
    subtitle: "zach@globalist.com",
    icon: <LocalOfferOutlined />,
  },
  {
    title: "Design team list of players",
    subtitle: "zach@globalist.com",
    icon: <FormatListBulleted />,
  },
  {
    title: "Developer access check mark",
    subtitle: "zach@globalist.com",
    icon: <CheckBoxOutlined />,
  },
];

const icons = NativeMaterialIconNames.map((icon) => ({
  id: "string",
  slug: icon,
  title: icon,
  svg: "string",
  native_ref: icon,
  tags: [],
  icon_type: "native",
  category_name: `native`,
  created_by: "string",
  created_at: "string",
  updated_at: "string",
  is_deleted: 0,
}));

const SidebarSectionWrap = styled(Box)(({ theme }) => {
  return {
    padding: "0 20px 20px",

    [`${theme.breakpoints.down("sm")}`]: {
      padding: "0 0 20px",
    },
  };
});

const AddNewFieldContainer = styled(Stack)(({ theme }) => {
  return {
    // paddingLeft: 20,
    // paddingRight: 20,
    // paddingBottom: 20,
    height: "100%",
    // width: "420px",

    [`${theme.breakpoints.down("sm")}`]: {
      paddingLeft: 0,
      paddingRight: 0,
    },

    ".MuiFormLabel-root": {
      fontSize: "12px",
      lineHeight: "1",
      fontWeight: "600",
      color: theme.palette.background.GF80,
      marginBottom: "8px",
      textTransform: "uppercase",
    },

    ".MuiFormControl-root": {
      ".MuiFormControl-root": {
        marginBottom: "0",
        marginTop: "0",
      },
    },

    ".MuiListItem-root": {
      paddingLeft: "0",
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

const addDatacardDesignFieldFormSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
});

export type AddDatacardDesignFieldFormType = z.infer<
  typeof addDatacardDesignFieldFormSchema
>;

const DataCardDesignEditor: React.FC<{
  onBackClick?(): void;
  onAddFieldClick?(datacardDesign: Partial<DatacardDesign>): void;
  onFieldClick?(
    field: DataField,
    datacardDesign: Partial<DatacardDesign>
  ): void;
  onSubmit(data: AddDatacardDesignFieldFormType): void;
  datacardDesign: Partial<DatacardDesign> | null;
}> = (props) => {
  const {
    onBackClick,
    onAddFieldClick,
    onFieldClick,
    onSubmit,
    datacardDesign,
  } = props;

  const [items, setItems] = useState<DataField[]>([]);

  const theme = useTheme();

  const { mutate: updateDatacardDesign } = useUpdateItem({
    modelName: "datacard-design",
    requestOptions: {
      path: `datasets:${datacardDesign?.dataset_design_slug}`,
    },
    mutationOptions: {
      mutationKey: ["datacard-design"],
    },
  });

  const isMutating = useIsMutating({
    mutationKey: ["datacard-design"],
  });

  const isEditMode = !!datacardDesign?.slug;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors, dirtyFields },
  } = useForm<AddDatacardDesignFieldFormType>({
    mode: "onBlur",
    resolver: zodResolver(addDatacardDesignFieldFormSchema),
  });

  useEffect(() => {
    if (datacardDesign) {
      setValue("name", datacardDesign.name || "");
      setValue("icon", datacardDesign.icon || "");
      setValue("description", datacardDesign.description || "");

      if (datacardDesign?.associated_fields?.fields && items.length === 0) {
        setItems(datacardDesign.associated_fields.fields);
      }
    }
  }, [datacardDesign]);

  return (
    <SidebarSectionWrap>
      <SidebarSection
        title="Edit Dataset Card"
        leftIcon={<ArrowBackOutlined />}
        onLeftIconClick={() => onBackClick?.()}
        rightIcon={false}
      >
        <AddNewFieldContainer spacing={2.5}>
          <FormField
            label="Title"
            error={!!dirtyFields.name ? errors.name : undefined}
          >
            <TextField
              {...register("name")}
              autoFocus
              id="field-name"
              hiddenLabel
              size="small"
              variant="filled"
            />
          </FormField>
          <FormField
            label="Icon"
            error={!!dirtyFields.icon ? errors.icon : undefined}
          >
            <Controller
              name="icon"
              control={control}
              render={({ field }) => (
                <IconPickerField
                  {...field}
                  placement="left"
                  icons={icons}
                  textFieldProps={{
                    variant: "filled",
                    size: "small",
                    hiddenLabel: true,
                  }}
                />
              )}
            />
          </FormField>
          <FormField
            label="Description"
            error={!!dirtyFields.description ? errors.description : undefined}
          >
            <TextField
              {...register("description")}
              id="field-description"
              multiline
              rows={4}
              hiddenLabel
              size="small"
              variant="filled"
            />
          </FormField>
          {isEditMode && (
            <SidebarSection
              title="Associated Fields"
              onRightIconClick={() => onAddFieldClick?.(getValues())}
            >
              <SortableList
                items={items}
                onChange={(updatedItems) => {
                  setItems(updatedItems);
                  if (datacardDesign?.slug) {
                    updateDatacardDesign({
                      slug: datacardDesign.slug,
                      data: { associated_fields: { fields: updatedItems } },
                    });
                  }
                }}
                renderItem={(item) => (
                  <SortableList.Item id={item.id} handle>
                    <ProfileCard
                      AvatarImage={
                        <BoxIcon>
                          <GenericIcon
                            iconName={datacardDesign.icon as Icons}
                          />
                        </BoxIcon>
                      }
                      options={{
                        draggable: true,
                        switcher: false,
                      }}
                      rightIcon={<></>}
                      title={item.title}
                      sx={{
                        background:
                          theme.palette.background.GFRightNavForeground,
                        height: 48,
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
                          gap: "8px",
                        },
                      }}
                      onClick={() => onFieldClick?.(item, getValues())}
                    />
                  </SortableList.Item>
                )}
              />
            </SidebarSection>
          )}
          <CardActions
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => onBackClick?.()}
            >
              Back
            </Button>
            <Button
              color="inherit"
              sx={{
                bgcolor: theme.palette.primary.main,
              }}
              disabled={!!isMutating}
              onClick={handleSubmit(onSubmit)}
            >
              Save
              {!!isMutating ? (
                <CircularProgress size={24} sx={{ color: "inherit", ml: 1 }} />
              ) : null}
            </Button>
          </CardActions>
        </AddNewFieldContainer>
      </SidebarSection>
    </SidebarSectionWrap>
  );
};

export default DataCardDesignEditor;
