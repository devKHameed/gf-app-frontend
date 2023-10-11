import { zodResolver } from "@hookform/resolvers/zod";
import {
  BarChartOutlined,
  CloseOutlined,
  DataUsageOutlined,
  DeleteOutline,
  EditOutlined,
  LocalOfferOutlined,
  ScoreOutlined,
  TimelineOutlined,
  Toc,
} from "@mui/icons-material";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import {
  Box,
  Button,
  CardActions,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Drawer,
  DrawerProps,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { useIsMutating } from "@tanstack/react-query";
import AddAssociatedField, {
  AddAssociatedFieldFormType,
} from "components/AddAssociatedField";
import FieldIcon from "components/Form/FieldIcon";
import FormField from "components/FormField";
import IOSSwitch from "components/IOSSwitch";
import SidebarSection from "components/RightSidebar";
import { SortableList } from "components/SortableList";
import Icon from "components/util-components/Icon";
import {
  DASHBOARD_WIDGET_TYPE,
  DASHBOARD_WIDGET_TYPE_OPTIONS,
} from "constants/gui";
import useAccountSlug from "hooks/useAccountSlug";
import useOpenClose from "hooks/useOpenClose";
import AnimationLayout, { Config } from "layouts/AnimationLayout";
import { cloneDeep, last } from "lodash";
import GuiDashboardWidgetModel from "models/GuiDashboardWidget";
import { ApiModels } from "queries/apiModelMapping";
import useCreateItem from "queries/useCreateItem";
import useDeleteItem from "queries/useDeleteItem";
import useUpdateItem from "queries/useUpdateItem";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useGuiDashboardStore } from "store/stores/gui-dashboard-widget";
import ProfileCard from "stories/CompoundComponent/ProfileCard/ProfileCard";
import { normalizeObjectForAPI } from "utils";
import { v4 } from "uuid";
import { z } from "zod";

