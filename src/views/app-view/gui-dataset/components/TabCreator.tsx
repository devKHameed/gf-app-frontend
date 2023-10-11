import { UniqueIdentifier } from "@dnd-kit/core/dist/types";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { ArrowBack } from "@mui/icons-material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { LoadingButton } from "@mui/lab";
import { Box, MenuItem, Stack, TextField, debounce } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import FormField from "components/FormField";
import SidebarSection from "components/RightSidebar";
import { MultipleContainers } from "components/drag-drop/MultipleContainer";
import { Handle } from "components/drag-drop/components";
import { DraggableItemProps } from "components/drag-drop/components/Item/Item";
import useQuery from "hooks/useQuery";
import { ApiModels } from "queries/apiModelMapping";
import useGetItem from "queries/useGetItem";
import useListItems from "queries/useListItems";
import useUpdateItem from "queries/useUpdateItem";
import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import ProfileCard from "stories/CompoundComponent/ProfileCard/ProfileCard";
import { v4 } from "uuid";

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

const DataSetFields = styled(Stack)(({ theme }) => {
  return {
    gap: "16px",
    marginBottom: "16px",

    ".MuiFormLabel-root": {
      fontSize: "14px",
      lineHeight: "20px",
      fontWeight: "400",
      color: theme.palette.text.primary,
      margin: "0 0 8px",
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
        fill: "currentColor",
      },
    },
  };
});

