import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBackOutlined, DeleteOutline } from "@mui/icons-material";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import LocalOfferOutlined from "@mui/icons-material/LocalOfferOutlined";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  CardActions,
  Checkbox,
  Stack,
  TextField,
  styled,
  useTheme,
} from "@mui/material";
import AddAssociatedField, {
  AddAssociatedFieldFormType,
} from "components/AddAssociatedField";
import FieldIcon from "components/Form/FieldIcon";
import TagEditWithDataProvider from "components/Form/TagEditor/TagEditWithDataProvider";
import FormField from "components/FormField";
import IOSSwitch from "components/IOSSwitch";
import IconPickerField from "components/IconPicker";
import SidebarSection from "components/RightSidebar";
import { SortableList } from "components/SortableList";
import Icon from "components/util-components/Icon";
import { AllIconPickerIcons } from "constants/index";
import { DocumentElementType } from "enums";
import { FusionType } from "enums/Fusion";
import useAccountSlug from "hooks/useAccountSlug";
import useAppNavigate from "hooks/useAppNavigate";
import AnimationLayout, {
  AnimationLayoutRef,
  Config,
} from "layouts/AnimationLayout";
import { isArray } from "lodash";
import last from "lodash/last";
import { enqueueSnackbar } from "notistack";
import { queryClient } from "queries";
import { ApiModels } from "queries/apiModelMapping";
import useFusion from "queries/fusion/useFusion";
import useDeleteItem from "queries/useDeleteItem";
import useListItems from "queries/useListItems";
import useUpdateItem from "queries/useUpdateItem";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { DraftsKey, useFusionFlowStore } from "store/stores/fusion-flow";
import ProfileCard from "stories/CompoundComponent/ProfileCard/ProfileCard";
import { getSearchParams } from "utils";
import { v4 } from "uuid";
import { z } from "zod";
import SkillIntentEditor from "./components/SkillIntentEditor";

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

const CheckboxStyled = styled(Checkbox)({
  display: "block",
  width: "fit-content",
});

type MainComponentProps = {
  onAddFieldClick?(type: DraftsKey): void;
  onFieldClick?(field: DataField, type: DraftsKey): void;
  onAddModuleClick?(): void;
  onModuleClick?(table: SkillUserTableModule): void;
  onSkillIntentClick?(_: SkillIntent): void;
  onAddSkillIntent?(): void;
  skillIntents?: SkillIntent[];
};