const RightSideBox = styled(Drawer)(({ theme }) => {
  return {
    ".MuiToolbar-root": {
      minHeight: "60px",
      borderBottom: `1px solid ${theme.palette.other?.divider}`,
    },

    ".form-body-area": {
      padding: "20px",
    },

    ".fields-holder": {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },

    ".MuiListItem-root": {
      padding: "17px 0",
    },

    ".MuiFormLabel-root": {
      fontSize: "14px",
      lineHeight: "20px",
      fontWeight: "400",
      color: theme.palette.text.primary,
    },

    ".MuiCardActions-spacing": {
      padding: "18px 0",
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

type ConfirmationDialogProps = {
  onClose: () => void;
  onSubmit: () => void;
} & DialogProps;

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = (props) => {
  const { onClose, open, onSubmit, ...other } = props;

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onSubmit();
    onClose();
  };

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
      {...other}
    >
      <DialogTitle>Delete Widget</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">
          Are you sure you want to delete this widget?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
};

type FusionLinkButtonProps = {
  title: React.ReactNode;
  fusionSlug: string;
};

const FusionLinkButton: React.FC<FusionLinkButtonProps> = (props) => {
  const { title, fusionSlug } = props;
  const accountSlug = useAccountSlug();

  return (
    <Link to={`/${accountSlug}/fusion/flow-designer/${fusionSlug}`}>
      <Button variant="outlined" fullWidth>
        {title}
      </Button>
    </Link>
  );
};

const FusionButton: React.FC = () => {
  const navigate = useNavigate();

  const widget = useGuiDashboardStore.useWidgetDraft();

  switch (widget?.widget_type) {
    case DASHBOARD_WIDGET_TYPE.LINE:
      return (
        <FusionLinkButton
          title={
            <>
              <TimelineOutlined fontSize="small" sx={{ mr: 2 }} />
              Line Chart Fusion Editor
            </>
          }
          fusionSlug={widget?.associated_fusion_id || ""}
        />
      );
    case DASHBOARD_WIDGET_TYPE.BAR:
      return (
        <FusionLinkButton
          title={
            <>
              <BarChartOutlined fontSize="small" sx={{ mr: 1 }} />
              Bar Chart Fusion Editor
            </>
          }
          fusionSlug={widget?.associated_fusion_id || ""}
        />
      );

    case DASHBOARD_WIDGET_TYPE.PIE:
      return (
        <FusionLinkButton
          title={
            <>
              <DataUsageOutlined fontSize="small" sx={{ mr: 1 }} />
              Pie Chart Fusion Editor
            </>
          }
          fusionSlug={widget?.associated_fusion_id || ""}
        />
      );

    case DASHBOARD_WIDGET_TYPE.STAT:
      return (
        <FusionLinkButton
          title={
            <>
              <ScoreOutlined fontSize="small" sx={{ mr: 1 }} />
              Stats Widget Fusion Editor
            </>
          }
          fusionSlug={widget?.associated_fusion_id || ""}
        />
      );

    case DASHBOARD_WIDGET_TYPE.DATA_LIST:
      return (
        <FusionLinkButton
          title={
            <>
              <Toc fontSize="small" sx={{ mr: 1 }} />
              Data List Widget Fusion Editor
            </>
          }
          fusionSlug={widget?.associated_fusion_id || ""}
        />
      );
    default:
      return <></>;
  }
};

const tableActionButtonsFormSchema = z.object({
  id: z.string().optional(),
  button_title: z.string(),
  enable_populate_fusion: z.boolean().default(false),
});

type TableActionButtonsFormType = z.infer<typeof tableActionButtonsFormSchema>;

type TableActionButtonsFormProps = {
  actionButton?: Partial<WidgetAction> | null;
  onCancelClick(): void;
  onSubmitClick(data: TableActionButtonsFormType): void;
  onAddFieldClick?(): void;
  onFieldClick?(field: DataField): void;
  type: "create" | "edit";
};

const TableActionButtonsForm: React.FC<TableActionButtonsFormProps> = (
  props
) => {
  const {
    onCancelClick,
    onSubmitClick,
    actionButton,
    onAddFieldClick,
    onFieldClick,
    type,
  } = props;

  const {
    register,
    formState: { dirtyFields, errors },
    handleSubmit,
    control,
    reset,
  } = useForm<TableActionButtonsFormType>({
    resolver: zodResolver(tableActionButtonsFormSchema),
  });

  const isMutating = useIsMutating([ApiModels.GuiDashboardWidget]);

  const widgetDraft = useGuiDashboardStore.useWidgetDraft();
  const setActionButtonDraft = useGuiDashboardStore.useSetActionButtonDraft();

  const [items, setItems] = useState<DataField[]>([]);

  useEffect(() => {
    setItems((actionButton?.form_fields?.fields || []) as DataField[]);
  }, [actionButton]);

  useEffect(() => {
    if (actionButton) {
      reset(actionButton);
    }
  }, [actionButton]);

  const onSubmit = (data: TableActionButtonsFormType) => {
    onSubmitClick({ ...data, id: actionButton?.id || v4() });
  };

  const theme = useTheme();

  return (
    <Box className="form-body-area">
      <form className="fields-holder" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="Button Title"
          error={!!dirtyFields.button_title ? errors.button_title : undefined}
        >
          <TextField
            {...register("button_title")}
            autoFocus
            margin="dense"
            id="button_title"
            type="text"
            hiddenLabel
            size="small"
            variant="filled"
            fullWidth
          />
        </FormField>
        <FormField
          label="Enable Populate Fusion"
          error={
            !!dirtyFields.enable_populate_fusion
              ? errors.enable_populate_fusion
              : undefined
          }
        >
          <Controller
            name="enable_populate_fusion"
            control={control}
            render={({ field }) => (
              <ProfileCard
                title="Active"
                rightIcon={
                  <IOSSwitch
                    checked={field?.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                options={{ switcher: false, draggable: false }}
                sx={{ minHeight: "54px" }}
              />
            )}
          />
        </FormField>
        {actionButton && (
          <Stack spacing={2}>
            <SidebarSection
              title="Form Fields"
              onRightIconClick={() => onAddFieldClick?.()}
            >
              <SortableList
                items={items}
                onChange={(updatedItems) => {
                  setItems(updatedItems);
                  if (actionButton) {
                    GuiDashboardWidgetModel.updateForm(
                      widgetDraft?.slug!,
                      actionButton.id!,
                      { form_fields: { fields: updatedItems } },
                      type
                    );
                    setActionButtonDraft({
                      ...actionButton,
                      form_fields: { fields: updatedItems },
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
                          <Box className="edit-icon">
                            <EditOutlined sx={{ color: "grey.500" }} />
                            {/* <DeleteOutline
                              sx={{ color: "grey.500" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteClick?.(item.id)
                              }}
                            /> */}
                          </Box>
                        }
                        subTitle={item.slug}
                        title={item.title}
                        sx={{
                          background:
                            theme.palette.background.GFRightNavForeground,
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
            </SidebarSection>
            <FusionLinkButton
              title={
                <>
                  <Toc fontSize="small" sx={{ mr: 1 }} />
                  Populate Fusion
                </>
              }
              fusionSlug={actionButton.populate_fusion || ""}
            />
            <FusionLinkButton
              title={
                <>
                  <Toc fontSize="small" sx={{ mr: 1 }} />
                  Submit Fusion
                </>
              }
              fusionSlug={actionButton.submit_fusion || ""}
            />
          </Stack>
        )}
        <CardActions
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button variant="outlined" color="inherit" onClick={onCancelClick}>
            Cancel
          </Button>
          <Button
            color="inherit"
            type="submit"
            sx={{
              bgcolor: (theme) => theme.palette.primary.main,
            }}
          >
            Save
            {!!isMutating ? (
              <CircularProgress size={24} sx={{ color: "inherit", ml: 1 }} />
            ) : null}
          </Button>
        </CardActions>
      </form>
    </Box>
  );
};

type EditFieldsProps = {
  widgetType: string;
  filterItems: WidgetFilterGroup[];
  setFilterItems: (filterItems: WidgetFilterGroup[]) => void;
  onAddFilterClick(): void;
  onDeleteFilterClick(id: string): void;
  onFilterItemClick(item: WidgetFilterGroup): void;
  createFormItems?: WidgetAction[];
  setCreateFormItems?(createFormItems: WidgetAction[]): void;
  onAddCreateFormClick?(): void;
  onDeleteCreateFormClick?(id: string): void;
  onCreateFormItemClick?(item: WidgetAction): void;
  editFormItems?: WidgetAction[];
  setEditFormItems?(editFormItems: WidgetAction[]): void;
  onAddEditFormClick?(): void;
  onDeleteEditFormClick?(id: string): void;
  onEditFormItemClick?(item: WidgetAction): void;
  onDeleteClick?(): void;
};

const EditFields: React.FC<EditFieldsProps> = (props) => {
  const {
    widgetType,
    filterItems,
    setFilterItems,
    onAddFilterClick,
    onDeleteFilterClick,
    onFilterItemClick,
    onDeleteClick,
    createFormItems,
    setCreateFormItems,
    onAddCreateFormClick,
    onDeleteCreateFormClick,
    onCreateFormItemClick,
    editFormItems,
    setEditFormItems,
    onAddEditFormClick,
    onDeleteEditFormClick,
    onEditFormItemClick,
  } = props;

  const theme = useTheme();

  const DefaultItemStyles = React.useMemo(
    () => ({
      background: "#2F2F36",
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
    []
  );

  return (
    <Stack spacing={3.75}>
      {widgetType === DASHBOARD_WIDGET_TYPE.DATA_LIST && (
        <>
          <SidebarSection
            title="Create Form"
            onRightIconClick={onAddCreateFormClick}
          >
            <SortableList
              items={createFormItems || []}
              onChange={(updatedItems) => {
                setCreateFormItems?.(updatedItems);
              }}
              renderItem={(item) => {
                return (
                  <SortableList.Item id={item.id} handle>
                    <ProfileCard
                      options={{
                        draggable: true,
                        switcher: false,
                      }}
                      title={item.button_title}
                      sx={DefaultItemStyles}
                      rightIcon={
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCreateFormClick?.(item.id);
                          }}
                        >
                          <DeleteOutline />
                        </IconButton>
                      }
                      onClick={() => onCreateFormItemClick?.(item)}
                    />
                  </SortableList.Item>
                );
              }}
            />
          </SidebarSection>
          <SidebarSection
            title="Edit Form"
            onRightIconClick={onAddEditFormClick}
          >
            <SortableList
              items={editFormItems || []}
              onChange={(updatedItems) => {
                setEditFormItems?.(updatedItems);
              }}
              renderItem={(item) => {
                return (
                  <SortableList.Item id={item.id} handle>
                    <ProfileCard
                      options={{
                        draggable: true,
                        switcher: false,
                      }}
                      title={item.button_title}
                      sx={DefaultItemStyles}
                      rightIcon={
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteEditFormClick?.(item.id);
                          }}
                        >
                          <DeleteOutline />
                        </IconButton>
                      }
                      onClick={() => onEditFormItemClick?.(item)}
                    />
                  </SortableList.Item>
                );
              }}
            />
          </SidebarSection>
        </>
      )}
      <SidebarSection title="Filter Tabs" onRightIconClick={onAddFilterClick}>
        <SortableList
          items={filterItems}
          onChange={(updatedItems) => {
            setFilterItems(updatedItems);
          }}
          renderItem={(item) => {
            return (
              <SortableList.Item id={item.id} handle>
                <ProfileCard
                  options={{
                    draggable: true,
                    switcher: false,
                  }}
                  title={item.title}
                  sx={DefaultItemStyles}
                  rightIcon={
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteFilterClick(item.id);
                      }}
                    >
                      <DeleteOutline />
                    </IconButton>
                  }
                  onClick={() => onFilterItemClick(item)}
                />
              </SortableList.Item>
            );
          }}
        />
      </SidebarSection>
      <Stack spacing={3.75}>
        <FusionButton />
        <Button variant="outlined" fullWidth onClick={onDeleteClick}>
          <TimelineOutlined fontSize="small" sx={{ mr: 1 }} />
          Delete
        </Button>
      </Stack>
    </Stack>
  );
};

const widgetEditorFormSchema = z.object({
  name: z.string(),
  widget_type: z.string(),
  description: z.string(),
});

type WidgetEditorFormType = z.infer<typeof widgetEditorFormSchema>;

type MainFormProps = {
  onDeleteClick(): void;
  onFilterItemClick(item: WidgetFilterGroup): void;
  onAddFilterClick(): void;
  onCancelClick(): void;
  onAddActionButtonClick(type: "create" | "edit"): void;
  onActionButtonClick(type: "create" | "edit", button: WidgetAction): void;
  onDeleteActionButtonClick(type: "create" | "edit", id: string): void;
};

const MainForm: React.FC<MainFormProps> = (props) => {
  const {
    onDeleteClick,
    onFilterItemClick,
    onAddFilterClick,
    onCancelClick,
    onActionButtonClick,
    onAddActionButtonClick,
    onDeleteActionButtonClick,
  } = props;

  const [filterItems, setFilterItems] = useState<WidgetFilterGroup[]>([]);

  const widgetDraft = useGuiDashboardStore.useWidgetDraft();
  const removeWidgetFilter = useGuiDashboardStore.useRemoveWidgetFilter();

  const createFormItems = widgetDraft?.create_forms || [];
  const editFormItems = widgetDraft?.edit_forms || [];

  const { mutate: createWidget } = useCreateItem({
    modelName: ApiModels.GuiDashboardWidget,
  });
  const { mutate: updateWidget } = useUpdateItem({
    modelName: ApiModels.GuiDashboardWidget,
  });

  const {
    register,
    control,
    formState: { dirtyFields, errors },
    handleSubmit,
    reset,
    watch,
  } = useForm<WidgetEditorFormType>({
    defaultValues: {
      name: widgetDraft?.name || "",
      widget_type: widgetDraft?.widget_type || "",
      description: widgetDraft?.description || "",
    },
    resolver: zodResolver(widgetEditorFormSchema),
  });

  const formSetRef = useRef<boolean>(false);

  useEffect(() => {
    if (widgetDraft) {
      if (!formSetRef.current) {
        formSetRef.current = true;
        reset({
          name: widgetDraft.name || "",
          widget_type: widgetDraft.widget_type || "",
          description: widgetDraft.description || "",
        });
      }
      setFilterItems(widgetDraft.filter_groups || []);
    }
  }, [widgetDraft]);

  const onSubmit = (data: WidgetEditorFormType) => {
    if (widgetDraft?.slug) {
      updateWidget({
        slug: widgetDraft.slug,
        data: {
          ...data,
          filter_groups: filterItems,
        },
      });
    } else {
      createWidget({
        ...(widgetDraft || {}),
        ...data,
        filter_groups: filterItems,
      });
    }

    onCancelClick();
  };

  const onDeleteFilterClick = (id: string) => {
    if (widgetDraft?.slug) {
      removeWidgetFilter(id);
      updateWidget({
        slug: widgetDraft.slug,
        data: {
          filter_groups: filterItems.filter((item) => item.id !== id),
        },
      });
    }
  };

  const isAddMode = !widgetDraft?.slug;

  const widgetType = watch("widget_type");

  return (
    <Box className="form-body-area">
      <form className="fields-holder" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="Widget Title"
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
          label="Widget Type"
          error={!!dirtyFields.widget_type ? errors.widget_type : undefined}
        >
          <Controller
            name="widget_type"
            control={control}
            render={({ field }) => (
              <TextField
                margin="dense"
                id="widget_type"
                type="text"
                fullWidth
                hiddenLabel
                size="small"
                variant="filled"
                select
                disabled={!isAddMode}
                value={field.value || ""}
                onChange={field.onChange}
                SelectProps={{
                  renderValue(value) {
                    const option = DASHBOARD_WIDGET_TYPE_OPTIONS.find(
                      (op) => op.value === value
                    );
                    return (
                      <Stack key={option?.value} direction="row">
                        {<Icon iconName={option?.icon || ""} />}
                        <Typography variant="body1" sx={{ ml: 2 }}>
                          {option?.label}
                        </Typography>
                      </Stack>
                    );
                  },
                }}
              >
                {DASHBOARD_WIDGET_TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {<Icon iconName={option.icon} />}
                    <Typography variant="body1" sx={{ ml: 2 }}>
                      {option.label}
                    </Typography>
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </FormField>
        <FormField
          label="Widget Description"
          error={!!dirtyFields.description ? errors.description : undefined}
        >
          <TextField
            {...register("description")}
            margin="dense"
            id="description"
            type="text"
            hiddenLabel
            size="small"
            variant="filled"
            fullWidth
          />
        </FormField>
        {!isAddMode && (
          <EditFields
            widgetType={widgetType}
            filterItems={filterItems}
            setFilterItems={setFilterItems}
            onAddFilterClick={onAddFilterClick}
            onDeleteFilterClick={onDeleteFilterClick}
            onFilterItemClick={onFilterItemClick}
            onDeleteClick={onDeleteClick}
            createFormItems={createFormItems}
            onAddCreateFormClick={() => onAddActionButtonClick("create")}
            onDeleteCreateFormClick={(id) =>
              onDeleteActionButtonClick("create", id)
            }
            onCreateFormItemClick={(button) =>
              onActionButtonClick("create", button)
            }
            editFormItems={editFormItems}
            onAddEditFormClick={() => onAddActionButtonClick("edit")}
            onDeleteEditFormClick={(id) =>
              onDeleteActionButtonClick("edit", id)
            }
            onEditFormItemClick={(button) =>
              onActionButtonClick("edit", button)
            }
          />
        )}
        <CardActions
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button variant="outlined" color="inherit" onClick={onCancelClick}>
            Cancel
          </Button>
          <Button
            color="inherit"
            sx={{
              bgcolor: (theme) => theme.palette.primary.main,
            }}
            type="submit"
          >
            Save
            {/* {!!isMutating ? (
              <CircularProgress size={24} sx={{ color: "inherit", ml: 1 }} />
            ) : null} */}
          </Button>
        </CardActions>
      </form>
    </Box>
  );
};

const filterFormSchema = z.object({
  title: z.string(),
  id: z.string(),
});

type FilterFormType = z.infer<typeof filterFormSchema>;

type FilterFormProps = {
  onCancelClick(): void;
  onSubmitClick(data: FilterFormType): void;
};

const FilterForm: React.FC<FilterFormProps> = (props) => {
  const { onCancelClick, onSubmitClick } = props;

  const {
    register,
    formState: { dirtyFields, errors },
    handleSubmit,
  } = useForm<FilterFormType>({
    resolver: zodResolver(filterFormSchema),
  });

  const onSubmit = (data: FilterFormType) => {
    onSubmitClick(data);
  };
  return (
    <Box className="form-body-area">
      <form className="fields-holder" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="Filter Title"
          error={!!dirtyFields.title ? errors.title : undefined}
        >
          <TextField
            {...register("title")}
            autoFocus
            margin="dense"
            id="title"
            type="text"
            hiddenLabel
            size="small"
            variant="filled"
            fullWidth
          />
        </FormField>
        <FormField
          label="Filter Value"
          error={!!dirtyFields.id ? errors.id : undefined}
        >
          <TextField
            {...register("id")}
            margin="dense"
            id="id"
            type="text"
            hiddenLabel
            size="small"
            variant="filled"
            fullWidth
          />
        </FormField>
        <CardActions
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button variant="outlined" color="inherit" onClick={onCancelClick}>
            Cancel
          </Button>
          <Button
            color="inherit"
            type="submit"
            sx={{
              bgcolor: (theme) => theme.palette.primary.main,
            }}
          >
            Save
            {/* {!!isMutating ? (
              <CircularProgress size={24} sx={{ color: "inherit", ml: 1 }} />
            ) : null} */}
          </Button>
        </CardActions>
      </form>
    </Box>
  );
};

type Props = {
  onClose(): void;
} & DrawerProps;

const WidgetEditor: React.FC<Props> = (props) => {
  const { onClose, ...drawerProps } = props;

  const theme = useTheme();
  const [confirmOpen, openConfirmDialog, closeConfirmDialog] = useOpenClose();

  const closeWidgetEditor = useGuiDashboardStore.useCloseWidgetEditor();
  const widgetDraft = useGuiDashboardStore.useWidgetDraft();
  const updateWidgetDraft = useGuiDashboardStore.useUpdateWidgetDraft();
  const updateWidgetFilter = useGuiDashboardStore.useUpdateWidgetFilter();
  const actionButtonDraft = useGuiDashboardStore.useActionButtonDraft();
  const setActionButtonDraft = useGuiDashboardStore.useSetActionButtonDraft();

  const setActionButtonFields = useGuiDashboardStore.useSetActionButtonFields();
  const pushDataFieldDraft = useGuiDashboardStore.usePushFieldDraft();
  const popDataFieldDraft = useGuiDashboardStore.usePopFieldDraft();
  const updateDataFieldDraft = useGuiDashboardStore.useUpdateDataFieldDraft();
  const emptyDataFieldDrafts = useGuiDashboardStore.useEmptyDataFieldDrafts();
  const mergeDataFieldDraftTail =
    useGuiDashboardStore.useMergeDataFieldDraftTail();
  const fields = useGuiDashboardStore.useActionButtonFieldDrafts();

  const { mutate: deleteWidget } = useDeleteItem({
    modelName: ApiModels.GuiDashboardWidget,
  });

  const { mutate: updateWidget } = useUpdateItem({
    modelName: ApiModels.GuiDashboardWidget,
    mutationOptions: {
      mutationKey: [ApiModels.GuiDashboardWidget],
    },
  });

  useEffect(() => {
    if (widgetDraft?.slug && widgetDraft?.pushUpdate) {
      updateWidget({
        slug: widgetDraft.slug,
        data: normalizeObjectForAPI(widgetDraft, ["pushUpdate"]),
      });
    }
  }, [widgetDraft]);

  const handleDeleteWidget = () => {
    if (widgetDraft?.slug) {
      deleteWidget(
        { slug: widgetDraft.slug },
        {
          onSuccess() {
            closeWidgetEditor();
          },
        }
      );
    }
  };

  const onDeleteActionButton = React.useCallback(
    (type: "create" | "edit", id: string) => {
      const formsKey = type === "create" ? "create_forms" : "edit_forms";

      if (widgetDraft?.slug) {
        updateWidgetDraft(
          {
            [formsKey]: widgetDraft[formsKey]?.filter(
              (button) => button.id !== id
            ),
          },
          true
        );
      }
    },
    [updateWidgetDraft, widgetDraft]
  );

  const handleActionButtonFormSubmit = React.useCallback(
    (type: "create" | "edit", data: WidgetAction) => {
      if (!widgetDraft?.slug) {
        return;
      }

      const formsKey = type === "create" ? "create_forms" : "edit_forms";

      const forms = [...(cloneDeep(widgetDraft[formsKey]) || [])];
      const formIndex = forms.findIndex((f) => f.id === data.id);

      const fieldData = {
        ...data,
        form_fields: { fields: actionButtonDraft?.form_fields?.fields || [] },
      };

      if (formIndex > -1) {
        forms.splice(formIndex, 1, {
          ...forms[formIndex],
          ...fieldData,
        });
      } else {
        forms.push(fieldData);
      }

      updateWidgetDraft({ [formsKey]: forms }, false);

      if (formIndex > -1) {
        GuiDashboardWidgetModel.updateForm(
          widgetDraft.slug,
          data.id,
          data,
          type
        );
      } else {
        GuiDashboardWidgetModel.createForm(widgetDraft.slug, data, type).then(
          (res) => {
            const newActionButton = res.data;

            updateWidgetDraft({
              [formsKey]: forms.map((f) =>
                f.id === newActionButton.id ? { ...f, ...newActionButton } : f
              ),
            });
          }
        );
      }
    },
    [actionButtonDraft, updateWidgetDraft, widgetDraft]
  );

  const updateActionButtonFields = React.useCallback(
    (
      data: AddAssociatedFieldFormType,
      goBack: () => void,
      type: "create" | "edit"
    ) => {
      const draft = cloneDeep(actionButtonDraft);
      if (!actionButtonDraft || !fields.length || !draft) {
        return;
      }
      if (fields.length === 1) {
        const dataFieldDraft = fields[0];
        let fusionFields = (draft?.form_fields?.fields || []) as DataField[];
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
          ...(draft?.form_fields || {}),
          fields: fusionFields,
        };
        GuiDashboardWidgetModel.updateForm(
          widgetDraft?.slug!,
          draft.id!,
          { form_fields: newFields },
          type
        );

        updateWidgetDraft(
          {
            [`${type}_forms`]:
              widgetDraft?.[`${type}_forms`]?.map((f) =>
                f.id === draft.id ? { ...f, form_fields: newFields } : f
              ) || [],
          },
          false
        );

        setActionButtonFields(newFields);
        emptyDataFieldDrafts();
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
        let fusionFields = (draft.form_fields?.fields || []) as DataField[];
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
          ...(draft?.form_fields || {}),
          fields: fusionFields,
        };
        GuiDashboardWidgetModel.updateForm(
          widgetDraft?.slug!,
          draft.id!,
          { form_fields: newFields },
          type
        );
        updateWidgetDraft(
          {
            [`${type}_forms`]:
              widgetDraft?.[`${type}_forms`]?.map((f) =>
                f.id === draft.id ? { ...f, form_fields: newFields } : f
              ) || [],
          },
          false
        );
        setActionButtonFields(newFields);
        mergeDataFieldDraftTail(data);
        goBack();
      }
    },
    [
      actionButtonDraft,
      emptyDataFieldDrafts,
      fields,
      mergeDataFieldDraftTail,
      setActionButtonFields,
      updateWidgetDraft,
      widgetDraft,
    ]
  );

  const getComponents: Config["getComponents"] = useCallback(
    (gotoComponent, goBack) => {
      return {
        main: (
          <MainForm
            onDeleteClick={() => {
              openConfirmDialog();
            }}
            onFilterItemClick={(item) => {
              gotoComponent({ id: item.id, name: "filter-form" });
            }}
            onAddFilterClick={() => {
              gotoComponent({ id: "filter-form", name: "filter-form" });
            }}
            onCancelClick={onClose}
            onAddActionButtonClick={(type) => {
              gotoComponent({
                id: `${type}-action-button-form`,
                name: `${type}-action-button-form`,
              });
            }}
            onDeleteActionButtonClick={onDeleteActionButton}
            onActionButtonClick={(type, button) => {
              setActionButtonDraft(button);
              gotoComponent({
                id: button.id,
                name: `${type}-action-button-form`,
              });
            }}
          />
        ),
        "filter-form": (
          <FilterForm
            onCancelClick={goBack}
            onSubmitClick={(filter) => {
              updateWidgetFilter(filter);
              goBack();
            }}
          />
        ),
        "create-action-button-form": (
          <TableActionButtonsForm
            onCancelClick={() => {
              goBack();
              setActionButtonDraft(null);
            }}
            onSubmitClick={(data) => {
              handleActionButtonFormSubmit("create", data as WidgetAction);
              goBack();
              setActionButtonDraft(null);
            }}
            actionButton={actionButtonDraft}
            onAddFieldClick={() => {
              const id = v4();
              pushDataFieldDraft({ id });
              gotoComponent({
                name: "create-add-field",
                id: "create-add-field",
              });
            }}
            onFieldClick={(field) => {
              pushDataFieldDraft(field);
              gotoComponent({ name: "create-add-field", id: field.id });
            }}
            type="create"
          />
        ),
        "edit-action-button-form": (
          <TableActionButtonsForm
            onCancelClick={() => {
              goBack();
              setActionButtonDraft(null);
            }}
            onSubmitClick={(data) => {
              handleActionButtonFormSubmit("edit", data as WidgetAction);
              goBack();
              setActionButtonDraft(null);
            }}
            actionButton={actionButtonDraft}
            onAddFieldClick={() => {
              const id = v4();
              pushDataFieldDraft({ id });
              gotoComponent({ name: "edit-add-field", id: "edit-add-field" });
            }}
            onFieldClick={(field) => {
              pushDataFieldDraft(field);
              gotoComponent({ name: "edit-add-field", id: field.id });
            }}
            type="edit"
          />
        ),
        "create-add-field": (
          <AddAssociatedField
            onBackClick={() => {
              goBack();
              popDataFieldDraft();
            }}
            onSubmit={(data) => {
              updateActionButtonFields(data, goBack, "create");
            }}
            dataField={last(fields)}
            onAddClick={(data) => {
              updateDataFieldDraft(fields.length - 1, {
                ...fields[fields.length - 1],
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
              updateDataFieldDraft(fields.length - 1, {
                ...fields[fields.length - 1],
                ...data,
              });
              pushDataFieldDraft(field);
              gotoComponent({ name: "add-field", id: field.id });
            }}
            allowDefault
          />
        ),
        "edit-add-field": (
          <AddAssociatedField
            onBackClick={() => {
              goBack();
              popDataFieldDraft();
            }}
            onSubmit={(data) => {
              updateActionButtonFields(data, goBack, "edit");
            }}
            dataField={last(fields)}
            onAddClick={(data) => {
              updateDataFieldDraft(fields.length - 1, {
                ...fields[fields.length - 1],
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
              updateDataFieldDraft(fields.length - 1, {
                ...fields[fields.length - 1],
                ...data,
              });
              pushDataFieldDraft(field);
              gotoComponent({ name: "add-field", id: field.id });
            }}
            allowDefault
          />
        ),
      };
    },
    [
      actionButtonDraft,
      fields,
      handleActionButtonFormSubmit,
      onClose,
      onDeleteActionButton,
      openConfirmDialog,
      popDataFieldDraft,
      pushDataFieldDraft,
      setActionButtonDraft,
      updateActionButtonFields,
      updateDataFieldDraft,
      updateWidgetFilter,
    ]
  );

  return (
    <RightSideBox
      sx={{
        width: 0,
        flexShrink: 0,
        // zIndex: theme.zIndex.appBar - 1,

        [`& .MuiDrawer-paper`]: {
          zIndex: theme.zIndex.appBar - 1,
          width: 420,
          boxSizing: "border-box",
          boxShadow: "none",
          // background: "none",
          backgroundImage: "none",
          background: theme.palette.background.GFRightNavBackground,
          // background: "#1E1E1E",

          ".MuiPaper-root": {
            boxShadow: "none",
            background: "none",
            backgroundImage: "none",
          },
        },
      }}
      anchor="right"
      // hideBackdrop
      onClose={onClose}
      {...drawerProps}
    >
      <Toolbar disableGutters>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: "100%", px: "20px" }}
        >
          <Stack direction="row" spacing={1}>
            <GridViewOutlinedIcon />
            <Typography>Widget Editor</Typography>
          </Stack>
          <IconButton sx={{ color: "#ffffff" }} onClick={onClose}>
            <CloseOutlined />
          </IconButton>
        </Stack>
      </Toolbar>
      <AnimationLayout
        config={{
          getComponents,
          initialComponent: "main",
        }}
      />
      <ConfirmationDialog
        open={confirmOpen}
        onClose={closeConfirmDialog}
        onSubmit={handleDeleteWidget}
      />
    </RightSideBox>
  );
};

export default WidgetEditor;