const FieldsSelection: React.FC<{
  gui: GfGui;
  onClickBack: () => void;
  indexKey: "included_tabs" | "included_sidebar_widgets";
}> = ({ gui, onClickBack, indexKey = "included_tabs" }) => {
  const { selectedTabId } = useQuery<{ selectedTabId: string }>();
  const isNewTab = selectedTabId === "new-tab";

  const initialValueSet = useRef(false);
  const allowNetworkRequest = useRef(false);
  const { data: datasetDesigns } = useListItems({
    modelName: ApiModels.DatasetDesign,
    queryOptions: { enabled: false },
  });

  const selectedTab = useMemo(() => {
    return gui.dataset_list_settings?.[indexKey]?.find(
      // eslint-disable-next-line eqeqeq
      (t) => t.id == `${selectedTabId}`
    );
  }, [gui.dataset_list_settings, indexKey, selectedTabId]);

  const includedFields = useMemo(
    () => selectedTab?.included_fields || [],
    [selectedTab]
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    reset,
    setValue,
    watch,
  } = useForm<Partial<IncludeTabs>>({
    mode: "onBlur",
    // resolver: zodResolver(formSchema),
    defaultValues: {
      // Provide default values for the form data here
      // For example:
      id: "",
      included_fields: [],
      name: "",
      dataset_to_include: "",
      association_type: "",
      linking_field: "",
      record_type: "list",
    },
  });

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
  const { mutate: updateGui, isLoading } = useUpdateItem({
    modelName: ApiModels.Gui,
  });

  useEffect(() => {
    initialValueSet.current = false;
    allowNetworkRequest.current = false;
  }, [guiSlug]);

  useEffect(() => {
    if (selectedTabId && selectedTab && !initialValueSet.current) {
      reset(selectedTab);
      initialValueSet.current = true;
      setTimeout(() => {
        allowNetworkRequest.current = true;
      }, 3000);
    }
  }, [reset, selectedTab, selectedTabId]);

  const submitHandler = useCallback(
    async (data: Partial<IncludeTabs>) => {
      if (
        guiSlug &&
        selectedTabId &&
        (allowNetworkRequest.current || isNewTab)
      ) {
        let newTabArray = gui?.dataset_list_settings?.[indexKey] || [];
        // if it's new add element otherwise update;
        if (isNewTab) {
          newTabArray = [
            ...newTabArray,
            { ...(data as IncludeTabs), id: v4() },
          ];
        } else {
          newTabArray = newTabArray?.map((t) =>
            t.id === `${selectedTabId}` ? { ...t, ...data } : t
          ) as IncludeTabs[];
        }

        await updateGui(
          {
            slug: guiSlug,
            data: {
              dataset_list_settings: {
                ...gui.dataset_list_settings,
                [indexKey]: newTabArray,
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
    },
    [guiSlug, selectedTabId, isNewTab, gui.dataset_list_settings, updateGui]
  );
  const onCreateNew = async (data: Partial<IncludeTabs>) => {
    await submitHandler(data).then(() => {
      onClickBack();
    });
  };
  useEffect(() => {
    if (!isNewTab) {
      const submitDeb = debounce(() => {
        handleSubmit(submitHandler)();
      }, 600);
      const subscription = watch((_) => {
        submitDeb();
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, submitHandler, handleSubmit]);

  const onSortEndHandler = (
    _: UniqueIdentifier[],
    items: Record<UniqueIdentifier, UniqueIdentifier[]>
  ) => {
    setValue("included_fields", items.included as string[]);
  };

  const includedDatsetDesignSlug = watch("dataset_to_include");
  const associationType = watch("association_type");

  const includedDatsetDesign = useMemo(
    () => datasetDesigns?.find((dd) => dd.slug === includedDatsetDesignSlug),
    [datasetDesigns, includedDatsetDesignSlug]
  );

  const { fieldsMap, items } = useMemo(() => {
    const excludedFields: string[] = [];
    const fieldsMap = new Map<string, DataField>();
    includedDatsetDesign?.fields?.fields?.forEach((field) => {
      fieldsMap.set(field.id, field);
      if (!includedFields.includes(field.id)) {
        excludedFields.push(field.id);
      }
    });

    return {
      items: { included: includedFields, excluded: excludedFields },
      fieldsMap,
    };
  }, [includedDatsetDesign, includedFields]);
  return (
    <React.Fragment>
      <SidebarSectionWrap
        title="Back to Dataset"
        rightIcon={false}
        leftIcon={<ArrowBack />}
        onLeftIconClick={onClickBack}
      >
        <DataSetFields>
          <FormField label="Name" error={errors.name}>
            <TextField
              {...register("name")}
              autoFocus
              type="text"
              fullWidth
              variant="filled"
              size="small"
            />
          </FormField>
          <FormField
            label="Dataset to Include"
            error={errors.dataset_to_include}
          >
            <Controller
              name="dataset_to_include"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="text"
                  fullWidth
                  variant="filled"
                  size="small"
                  select
                >
                  {datasetDesigns?.map((dd) => (
                    <MenuItem value={dd.slug}>{dd.name}</MenuItem>
                  ))}
                </TextField>
              )}
            />
          </FormField>
          <FormField
            label="Foreign key location"
            error={errors.association_type}
          >
            <Controller
              name="association_type"
              control={control}
              render={({ field }) => (
                <TextField
                  type="text"
                  fullWidth
                  variant="filled"
                  size="small"
                  select
                  {...field}
                >
                  {[
                    { label: "Parent Table", value: "reference_table" },
                    // { label: "Junction Table", value: "junction_table" },
                    { label: "This Table", value: "this_table" },
                  ]?.map((dd) => (
                    <MenuItem value={dd.value}>{dd.label}</MenuItem>
                  ))}
                </TextField>
              )}
            />
          </FormField>

          <FormField label="Linking field" error={errors.linking_field}>
            <Controller
              name="linking_field"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value || ""}
                  type="text"
                  fullWidth
                  variant="filled"
                  size="small"
                  select
                >
                  {associationType !== "reference_table"
                    ? includedDatsetDesign?.fields.fields.map((f) => (
                        <MenuItem value={f.slug}>{f.title}</MenuItem>
                      ))
                    : datasetDesign?.fields.fields.map((f) => (
                        <MenuItem value={f.slug}>{f.title}</MenuItem>
                      ))}
                </TextField>
              )}
            />
          </FormField>

          <FormField label="List or Single Record" error={errors.record_type}>
            <Controller
              name="record_type"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="text"
                  fullWidth
                  variant="filled"
                  size="small"
                  select
                >
                  {["single", "list"]?.map((dd) => (
                    <MenuItem value={dd} sx={{ textTransform: "capitalize" }}>
                      {dd}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </FormField>
        </DataSetFields>

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

        {isNewTab && (
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1.5}
            mb={2}
          >
            <LoadingButton
              variant="outlined"
              onClick={onClickBack}
              loading={isLoading}
              disabled={isLoading}
            >
              Cancel
            </LoadingButton>
            <LoadingButton
              variant="contained"
              color="primary"
              type="submit"
              onClick={handleSubmit(onCreateNew)}
              loading={isLoading}
              disabled={isLoading}
            >
              Save
            </LoadingButton>
          </Stack>
        )}
      </SidebarSectionWrap>
    </React.Fragment>
  );
};

export default FieldsSelection;