const MainComponent: React.FC<MainComponentProps> = (props) => {
  const {
    onAddFieldClick,
    onFieldClick,
    onAddModuleClick,
    skillIntents,
    onModuleClick,
    onSkillIntentClick,
    onAddSkillIntent,
  } = props;
  const { fusionSlug } = useParams<{ fusionSlug: string }>();

  const theme = useTheme();

  const fusion = useFusionFlowStore.useFusionDraft();

  const { mutate: updateFusion } = useUpdateItem({
    modelName: ApiModels.Fusion,
  });
  const { mutate: deleteSkillIntent } = useDeleteItem({
    modelName: ApiModels.SkillIntent,
  });

  const { mutate: deleteFusion, isLoading } = useDeleteItem({
    modelName: ApiModels.Fusion,
  });

  const appNavigate = useAppNavigate();
  const accountSlug = useAccountSlug();

  const setFusionDraft = useFusionFlowStore.useSetFusionDraft();

  const [items, setItems] = useState<DataField[]>([]);
  const [skillUserFields, setSkillUserFields] = useState<DataField[]>([]);
  const [skillSessionFields, setSkillSessionFields] = useState<DataField[]>([]);
  const [skillUserTableModules, setSkillUserTableModules] = useState<
    SkillUserTableModule[]
  >([]);

  const isSkillFusion = fusion?.fusion_type === FusionType.Skills;

  useEffect(() => {
    setItems((fusion?.fusion_fields?.fields || []) as DataField[]);
    setSkillUserFields(
      (fusion?.skill_user_fields?.fields || []) as DataField[]
    );
    setSkillSessionFields(
      (fusion?.skill_session_fields?.fields || []) as DataField[]
    );
    setSkillUserTableModules(fusion?.skill_user_table_modules || []);
  }, [fusion]);

  const DefaultListItemStyles = useMemo(
    () => ({
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
    }),
    [
      theme.palette.background.GF20,
      theme.palette.background.GF50,
      theme.palette.background.GFRightNavForeground,
    ]
  );

  const handleDelteSkillIntent = async (slug: string) => {
    await deleteSkillIntent(
      { slug },
      {
        onSuccess: () => {
          queryClient.setQueriesData<SkillIntent[]>(
            [ApiModels.SkillIntent, fusionSlug],
            (oldData) => {
              if (isArray(oldData)) {
                return oldData.filter((item) => item["slug"] !== slug);
              }

              return oldData;
            }
          );
        },
      }
    );
  };
  const handleDelete = () => {
    if (fusionSlug) {
      deleteFusion(
        {
          slug: fusionSlug,
        },
        {
          onSuccess() {
            appNavigate(`/fusion`);
            setFusionDraft(null);
          },
        }
      );
    }
  };

  return (
    <Box sx={{ mx: 2 }}>
      <Link to={`/${accountSlug}/fusion/flow-designer/${fusionSlug}`}>
        <Button variant="contained" color="primary" sx={{ mt: 2 }} fullWidth>
          Open Fusion Flow Designer
        </Button>
      </Link>
      {fusion?.fusion_type === FusionType.Skills && (
        <Link to={`/${accountSlug}/skills/${fusionSlug}`}>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} fullWidth>
            Go to Skills
          </Button>
        </Link>
      )}
      <LoadingButton
        variant="contained"
        sx={{ mt: 2 }}
        fullWidth
        onClick={handleDelete}
        loading={isLoading}
      >
        Delete
      </LoadingButton>
      <SidebarSection title="Is Active" leftIcon={<></>} rightIcon={<></>}>
        <ProfileCard
          title="Active"
          rightIcon={
            <IOSSwitch
              defaultChecked={fusion?.is_active}
              onChange={(e) =>
                updateFusion({
                  slug: fusionSlug!,
                  data: { is_active: e.target.checked },
                })
              }
            />
          }
          options={{ switcher: false, draggable: false }}
          sx={{ minHeight: "54px" }}
        />
      </SidebarSection>
      <SidebarSection
        title="Custom Fields"
        onRightIconClick={() => onAddFieldClick?.("fusionFieldDrafts")}
      >
        <SortableList
          items={items}
          onChange={(updatedItems) => {
            setItems(updatedItems);
            if (fusion) {
              updateFusion({
                slug: fusionSlug!,
                data: {
                  fusion_fields: {
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
                            if (fusion) {
                              const filtered = items.filter(
                                (f) => f.id !== item.id
                              );
                              updateFusion({
                                slug: fusionSlug!,
                                data: {
                                  fusion_fields: {
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
                  sx={DefaultListItemStyles}
                  onClick={() => onFieldClick?.(item, "fusionFieldDrafts")}
                />
              </SortableList.Item>
            );
          }}
        />
      </SidebarSection>
      {isSkillFusion && (
        <>
          <SidebarSection
            title="Skill User Fields"
            onRightIconClick={() => onAddFieldClick?.("skillUserFieldDrafts")}
          >
            <SortableList
              items={skillUserFields}
              onChange={(updatedItems) => {
                setSkillUserFields(updatedItems);
                if (fusion) {
                  updateFusion({
                    slug: fusionSlug!,
                    data: {
                      skill_user_fields: {
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
                                if (fusion) {
                                  const filtered = skillUserFields.filter(
                                    (f) => f.id !== item.id
                                  );
                                  updateFusion({
                                    slug: fusionSlug!,
                                    data: {
                                      skill_user_fields: {
                                        fields: filtered,
                                      },
                                    },
                                  });
                                  setSkillUserFields(filtered);
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
                      sx={DefaultListItemStyles}
                      onClick={() =>
                        onFieldClick?.(item, "skillUserFieldDrafts")
                      }
                    />
                  </SortableList.Item>
                );
              }}
            />
          </SidebarSection>
          <SidebarSection
            title="Skill Session Fields"
            onRightIconClick={() =>
              onAddFieldClick?.("skillSessionFieldDrafts")
            }
          >
            <SortableList
              items={skillSessionFields}
              onChange={(updatedItems) => {
                setSkillSessionFields(updatedItems);
                if (fusion) {
                  updateFusion({
                    slug: fusionSlug!,
                    data: {
                      skill_session_fields: {
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
                                if (fusion) {
                                  const filtered = skillSessionFields.filter(
                                    (f) => f.id !== item.id
                                  );
                                  updateFusion({
                                    slug: fusionSlug!,
                                    data: {
                                      skill_session_fields: {
                                        fields: filtered,
                                      },
                                    },
                                  });
                                  setSkillSessionFields(filtered);
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
                      sx={DefaultListItemStyles}
                      onClick={() =>
                        onFieldClick?.(item, "skillSessionFieldDrafts")
                      }
                    />
                  </SortableList.Item>
                );
              }}
            />
          </SidebarSection>
          <SidebarSection
            title="Skill User Table Modules"
            onRightIconClick={() => {
              onAddModuleClick?.();
            }}
          >
            <SortableList
              items={skillUserTableModules}
              onChange={(updatedItems) => {
                setSkillUserTableModules(updatedItems);
                if (fusion) {
                  updateFusion({
                    slug: fusionSlug!,
                    data: {
                      skill_user_table_modules: updatedItems,
                    },
                  });
                }
              }}
              renderItem={(item) => {
                return (
                  <SortableList.Item id={item.id} handle>
                    <ProfileCard
                      AvatarImage={
                        <BoxIcon>
                          <Icon iconName={item.icon || "Menu"} />
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
                                if (fusion) {
                                  const filtered = skillUserTableModules.filter(
                                    (f) => f.id !== item.id
                                  );
                                  updateFusion({
                                    slug: fusionSlug!,
                                    data: {
                                      skill_user_table_modules: filtered,
                                    },
                                  });
                                  setSkillUserTableModules(filtered);
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
                      title={item.name}
                      sx={DefaultListItemStyles}
                      onClick={() => {
                        onModuleClick?.(item);
                      }}
                    />
                  </SortableList.Item>
                );
              }}
            />
          </SidebarSection>
        </>
      )}
      <SidebarSection
        title="Skill Intents"
        onRightIconClick={() => onAddSkillIntent?.()}
      >
        {skillIntents?.map((item) => {
          return (
            <Box sx={{ marginBottom: "10px" }}>
              <ProfileCard
                AvatarImage={
                  <BoxIcon>
                    <Icon iconName={item.icon || "Menu"} />
                  </BoxIcon>
                }
                options={{
                  draggable: false,
                  switcher: false,
                }}
                rightIcon={
                  <Box className="edit-icon">
                    <EditOutlined
                      sx={{ color: "grey.500" }}
                      onClick={() => onSkillIntentClick?.(item)}
                    />
                    <DeleteOutlined
                      sx={{ color: "grey.500" }}
                      onClick={() => handleDelteSkillIntent?.(item.slug)}
                    />
                  </Box>
                }
                subTitle={item.slug}
                title={item.intent}
                sx={DefaultListItemStyles}
              />
            </Box>
          );
        })}
      </SidebarSection>
      <Box sx={{ mt: 4 }}>
        <TagEditWithDataProvider recordType={fusion?.fusion_slug!} />
      </Box>
    </Box>
  );
};

const SkillUserTableEditorContainer = styled(Box)(({ theme }) => {
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

    ".MuiListItem-root , .MuiBox-root": {
      paddingLeft: "0",
      paddingRight: "0",
    },
  };
});

const skillUserTableFormSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  slug: z.string(),
  icon: z.string().optional(),
  description: z.string(),
  hidden: z.boolean().default(false),
});

type SkillUserTableFormType = z.infer<typeof skillUserTableFormSchema>;

type SkillUserTableEditorProps = {
  skillUserTable?: Partial<SkillUserTable> | null;
  onBackClick?(): void;
  onSaveClick(table: SkillUserTableFormType): void;
  onAddFieldClick?(): void;
  onFieldClick?(field: DataField): void;
  onAddSidebarClick?(): void;
  onSidebarClick?(table: SkillUserTableSidebar): void;
};

const SkillUserTableEditor: React.FC<SkillUserTableEditorProps> = (props) => {
  const {
    skillUserTable,
    onBackClick,
    onSaveClick,
    onAddFieldClick,
    onFieldClick,
    onAddSidebarClick,
    onSidebarClick,
  } = props;

  const { fusionSlug } = useParams<{ fusionSlug: string }>();
  const { data: fusion } = useFusion(fusionSlug);

  const { mutate: updateFusion } = useUpdateItem({
    modelName: ApiModels.Fusion,
  });

  const theme = useTheme();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<SkillUserTableFormType>({
    mode: "onBlur",
    resolver: zodResolver(skillUserTableFormSchema),
  });

  const [items, setItems] = useState<DataField[]>([]);
  const [skillUserSidebars, setSkillUserSidebars] = useState<
    SkillUserTableSidebar[]
  >([]);

  useEffect(() => {
    if (skillUserTable) {
      reset(skillUserTable);
      setItems(skillUserTable.fields?.fields || []);
      setSkillUserSidebars(
        fusion?.skill_user_table_sidebars?.filter(
          (t) => t.table_id === skillUserTable.id && !t.parent_sidebar_id
        ) || []
      );
    }
  }, [fusion, skillUserTable]);

  const DefaultListItemStyles = useMemo(
    () => ({
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
    }),
    [
      theme.palette.background.GF20,
      theme.palette.background.GF50,
      theme.palette.background.GFRightNavForeground,
    ]
  );

  const isEditMode = !!skillUserTable;

  return (
    <SkillUserTableEditorContainer>
      <SidebarSection
        title="Add New Table"
        rightIcon={false}
        leftIcon={<ArrowBackOutlined />}
        onLeftIconClick={() => onBackClick?.()}
      >
        <Stack spacing={2.5}>
          <FormField
            label="Name"
            error={!!dirtyFields.name ? errors.name : undefined}
          >
            <TextField
              {...register("name")}
              autoFocus
              margin="dense"
              id="name"
              type="text"
              hiddenLabel
              size="small"
              variant="filled"
              fullWidth
            />
          </FormField>
          <FormField
            label="Slug"
            error={!!dirtyFields.slug ? errors.slug : undefined}
          >
            <TextField
              {...register("slug")}
              autoFocus
              margin="dense"
              id="slug"
              type="text"
              hiddenLabel
              size="small"
              variant="filled"
              fullWidth
              disabled={isEditMode}
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
                <IconPickerField {...field} icons={AllIconPickerIcons} />
              )}
            />
          </FormField>
          <FormField
            label="Description"
            error={!!dirtyFields.description ? errors.description : undefined}
          >
            <TextField
              {...register("description")}
              autoFocus
              margin="dense"
              id="description"
              type="text"
              hiddenLabel
              size="small"
              variant="filled"
              fullWidth
              multiline
              rows={3}
            />
          </FormField>
          <FormField
            label="Hidden"
            error={!!dirtyFields.hidden ? errors.hidden : undefined}
          >
            <Controller
              control={control}
              name="hidden"
              render={({ field }) => (
                <CheckboxStyled
                  {...field}
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
          </FormField>
        </Stack>
      </SidebarSection>
      {skillUserTable && (
        <>
          <SidebarSection
            title="Associated Fields"
            onRightIconClick={() => onAddFieldClick?.()}
          >
            <SortableList
              items={items}
              onChange={(updatedItems) => {
                setItems(updatedItems);
                if (fusion) {
                  updateFusion({
                    slug: fusionSlug!,
                    data: {
                      skill_user_tables:
                        fusion?.skill_user_tables?.map((table) => {
                          if (table.id === skillUserTable.id) {
                            return {
                              ...table,
                              fields: {
                                fields: updatedItems,
                              },
                            };
                          }

                          return table;
                        }) || [],
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
                                if (fusion) {
                                  const filtered = items.filter(
                                    (f) => f.id !== item.id
                                  );
                                  updateFusion({
                                    slug: fusionSlug!,
                                    data: {
                                      skill_user_tables:
                                        fusion?.skill_user_tables?.map(
                                          (table) => {
                                            if (
                                              table.id === skillUserTable.id
                                            ) {
                                              return {
                                                ...table,
                                                fields: {
                                                  fields: filtered,
                                                },
                                              };
                                            }

                                            return table;
                                          }
                                        ) || [],
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
                      sx={DefaultListItemStyles}
                      onClick={() => onFieldClick?.(item)}
                    />
                  </SortableList.Item>
                );
              }}
            />
          </SidebarSection>
          <SidebarSection
            title="Sidebar Skills"
            onRightIconClick={() => onAddSidebarClick?.()}
          >
            <SortableList
              items={skillUserSidebars}
              onChange={(updatedItems) => {
                setSkillUserSidebars(updatedItems);
                if (fusion) {
                  const restItems =
                    fusion.skill_user_table_sidebars?.filter(
                      (i) => i.table_id !== skillUserTable.id
                    ) || [];
                  updateFusion({
                    slug: fusionSlug!,
                    data: {
                      skill_user_table_sidebars: [
                        ...restItems,
                        ...updatedItems,
                      ],
                    },
                  });
                }
              }}
              renderItem={(item) => {
                return (
                  <SortableList.Item id={item.id} handle>
                    <ProfileCard
                      AvatarImage={
                        <BoxIcon>
                          <Icon iconName={item.icon || "Menu"} />
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

                                if (fusion) {
                                  const restItems =
                                    fusion.skill_user_table_sidebars?.filter(
                                      (i) => i.table_id !== skillUserTable.id
                                    ) || [];
                                  const filtered = skillUserSidebars.filter(
                                    (f) => f.id !== item.id
                                  );
                                  updateFusion({
                                    slug: fusionSlug!,
                                    data: {
                                      skill_user_table_sidebars: [
                                        ...restItems,
                                        ...filtered,
                                      ],
                                    },
                                  });
                                  setSkillUserSidebars(filtered);
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
                      title={item.name}
                      sx={DefaultListItemStyles}
                      onClick={() => onSidebarClick?.(item)}
                    />
                  </SortableList.Item>
                );
              }}
            />
          </SidebarSection>
        </>
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
            bgcolor: (theme) => theme.palette.primary.main,
          }}
          onClick={handleSubmit(onSaveClick, (e) => {
            console.error(e);
          })}
        >
          Save
        </Button>
      </CardActions>
    </SkillUserTableEditorContainer>
  );
};

const skillUserTableSidebarFormSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  slug: z.string(),
  icon: z.string().optional(),
  description: z.string(),
  hidden: z.boolean().default(false),
  multi_record: z.boolean().default(false),
  parent_sidebar_id: z.string().optional(),
});

type SkillUserTableSidebarFormType = z.infer<
  typeof skillUserTableSidebarFormSchema
>;

type SkillUserTableSidebarEditorProps = {
  skillUserTableSidebar?: Partial<SkillUserTableSidebar> | null;
  skillUserTableSidebars?: SkillUserTableSidebar[];
  onBackClick?(): void;
  onSaveClick(table: SkillUserTableFormType): void;
  onAddFieldClick?(): void;
  onFieldClick?(field: DataField): void;
  onAddSidebarClick?(): void;
  onSidebarClick?(table: SkillUserTableSidebar): void;
};

const SkillUserTableSidebarEditor: React.FC<SkillUserTableSidebarEditorProps> =
  (props) => {
    const {
      skillUserTableSidebar,
      skillUserTableSidebars = [],
      onBackClick,
      onSaveClick,
      onAddFieldClick,
      onFieldClick,
      onAddSidebarClick,
      onSidebarClick,
    } = props;

    const { fusionSlug } = useParams<{ fusionSlug: string }>();
    const { data: fusion } = useFusion(fusionSlug);

    const { mutate: updateFusion } = useUpdateItem({
      modelName: ApiModels.Fusion,
    });

    const [childSidebars, setChildSidebars] = useState<SkillUserTableSidebar[]>(
      []
    );

    const theme = useTheme();

    const {
      register,
      handleSubmit,
      control,
      reset,
      watch,
      formState: { errors, dirtyFields },
    } = useForm<SkillUserTableSidebarFormType>({
      mode: "onBlur",
      resolver: zodResolver(skillUserTableSidebarFormSchema),
    });

    const [items, setItems] = useState<DataField[]>([]);

    const multi_record = watch("multi_record");

    useEffect(() => {
      if (skillUserTableSidebar) {
        reset(skillUserTableSidebar);
        setItems(skillUserTableSidebar.fields?.fields || []);
      } else {
        const searchParams = getSearchParams();
        const s = searchParams.get("s");
        let parentId: string | undefined = undefined;
        if (s) {
          const sSplit = s.split("_");
          if (sSplit.length === 3) {
            parentId = sSplit[1];
          }
        }

        if (parentId) {
          reset({ parent_sidebar_id: parentId });
        }
      }
    }, [skillUserTableSidebar]);

    useEffect(() => {
      setChildSidebars(
        skillUserTableSidebars.filter(
          (bar) => bar.parent_sidebar_id === skillUserTableSidebar?.id
        )
      );
    }, [skillUserTableSidebars, skillUserTableSidebar]);

    const DefaultListItemStyles = useMemo(
      () => ({
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
      }),
      [
        theme.palette.background.GF20,
        theme.palette.background.GF50,
        theme.palette.background.GFRightNavForeground,
      ]
    );

    const isEditMode = !!skillUserTableSidebar;

    return (
      <SkillUserTableEditorContainer>
        <SidebarSection
          title="Add New Table"
          rightIcon={false}
          leftIcon={<ArrowBackOutlined />}
          onLeftIconClick={() => onBackClick?.()}
        >
          <Stack spacing={2.5}>
            <FormField
              label="Name"
              error={!!dirtyFields.name ? errors.name : undefined}
            >
              <TextField
                {...register("name")}
                autoFocus
                margin="dense"
                id="name"
                type="text"
                hiddenLabel
                size="small"
                variant="filled"
                fullWidth
              />
            </FormField>
            <FormField
              label="Slug"
              error={!!dirtyFields.slug ? errors.slug : undefined}
            >
              <TextField
                {...register("slug")}
                autoFocus
                margin="dense"
                id="slug"
                type="text"
                hiddenLabel
                size="small"
                variant="filled"
                fullWidth
                disabled={isEditMode}
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
                  <IconPickerField {...field} icons={AllIconPickerIcons} />
                )}
              />
            </FormField>
            <FormField
              label="Description"
              error={!!dirtyFields.description ? errors.description : undefined}
            >
              <TextField
                {...register("description")}
                autoFocus
                margin="dense"
                id="description"
                type="text"
                hiddenLabel
                size="small"
                variant="filled"
                fullWidth
                multiline
                rows={3}
              />
            </FormField>
            <FormField
              label="Hidden"
              error={!!dirtyFields.hidden ? errors.hidden : undefined}
            >
              <Controller
                control={control}
                name="hidden"
                render={({ field }) => (
                  <CheckboxStyled
                    {...field}
                    checked={field.value ?? false}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            </FormField>
            <FormField
              label="Multi Record"
              error={
                !!dirtyFields.multi_record ? errors.multi_record : undefined
              }
            >
              <Controller
                control={control}
                name="multi_record"
                render={({ field }) => (
                  <CheckboxStyled
                    {...field}
                    checked={field.value ?? false}
                    disabled={isEditMode}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            </FormField>
          </Stack>
        </SidebarSection>
        {isEditMode && multi_record && (
          <>
            <SidebarSection
              title="Associated Fields"
              onRightIconClick={() => onAddFieldClick?.()}
            >
              <SortableList
                items={items}
                onChange={(updatedItems) => {
                  setItems(updatedItems);
                  if (fusion) {
                    updateFusion({
                      slug: fusionSlug!,
                      data: {
                        skill_user_table_sidebars:
                          fusion?.skill_user_table_sidebars?.map((table) => {
                            if (table.id === skillUserTableSidebar.id) {
                              return {
                                ...table,
                                fields: {
                                  fields: updatedItems,
                                },
                              };
                            }

                            return table;
                          }) || [],
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
                                  if (fusion) {
                                    const filtered = items.filter(
                                      (f) => f.id !== item.id
                                    );
                                    updateFusion({
                                      slug: fusionSlug!,
                                      data: {
                                        skill_user_table_sidebars:
                                          fusion?.skill_user_table_sidebars?.map(
                                            (table) => {
                                              if (
                                                table.id ===
                                                skillUserTableSidebar.id
                                              ) {
                                                return {
                                                  ...table,
                                                  fields: {
                                                    fields: filtered,
                                                  },
                                                };
                                              }

                                              return table;
                                            }
                                          ) || [],
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
                        sx={DefaultListItemStyles}
                        onClick={() => onFieldClick?.(item)}
                      />
                    </SortableList.Item>
                  );
                }}
              />
            </SidebarSection>
            <SidebarSection
              title="Sidebar Skills"
              onRightIconClick={() => onAddSidebarClick?.()}
            >
              <SortableList
                items={childSidebars}
                onChange={(updatedItems) => {
                  setChildSidebars(updatedItems);
                  if (fusion) {
                    const restItems =
                      fusion.skill_user_table_sidebars?.filter(
                        (i) => i.parent_sidebar_id !== skillUserTableSidebar.id
                      ) || [];
                    updateFusion({
                      slug: fusionSlug!,
                      data: {
                        skill_user_table_sidebars: [
                          ...restItems,
                          ...updatedItems,
                        ],
                      },
                    });
                  }
                }}
                renderItem={(item) => {
                  return (
                    <SortableList.Item id={item.id} handle>
                      <ProfileCard
                        AvatarImage={
                          <BoxIcon>
                            <Icon iconName={item.icon || "Menu"} />
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

                                  if (fusion) {
                                    const restItems =
                                      fusion.skill_user_table_sidebars?.filter(
                                        (i) =>
                                          i.parent_sidebar_id !==
                                          skillUserTableSidebar.id
                                      ) || [];
                                    const filtered = childSidebars.filter(
                                      (f) => f.id !== item.id
                                    );
                                    updateFusion({
                                      slug: fusionSlug!,
                                      data: {
                                        skill_user_table_sidebars: [
                                          ...restItems,
                                          ...filtered,
                                        ],
                                      },
                                    });
                                    setChildSidebars(filtered);
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
                        title={item.name}
                        sx={DefaultListItemStyles}
                        onClick={() => onSidebarClick?.(item)}
                      />
                    </SortableList.Item>
                  );
                }}
              />
            </SidebarSection>
          </>
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
              bgcolor: (theme) => theme.palette.primary.main,
            }}
            onClick={handleSubmit(onSaveClick, (e) => {
              console.error(e);
            })}
          >
            Save
          </Button>
        </CardActions>
      </SkillUserTableEditorContainer>
    );
  };

const skillUserTableModuleFormSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  slug: z.string(),
  icon: z.string().optional(),
  hidden: z.boolean().default(false),
});

type SkillUserTableModuleFormType = z.infer<
  typeof skillUserTableModuleFormSchema
>;

type SkillUserTableModuleEditorProps = {
  skillUserTableModule?: Partial<SkillUserTableModule> | null;
  onBackClick?(): void;
  onSaveClick(table: SkillUserTableModuleFormType): void;
  onAddTableClick?(): void;
  onTableClick?(table: SkillUserTable): void;
};

const SkillUserTableModuleEditor: React.FC<SkillUserTableModuleEditorProps> = (
  props
) => {
  const {
    skillUserTableModule,
    onBackClick,
    onSaveClick,
    onAddTableClick,
    onTableClick,
  } = props;

  const { fusionSlug } = useParams<{ fusionSlug: string }>();
  const { data: fusion } = useFusion(fusionSlug);

  const { mutate: updateFusion } = useUpdateItem({
    modelName: ApiModels.Fusion,
  });

  const theme = useTheme();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<SkillUserTableModuleFormType>({
    mode: "onBlur",
    resolver: zodResolver(skillUserTableModuleFormSchema),
  });

  const [skillUserTables, setSkillUserTables] = useState<SkillUserTable[]>([]);

  useEffect(() => {
    if (skillUserTableModule) {
      reset(skillUserTableModule);
      setSkillUserTables(
        fusion?.skill_user_tables?.filter(
          (t) => t.module_id === skillUserTableModule.id
        ) || []
      );
    }
  }, [skillUserTableModule, fusion]);

  const DefaultListItemStyles = useMemo(
    () => ({
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
    }),
    [
      theme.palette.background.GF20,
      theme.palette.background.GF50,
      theme.palette.background.GFRightNavForeground,
    ]
  );

  const isEditMode = !!skillUserTableModule;

  return (
    <SkillUserTableEditorContainer>
      <SidebarSection
        title="Add New Table"
        rightIcon={false}
        leftIcon={<ArrowBackOutlined />}
        onLeftIconClick={() => onBackClick?.()}
      >
        <Stack spacing={2.5}>
          <FormField
            label="Name"
            error={!!dirtyFields.name ? errors.name : undefined}
          >
            <TextField
              {...register("name")}
              autoFocus
              margin="dense"
              id="name"
              type="text"
              hiddenLabel
              size="small"
              variant="filled"
              fullWidth
            />
          </FormField>
          <FormField
            label="Slug"
            error={!!dirtyFields.slug ? errors.slug : undefined}
          >
            <TextField
              {...register("slug")}
              autoFocus
              margin="dense"
              id="slug"
              type="text"
              hiddenLabel
              size="small"
              variant="filled"
              fullWidth
              disabled={isEditMode}
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
                <IconPickerField {...field} icons={AllIconPickerIcons} />
              )}
            />
          </FormField>
          <FormField
            label="Hidden"
            error={!!dirtyFields.hidden ? errors.hidden : undefined}
          >
            <Controller
              control={control}
              name="hidden"
              render={({ field }) => (
                <CheckboxStyled
                  {...field}
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
          </FormField>
        </Stack>
      </SidebarSection>
      {skillUserTableModule && (
        <>
          <SidebarSection
            title="Skill User Tables"
            onRightIconClick={() => onAddTableClick?.()}
          >
            <SortableList
              items={skillUserTables}
              onChange={(updatedItems) => {
                setSkillUserTables(updatedItems);
                if (fusion) {
                  const restItems =
                    fusion.skill_user_tables?.filter(
                      (i) => i.module_id !== skillUserTableModule.id
                    ) || [];
                  updateFusion({
                    slug: fusionSlug!,
                    data: {
                      skill_user_tables: [...restItems, ...updatedItems],
                    },
                  });
                }
              }}
              renderItem={(item) => {
                return (
                  <SortableList.Item id={item.id} handle>
                    <ProfileCard
                      AvatarImage={
                        <BoxIcon>
                          <Icon iconName={item.icon || "Menu"} />
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

                                if (fusion) {
                                  const restItems =
                                    fusion.skill_user_tables?.filter(
                                      (i) =>
                                        i.module_id !== skillUserTableModule.id
                                    ) || [];
                                  const filtered = skillUserTables.filter(
                                    (f) => f.id !== item.id
                                  );
                                  updateFusion({
                                    slug: fusionSlug!,
                                    data: {
                                      skill_user_tables: [
                                        ...restItems,
                                        ...filtered,
                                      ],
                                    },
                                  });
                                  setSkillUserTables(filtered);
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
                      title={item.name}
                      sx={DefaultListItemStyles}
                      onClick={() => onTableClick?.(item)}
                    />
                  </SortableList.Item>
                );
              }}
            />
          </SidebarSection>
        </>
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
            bgcolor: (theme) => theme.palette.primary.main,
          }}
          onClick={handleSubmit(onSaveClick, (e) => {
            console.error(e);
          })}
        >
          Save
        </Button>
      </CardActions>
    </SkillUserTableEditorContainer>
  );
};

const getFusionFieldKeyFromDraftKey = (
  draftKey: DraftsKey
): "fusion_fields" | "skill_user_fields" | "skill_session_fields" => {
  if (draftKey === "skillUserFieldDrafts") {
    return "skill_user_fields";
  }
  if (draftKey === "skillSessionFieldDrafts") {
    return "skill_session_fields";
  }
  return "fusion_fields";
};

type Props = {};

const FusionRightBar: React.FC<Props> = (props) => {
  const { fusionSlug } = useParams<{ fusionSlug: string }>();
  const { data: skillIntents } = useListItems({
    modelName: ApiModels.SkillIntent,
    requestOptions: { query: { skill_slug: fusionSlug } },
    queryKey: [ApiModels.SkillIntent, fusionSlug],
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const rightSidebarRef = useRef<AnimationLayoutRef>(null);
  const navigate = useNavigate();
  const setFusionFields = useFusionFlowStore.useSetFusionFields();
  const pushDataFieldDraft = useFusionFlowStore.usePushFieldDraft();
  const popDataFieldDraft = useFusionFlowStore.usePopFieldDraft();
  const updateDataFieldDraft = useFusionFlowStore.useUpdateDataFieldDraft();
  const emptyDataFieldDrafts = useFusionFlowStore.useEmptyDataFieldDrafts();
  const mergeDataFieldDraftTail =
    useFusionFlowStore.useMergeDataFieldDraftTail();
  const fusionFieldDrafts = useFusionFlowStore.useFusionFieldDrafts();
  const skillUserFieldDrafts = useFusionFlowStore.useSkillUserFieldDrafts();
  const skillSessionFieldDrafts =
    useFusionFlowStore.useSkillSessionFieldDrafts();
  const skillUserTableFieldDrafts =
    useFusionFlowStore.useSkillUserTableFieldDrafts();
  const skillUserTableSidebarDrafts =
    useFusionFlowStore.useSkillUserTableSidebarDrafts();
  const fusion = useFusionFlowStore.useFusionDraft();

  const [skillUserTableModuleDraft, setSkillUserTableModuleDraft] =
    useState<SkillUserTableModule | null>(null);
  const [userTableDraft, setUserTableDraft] =
    useState<Partial<SkillUserTable> | null>(null);
  const [skillUserSidebarDraft, setSkillUserSidebarDraft] =
    useState<Partial<SkillUserTableSidebar> | null>(null);

  // const { data: fusion } = useFusion(fusionSlug);
  const { mutate: updateFusion } = useUpdateItem({
    modelName: ApiModels.Fusion,
  });

  const updateFusionFields = React.useCallback(
    (
      data: AddAssociatedFieldFormType,
      goBack: () => void,
      fields: Partial<DataField>[],
      draftsKey: DraftsKey = "fusionFieldDrafts"
    ) => {
      if (!fusion || !fields.length) {
        return;
      }
      const fusionFieldsKey = getFusionFieldKeyFromDraftKey(draftsKey);
      if (fields.length === 1) {
        const dataFieldDraft = fields[0];
        let fusionFields = (fusion?.[fusionFieldsKey]?.fields ||
          []) as DataField[];
        const fieldIndex = fusionFields.findIndex(
          (f) => f.id === dataFieldDraft.id
        );
        if (fieldIndex > -1) {
          fusionFields[fieldIndex] = {
            ...fusionFields[fieldIndex],
            ...dataFieldDraft,
            ...data,
          };
        } else {
          fusionFields.push({ ...dataFieldDraft, ...data } as DataField);
        }
        const newFields = {
          ...(fusion?.[fusionFieldsKey] || {}),
          fields: fusionFields,
        };
        updateFusion({
          slug: fusionSlug!,
          data: {
            [fusionFieldsKey]: newFields,
          },
        });
        setFusionFields(newFields, draftsKey);
        emptyDataFieldDrafts(draftsKey);
        goBack();
      } else {
        const finalDraft = fields.reduceRight((finalDraft, draft, idx, arr) => {
          if (idx === arr.length - 1) {
            return { ...draft, ...data };
          }

          let newDraft = { ...draft };
          if (newDraft.fields) {
            const fieldIdx = newDraft.fields.findIndex(
              (f) => f.id === finalDraft.id
            );
            if (fieldIdx > -1) {
              newDraft.fields = newDraft.fields!.map((f) =>
                f.id === finalDraft.id
                  ? {
                      ...f,
                      ...finalDraft,
                    }
                  : f
              );
            } else {
              newDraft.fields = [...(newDraft.fields || []), { ...finalDraft }];
            }
          } else {
            newDraft.fields = [...(newDraft.fields || []), { ...finalDraft }];
          }

          return newDraft;
        }, {} as any);
        const dataFieldDraft = finalDraft;
        let fusionFields = (fusion[fusionFieldsKey]?.fields ||
          []) as DataField[];
        const fieldIndex = fusionFields.findIndex(
          (f) => f.id === dataFieldDraft.id
        );
        if (fieldIndex > -1) {
          fusionFields[fieldIndex] = {
            ...fusionFields[fieldIndex],
            ...dataFieldDraft,
          };
        } else {
          fusionFields.push({ ...dataFieldDraft, ...data });
        }
        const newFields = {
          ...(fusion?.[fusionFieldsKey] || {}),
          fields: fusionFields,
        };
        updateFusion({
          slug: fusionSlug!,
          data: {
            [fusionFieldsKey]: newFields,
          },
        });
        setFusionFields(newFields, draftsKey);
        mergeDataFieldDraftTail(data, draftsKey);
        goBack();
      }
    },
    [
      emptyDataFieldDrafts,
      fusion,
      fusionSlug,
      mergeDataFieldDraftTail,
      setFusionFields,
      updateFusion,
    ]
  );

  const updateSkillUserTableFields = React.useCallback(
    (
      data: AddAssociatedFieldFormType,
      goBack: () => void,
      fields: Partial<DataField>[]
    ) => {
      const skillUserTable = fusion?.skill_user_tables?.find(
        (sk) => sk.id === userTableDraft?.id
      );
      if (!fusion || !fields.length || !skillUserTable) {
        return;
      }
      if (fields.length === 1) {
        const dataFieldDraft = fields[0];
        let fusionFields = (skillUserTable.fields?.fields || []) as DataField[];
        const fieldIndex = fusionFields.findIndex(
          (f) => f.id === dataFieldDraft.id
        );
        if (fieldIndex > -1) {
          fusionFields[fieldIndex] = {
            ...fusionFields[fieldIndex],
            ...dataFieldDraft,
            ...data,
          };
        } else {
          fusionFields.push({ ...dataFieldDraft, ...data } as DataField);
        }
        const newFields = {
          ...(skillUserTable.fields || {}),
          fields: fusionFields,
        };
        updateFusion({
          slug: fusionSlug!,
          data: {
            skill_user_tables:
              fusion.skill_user_tables?.map((sk) => {
                if (sk.id === skillUserTable.id) {
                  return {
                    ...sk,
                    fields: newFields,
                  };
                }

                return sk;
              }) || [],
          },
        });
        // setFusionFields(newFields, "skillUserTableFieldDrafts");
        emptyDataFieldDrafts("skillUserTableFieldDrafts");
        goBack();
        setUserTableDraft((prev) => ({ ...prev, fields: newFields }));
      } else {
        const finalDraft = fields.reduceRight((finalDraft, draft, idx, arr) => {
          if (idx === arr.length - 1) {
            return { ...draft, ...data };
          }

          let newDraft = { ...draft };
          if (newDraft.fields) {
            const fieldIdx = newDraft.fields.findIndex(
              (f) => f.id === finalDraft.id
            );
            if (fieldIdx > -1) {
              newDraft.fields = newDraft.fields!.map((f) =>
                f.id === finalDraft.id
                  ? {
                      ...f,
                      ...finalDraft,
                    }
                  : f
              );
            } else {
              newDraft.fields = [...(newDraft.fields || []), { ...finalDraft }];
            }
          } else {
            newDraft.fields = [...(newDraft.fields || []), { ...finalDraft }];
          }

          return newDraft;
        }, {} as any);
        const dataFieldDraft = finalDraft;
        let fusionFields = (skillUserTable.fields?.fields || []) as DataField[];
        const fieldIndex = fusionFields.findIndex(
          (f) => f.id === dataFieldDraft.id
        );
        if (fieldIndex > -1) {
          fusionFields[fieldIndex] = {
            ...fusionFields[fieldIndex],
            ...dataFieldDraft,
          };
        } else {
          fusionFields.push({ ...dataFieldDraft, ...data });
        }
        const newFields = {
          ...(skillUserTable.fields || {}),
          fields: fusionFields,
        };
        updateFusion({
          slug: fusionSlug!,
          data: {
            skill_user_tables:
              fusion.skill_user_tables?.map((sk) => {
                if (sk.id === skillUserTable.id) {
                  return {
                    ...sk,
                    fields: newFields,
                  };
                }

                return sk;
              }) || [],
          },
        });
        // setFusionFields(newFields, "skillUserTableFieldDrafts");
        mergeDataFieldDraftTail(data, "skillUserTableFieldDrafts");
        goBack();
        setUserTableDraft((prev) => ({ ...prev, fields: newFields }));
      }
    },
    [
      emptyDataFieldDrafts,
      fusion,
      fusionSlug,
      mergeDataFieldDraftTail,
      updateFusion,
      userTableDraft,
    ]
  );

  const updateSkillUserSidebarFields = React.useCallback(
    (
      data: AddAssociatedFieldFormType,
      goBack: () => void,
      fields: Partial<DataField>[]
    ) => {
      const skillUserTableSidebar = fusion?.skill_user_table_sidebars?.find(
        (sk) => sk.id === skillUserSidebarDraft?.id
      );
      if (!fusion || !fields.length || !skillUserTableSidebar) {
        return;
      }
      if (fields.length === 1) {
        const dataFieldDraft = fields[0];
        let fusionFields = (skillUserTableSidebar.fields?.fields ||
          []) as DataField[];
        const fieldIndex = fusionFields.findIndex(
          (f) => f.id === dataFieldDraft.id
        );
        if (fieldIndex > -1) {
          fusionFields[fieldIndex] = {
            ...fusionFields[fieldIndex],
            ...dataFieldDraft,
            ...data,
          };
        } else {
          fusionFields.push({ ...dataFieldDraft, ...data } as DataField);
        }
        const newFields = {
          ...(skillUserTableSidebar.fields || {}),
          fields: fusionFields,
        };
        updateFusion({
          slug: fusionSlug!,
          data: {
            skill_user_table_sidebars:
              fusion.skill_user_table_sidebars?.map((sk) => {
                if (sk.id === skillUserTableSidebar.id) {
                  return {
                    ...sk,
                    fields: newFields,
                  };
                }

                return sk;
              }) || [],
          },
        });
        // setFusionFields(newFields, "skillUserTableFieldDrafts");
        emptyDataFieldDrafts("skillUserTableSidebarDrafts");
        goBack();
        setSkillUserSidebarDraft((prev) => ({ ...prev, fields: newFields }));
      } else {
        const finalDraft = fields.reduceRight((finalDraft, draft, idx, arr) => {
          if (idx === arr.length - 1) {
            return { ...draft, ...data };
          }

          let newDraft = { ...draft };
          if (newDraft.fields) {
            const fieldIdx = newDraft.fields.findIndex(
              (f) => f.id === finalDraft.id
            );
            if (fieldIdx > -1) {
              newDraft.fields = newDraft.fields!.map((f) =>
                f.id === finalDraft.id
                  ? {
                      ...f,
                      ...finalDraft,
                    }
                  : f
              );
            } else {
              newDraft.fields = [...(newDraft.fields || []), { ...finalDraft }];
            }
          } else {
            newDraft.fields = [...(newDraft.fields || []), { ...finalDraft }];
          }

          return newDraft;
        }, {} as any);
        const dataFieldDraft = finalDraft;
        let fusionFields = (skillUserTableSidebar.fields?.fields ||
          []) as DataField[];
        const fieldIndex = fusionFields.findIndex(
          (f) => f.id === dataFieldDraft.id
        );
        if (fieldIndex > -1) {
          fusionFields[fieldIndex] = {
            ...fusionFields[fieldIndex],
            ...dataFieldDraft,
          };
        } else {
          fusionFields.push({ ...dataFieldDraft, ...data });
        }
        const newFields = {
          ...(skillUserTableSidebar.fields || {}),
          fields: fusionFields,
        };
        updateFusion({
          slug: fusionSlug!,
          data: {
            skill_user_table_sidebars:
              fusion.skill_user_table_sidebars?.map((sk) => {
                if (sk.id === skillUserTableSidebar.id) {
                  return {
                    ...sk,
                    fields: newFields,
                  };
                }

                return sk;
              }) || [],
          },
        });
        // setFusionFields(newFields, "skillUserTableFieldDrafts");
        mergeDataFieldDraftTail(data, "skillUserTableSidebarDrafts");
        goBack();
        setSkillUserSidebarDraft((prev) => ({ ...prev, fields: newFields }));
      }
    },
    [
      emptyDataFieldDrafts,
      fusion,
      fusionSlug,
      mergeDataFieldDraftTail,
      updateFusion,
      skillUserSidebarDraft,
    ]
  );

  const onSaveUserTable = useCallback(
    async (table: Partial<SkillUserTable>) => {
      if (userTableDraft) {
        updateFusion({
          slug: fusionSlug!,
          data: {
            skill_user_tables: (fusion?.skill_user_tables?.map((t) => {
              if (t.id === userTableDraft.id) {
                return {
                  ...t,
                  ...table,
                };
              }

              return t;
            }) || []) as SkillUserTable[],
          },
        });
      } else {
        const isValid = !fusion?.skill_user_tables?.find(
          (s) => s.slug === table.slug
        );
        if (isValid) {
          updateFusion({
            slug: fusionSlug!,
            data: {
              skill_user_tables: [
                ...(fusion?.skill_user_tables || []),
                {
                  ...table,
                  id: v4(),
                  module_id: skillUserTableModuleDraft?.id,
                  fields: {
                    fields: [
                      {
                        id: v4(),
                        type: DocumentElementType.TextField,
                        required: true,
                        slug: "title",
                        title: "Title",
                      },
                    ],
                  },
                },
              ] as SkillUserTable[],
            },
          });
        } else {
          enqueueSnackbar("Slug already exists", { variant: "error" });
        }
      }
    },
    [
      fusion,
      fusionSlug,
      skillUserTableModuleDraft?.id,
      skillUserTableModuleDraft?.slug,
      userTableDraft,
    ]
  );

  const onSaveSidebar = useCallback(
    async (table: Partial<SkillUserTableSidebar>) => {
      if (skillUserSidebarDraft) {
        updateFusion({
          slug: fusionSlug!,
          data: {
            skill_user_table_sidebars: (fusion?.skill_user_table_sidebars?.map(
              (t) => {
                if (t.id === skillUserSidebarDraft.id) {
                  return {
                    ...t,
                    ...table,
                  };
                }

                return t;
              }
            ) || []) as SkillUserTableSidebar[],
          },
        });
      } else {
        const isValid = !fusion?.skill_user_table_sidebars?.find(
          (s) => s.slug === table.slug
        );
        if (isValid) {
          updateFusion({
            slug: fusionSlug!,
            data: {
              skill_user_table_sidebars: [
                ...(fusion?.skill_user_table_sidebars || []),
                {
                  ...table,
                  id: v4(),
                  module_id: skillUserTableModuleDraft?.id,
                  table_id: userTableDraft?.id,
                  // parent_sidebar_id: parentId,
                  fields: {
                    fields: [
                      {
                        id: v4(),
                        type: DocumentElementType.TextField,
                        required: true,
                        slug: "title",
                        title: "Title",
                      },
                    ],
                  },
                },
              ] as SkillUserTableSidebar[],
            },
          });
        } else {
          enqueueSnackbar("Slug already exists", { variant: "error" });
        }
      }
    },
    [
      skillUserSidebarDraft,
      fusionSlug,
      fusion,
      skillUserTableModuleDraft?.slug,
      skillUserTableModuleDraft?.id,
      userTableDraft?.id,
    ]
  );

  const onSaveUserTableModule = useCallback(
    (table: Partial<SkillUserTableModule>) => {
      if (skillUserTableModuleDraft) {
        updateFusion({
          slug: fusionSlug!,
          data: {
            skill_user_table_modules: (fusion?.skill_user_table_modules?.map(
              (t) => {
                if (t.id === skillUserTableModuleDraft.id) {
                  return {
                    ...t,
                    ...table,
                  };
                }

                return t;
              }
            ) || []) as SkillUserTableModule[],
          },
        });
      } else {
        const moduleId = v4();
        updateFusion({
          slug: fusionSlug!,
          data: {
            skill_user_table_modules: [
              ...(fusion?.skill_user_table_modules || []),
              { ...table, id: moduleId },
            ] as SkillUserTableModule[],
            skill_user_tables: [
              ...(fusion?.skill_user_tables || []),
              {
                id: v4(),
                slug: "primary_record",
                name: "Primary Record",
                module_id: moduleId,
                fields: {
                  fields: [
                    {
                      id: v4(),
                      type: DocumentElementType.TextField,
                      required: true,
                      slug: "title",
                      title: "Title",
                    },
                  ],
                },
              },
            ] as SkillUserTable[],
          },
        });
      }
    },
    [fusion, fusionSlug, skillUserTableModuleDraft]
  );

  const getComponents: Config["getComponents"] = useCallback(
    (gotoComponent, goBack) => {
      return {
        main: (
          <MainComponent
            onAddModuleClick={() => {
              gotoComponent({
                name: "add-skill-user-table-module",
                id: "add-skill-user-table-module",
              });
            }}
            onModuleClick={(tableModule) => {
              setSkillUserTableModuleDraft(tableModule);
              gotoComponent({
                name: "add-skill-user-table-module",
                id: tableModule.id,
              });
            }}
            onAddFieldClick={(type) => {
              const id = v4();
              pushDataFieldDraft({ id }, type);
              if (type === "fusionFieldDrafts")
                gotoComponent({ name: "add-field", id: "add-field" });

              if (type === "skillUserFieldDrafts")
                gotoComponent({
                  name: "add-skill-user-field",
                  id: "add-skill-user-field",
                });

              if (type === "skillSessionFieldDrafts")
                gotoComponent({
                  name: "add-skill-session-field",
                  id: "add-skill-session-field",
                });
            }}
            onFieldClick={(field, type) => {
              pushDataFieldDraft(field, type);
              if (type === "fusionFieldDrafts")
                gotoComponent({ name: "add-field", id: field.id });

              if (type === "skillUserFieldDrafts")
                gotoComponent({
                  name: "add-skill-user-field",
                  id: field.id,
                });

              if (type === "skillSessionFieldDrafts")
                gotoComponent({
                  name: "add-skill-session-field",
                  id: field.id,
                });
            }}
            skillIntents={skillIntents}
            onAddSkillIntent={() => {
              gotoComponent({
                name: "add-skill-intent",
                id: "add-skill-intent",
              });
            }}
            onSkillIntentClick={(intent) => {
              searchParams.append("skillIntentSlug", intent.slug);

              setSearchParams(searchParams);
              setTimeout(() => {
                gotoComponent({ name: "add-skill-intent", id: intent.slug });
              }, 0);
            }}
          />
        ),
        "add-field": (
          <AddAssociatedField
            onBackClick={() => {
              goBack();
              popDataFieldDraft();
            }}
            onSubmit={(data) => {
              updateFusionFields(data, goBack, fusionFieldDrafts);
            }}
            dataField={last(fusionFieldDrafts)}
            onAddClick={(data) => {
              updateDataFieldDraft(fusionFieldDrafts.length - 1, {
                ...fusionFieldDrafts[fusionFieldDrafts.length - 1],
                ...data,
              });
              const id = v4();
              pushDataFieldDraft({ id });
              gotoComponent(
                { name: "add-field", id },
                { updateQuery: { id: false } }
              );
            }}
            onFieldClick={(field, data) => {
              updateDataFieldDraft(fusionFieldDrafts.length - 1, {
                ...fusionFieldDrafts[fusionFieldDrafts.length - 1],
                ...data,
              });
              pushDataFieldDraft(field);
              gotoComponent({ name: "add-field", id: field.id });
            }}
            allowDefault
            extraFields={{
              isActive: true,
              isRequired: true,
              description: true,
            }}
          />
        ),
        "add-skill-user-field": (
          <AddAssociatedField
            onBackClick={() => {
              goBack();
              popDataFieldDraft("skillUserFieldDrafts");
            }}
            onSubmit={(data) => {
              updateFusionFields(
                data,
                goBack,
                skillUserFieldDrafts,
                "skillUserFieldDrafts"
              );
            }}
            dataField={last(skillUserFieldDrafts)}
            onAddClick={(data) => {
              updateDataFieldDraft(
                skillUserFieldDrafts.length - 1,
                {
                  ...skillUserFieldDrafts[skillUserFieldDrafts.length - 1],
                  ...data,
                },
                "skillUserFieldDrafts"
              );
              const id = v4();
              pushDataFieldDraft({ id }, "skillUserFieldDrafts");
              gotoComponent(
                { name: "add-skill-user-field", id },
                { updateQuery: { id: false } }
              );
            }}
            onFieldClick={(field, data) => {
              updateDataFieldDraft(
                skillUserFieldDrafts.length - 1,
                {
                  ...skillUserFieldDrafts[skillUserFieldDrafts.length - 1],
                  ...data,
                },
                "skillUserFieldDrafts"
              );
              pushDataFieldDraft(field, "skillUserFieldDrafts");
              gotoComponent({ name: "add-skill-user-field", id: field.id });
            }}
            allowDefault
            extraFields={{ requireForUse: true, includeInActivation: true }}
          />
        ),
        "add-skill-session-field": (
          <AddAssociatedField
            onBackClick={() => {
              goBack();
              popDataFieldDraft("skillSessionFieldDrafts");
            }}
            onSubmit={(data) => {
              updateFusionFields(
                data,
                goBack,
                skillSessionFieldDrafts,
                "skillSessionFieldDrafts"
              );
            }}
            dataField={last(skillSessionFieldDrafts)}
            onAddClick={(data) => {
              updateDataFieldDraft(
                skillSessionFieldDrafts.length - 1,
                {
                  ...skillSessionFieldDrafts[
                    skillSessionFieldDrafts.length - 1
                  ],
                  ...data,
                },
                "skillSessionFieldDrafts"
              );
              const id = v4();
              pushDataFieldDraft({ id }, "skillSessionFieldDrafts");
              gotoComponent(
                { name: "add-skill-session-field", id },
                { updateQuery: { id: false } }
              );
            }}
            onFieldClick={(field, data) => {
              updateDataFieldDraft(
                skillSessionFieldDrafts.length - 1,
                {
                  ...skillSessionFieldDrafts[
                    skillSessionFieldDrafts.length - 1
                  ],
                  ...data,
                },
                "skillSessionFieldDrafts"
              );
              pushDataFieldDraft(field, "skillSessionFieldDrafts");
              gotoComponent({ name: "add-skill-session-field", id: field.id });
            }}
            allowDefault
            extraFields={{ requireForUse: true, includeInActivation: true }}
          />
        ),
        "add-skill-user-table-field": (
          <AddAssociatedField
            onBackClick={() => {
              goBack();
              popDataFieldDraft("skillUserTableFieldDrafts");
            }}
            onSubmit={(data) => {
              updateSkillUserTableFields(
                data,
                goBack,
                skillUserTableFieldDrafts
              );
            }}
            dataField={last(skillUserTableFieldDrafts)}
            onAddClick={(data) => {
              updateDataFieldDraft(
                skillUserTableFieldDrafts.length - 1,
                {
                  ...skillUserTableFieldDrafts[
                    skillUserTableFieldDrafts.length - 1
                  ],
                  ...data,
                },
                "skillUserTableFieldDrafts"
              );
              const id = v4();
              pushDataFieldDraft({ id }, "skillUserTableFieldDrafts");
              gotoComponent(
                {
                  name: "add-skill-user-table-field",
                  id: `${skillUserTableModuleDraft?.id}_${userTableDraft?.id}_${id}`,
                },
                { updateQuery: { id: false } }
              );
            }}
            onFieldClick={(field, data) => {
              updateDataFieldDraft(
                skillUserTableFieldDrafts.length - 1,
                {
                  ...skillUserTableFieldDrafts[
                    skillUserTableFieldDrafts.length - 1
                  ],
                  ...data,
                },
                "skillUserTableFieldDrafts"
              );
              pushDataFieldDraft(field, "skillUserTableFieldDrafts");
              gotoComponent({
                name: "add-skill-user-table-field",
                id: `${skillUserTableModuleDraft?.id}_${userTableDraft?.id}_${field.id}`,
              });
            }}
            allowDefault
            extraFields={{ includeHidden: true }}
          />
        ),
        "add-skill-user-table": (
          <SkillUserTableEditor
            skillUserTable={userTableDraft}
            onSaveClick={(table) => {
              onSaveUserTable(table);
              goBack();
            }}
            onAddFieldClick={() => {
              const id = v4();
              pushDataFieldDraft({ id }, "skillUserTableFieldDrafts");
              gotoComponent({
                name: "add-skill-user-table-field",
                id: `${skillUserTableModuleDraft?.id}_${userTableDraft?.id}_add-skill-user-table-field`,
              });
            }}
            onBackClick={() => {
              setUserTableDraft(null);
              goBack();
            }}
            onFieldClick={(field) => {
              pushDataFieldDraft(field, "skillUserTableFieldDrafts");
              gotoComponent({
                name: "add-skill-user-table-field",
                id: `${skillUserTableModuleDraft?.id}_${userTableDraft?.id}_${field.id}`,
              });
            }}
            onAddSidebarClick={() => {
              gotoComponent({
                name: "add-skill-user-table-sidebar",
                id: `${userTableDraft?.id}_add-skill-user-table-sidebar`,
              });
            }}
            onSidebarClick={(sidebar) => {
              setSkillUserSidebarDraft(sidebar);
              gotoComponent({
                name: "add-skill-user-table-sidebar",
                id: `${userTableDraft?.id}_${sidebar.id}`,
              });
            }}
          />
        ),
        "add-skill-user-table-sidebar-field": (
          <AddAssociatedField
            onBackClick={() => {
              goBack();
              popDataFieldDraft("skillUserTableSidebarDrafts");
            }}
            onSubmit={(data) => {
              updateSkillUserSidebarFields(
                data,
                goBack,
                skillUserTableSidebarDrafts
              );
            }}
            dataField={last(skillUserTableSidebarDrafts)}
            onAddClick={(data) => {
              updateDataFieldDraft(
                skillUserTableSidebarDrafts.length - 1,
                {
                  ...skillUserTableSidebarDrafts[
                    skillUserTableSidebarDrafts.length - 1
                  ],
                  ...data,
                },
                "skillUserTableSidebarDrafts"
              );
              const id = v4();
              pushDataFieldDraft({ id }, "skillUserTableSidebarDrafts");
              gotoComponent(
                {
                  name: "add-skill-user-table-sidebar-field",
                  id: `${skillUserTableModuleDraft?.id}_${skillUserSidebarDraft?.id}_${id}`,
                },
                { updateQuery: { id: false } }
              );
            }}
            onFieldClick={(field, data) => {
              updateDataFieldDraft(
                skillUserTableSidebarDrafts.length - 1,
                {
                  ...skillUserTableSidebarDrafts[
                    skillUserTableSidebarDrafts.length - 1
                  ],
                  ...data,
                },
                "skillUserTableSidebarDrafts"
              );
              pushDataFieldDraft(field, "skillUserTableSidebarDrafts");
              gotoComponent({
                name: "add-skill-user-table-sidebar-field",
                id: `${skillUserTableModuleDraft?.id}_${skillUserSidebarDraft?.id}_${field.id}`,
              });
            }}
            allowDefault
            extraFields={{ includeHidden: true }}
          />
        ),
        "add-skill-user-table-sidebar": (
          <SkillUserTableSidebarEditor
            skillUserTableSidebar={skillUserSidebarDraft}
            skillUserTableSidebars={fusion?.skill_user_table_sidebars || []}
            onSaveClick={(sidebar) => {
              onSaveSidebar(sidebar);
              const searchParams = getSearchParams();
              const s = searchParams.get("s");
              let parentId: string | undefined = undefined;
              if (s) {
                const sSplit = s.split("_");
                if (sSplit.length === 3) {
                  parentId = sSplit[1];
                }
              }
              const parentSidebar = fusion?.skill_user_table_sidebars?.find(
                (s) => s.id === parentId
              );
              if (parentSidebar) {
                setSkillUserSidebarDraft(parentSidebar);
              } else {
                setSkillUserSidebarDraft(null);
              }
              goBack();
            }}
            onAddFieldClick={() => {
              const id = v4();
              pushDataFieldDraft({ id }, "skillUserTableSidebarDrafts");
              gotoComponent({
                name: "add-skill-user-table-sidebar-field",
                id: `${skillUserTableModuleDraft?.id}_${skillUserSidebarDraft?.id}_add-skill-user-table-sidebar-field`,
              });
            }}
            onBackClick={() => {
              const searchParams = getSearchParams();
              const s = searchParams.get("s");
              let parentId: string | undefined = undefined;
              if (s) {
                const sSplit = s.split("_");
                if (sSplit.length === 3) {
                  parentId = sSplit[1];
                }
              }
              const parentSidebar = fusion?.skill_user_table_sidebars?.find(
                (s) => s.id === parentId
              );
              if (parentSidebar) {
                setSkillUserSidebarDraft(parentSidebar);
              } else {
                setSkillUserSidebarDraft(null);
              }
              goBack();
            }}
            onFieldClick={(field) => {
              pushDataFieldDraft(field, "skillUserTableSidebarDrafts");
              gotoComponent({
                name: "add-skill-user-table-sidebar-field",
                id: `${skillUserTableModuleDraft?.id}_${skillUserSidebarDraft?.id}_${field.id}`,
              });
            }}
            onAddSidebarClick={() => {
              const id = skillUserSidebarDraft?.id;
              setSkillUserSidebarDraft(null);
              gotoComponent({
                name: "add-skill-user-table-sidebar",
                id: `${userTableDraft?.id}_${id}_add-skill-user-table-sidebar`,
              });
            }}
            onSidebarClick={(sidebar) => {
              const id = skillUserSidebarDraft?.id;
              setSkillUserSidebarDraft(sidebar);
              gotoComponent({
                name: "add-skill-user-table-sidebar",
                id: `${userTableDraft?.id}_${id}_${sidebar.id}`,
              });
            }}
          />
        ),
        "add-skill-user-table-module": (
          <SkillUserTableModuleEditor
            skillUserTableModule={skillUserTableModuleDraft}
            onSaveClick={(tableModule) => {
              onSaveUserTableModule(tableModule);
              goBack();
            }}
            onBackClick={() => {
              setSkillUserTableModuleDraft(null);
              goBack();
            }}
            onAddTableClick={() => {
              gotoComponent({
                name: "add-skill-user-table",
                id: `${skillUserTableModuleDraft?.id}_add-skill-user-table`,
              });
            }}
            onTableClick={(table) => {
              setUserTableDraft(table);
              gotoComponent({
                name: "add-skill-user-table",
                id: `${skillUserTableModuleDraft?.id}_${table.id}`,
              });
            }}
          />
        ),
        "add-skill-intent": (
          <SkillIntentEditor
            // skillIntent={skillUserTableModuleDraft}
            onSaveClick={(tableModule) => {
              const param = searchParams.get("skillIntentSlug");
              if (param) {
                searchParams.delete("skillIntentSlug");
                setSearchParams(searchParams);
              }

              setTimeout(() => {
                goBack();
              }, 0);
            }}
            onBackClick={() => {
              const param = searchParams.get("skillIntentSlug");
              if (param) {
                searchParams.delete("skillIntentSlug");
                setSearchParams(searchParams);
              }
              setTimeout(() => {
                goBack();
              }, 0);
            }}
          />
        ),
      };
    },
    [
      skillIntents,
      fusionFieldDrafts,
      skillUserFieldDrafts,
      skillSessionFieldDrafts,
      skillUserTableFieldDrafts,
      userTableDraft,
      skillUserTableSidebarDrafts,
      skillUserSidebarDraft,
      fusion,
      skillUserTableModuleDraft,
      pushDataFieldDraft,
      searchParams,
      setSearchParams,
      popDataFieldDraft,
      updateFusionFields,
      updateDataFieldDraft,
      updateSkillUserTableFields,
      onSaveUserTable,
      updateSkillUserSidebarFields,
      onSaveSidebar,
      onSaveUserTableModule,
    ]
  );

  return (
    <AnimationLayout
      config={{
        getComponents,
        initialComponent: getSearchParams().get("s_name") || "main",
      }}
      enableScrollbar
      ref={rightSidebarRef}
      urlQueryKey="s"
    />
  );
};

export default FusionRightBar;
