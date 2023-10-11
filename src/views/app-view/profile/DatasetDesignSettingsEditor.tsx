import { zodResolver } from "@hookform/resolvers/zod";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
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
import ColorPicker from "components/ColorPicker";
import FormField from "components/FormField";
import IconPickerField from "components/IconPicker";
import SidebarSection from "components/RightSidebar/SidebarSection";
import { NativeMaterialIconNames } from "constants/index";
import useUpdateItem from "queries/useUpdateItem";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

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

const SidebarWrap = styled(Box)(({ theme }) => {
  return {
    padding: "0 20px 20px 20px",

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

const datasetDesignEditFormSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});

type DatasetDesignEditFormType = z.infer<typeof datasetDesignEditFormSchema>;

const DatasetDesignSettingsEditor: React.FC<{
  onBackClick?(): void;
  datasetDesign?: DatasetDesign;
}> = (props) => {
  const { onBackClick, datasetDesign } = props;

  const theme = useTheme();

  const isMutating = useIsMutating({
    mutationKey: ["dataset-design"],
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, dirtyFields },
  } = useForm<DatasetDesignEditFormType>({
    mode: "onBlur",
    resolver: zodResolver(datasetDesignEditFormSchema),
  });

  const { mutate: updateDatasetDesign } = useUpdateItem({
    modelName: "dataset-design",
    mutationOptions: {
      mutationKey: ["dataset-design"],
    },
  });

  useEffect(() => {
    if (datasetDesign) {
      setValue("name", datasetDesign.name);
      setValue("icon", datasetDesign.icon);
      setValue("color", datasetDesign.color);
      setValue("description", datasetDesign.description);
    }
  }, [datasetDesign]);

  const submitHandler = (data: DatasetDesignEditFormType) => {
    if (datasetDesign) {
      updateDatasetDesign(
        { slug: datasetDesign.slug, data },
        {
          onSuccess: () => {
            onBackClick?.();
          },
        }
      );
    }
  };

  return (
    <SidebarWrap>
      <SidebarSection
        title="Dataset Settings"
        leftIcon={<ArrowBackOutlined />}
        onLeftIconClick={() => onBackClick?.()}
        rightIcon={false}
      >
        <AddNewFieldContainer spacing={2.5}>
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
              fullWidth
              hiddenLabel
              size="small"
              variant="filled"
            />
          </FormField>
          <FormField
            label="Description"
            error={!!dirtyFields.description ? errors.description : undefined}
          >
            <TextField
              {...register("description")}
              hiddenLabel
              margin="dense"
              id="description"
              type="text"
              variant="filled"
              fullWidth
              multiline
              rows={4}
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
            label="Color"
            error={!!dirtyFields.color ? errors.color : undefined}
          >
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <ColorPicker {...field} arrow color={field.value}>
                  <TextField
                    fullWidth
                    variant="filled"
                    size="small"
                    hiddenLabel
                  />
                </ColorPicker>
              )}
            />
          </FormField>
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
              onClick={handleSubmit(submitHandler)}
              disabled={!!isMutating}
            >
              Save
              {!!isMutating ? (
                <CircularProgress size={24} sx={{ color: "inherit", ml: 1 }} />
              ) : null}
            </Button>
          </CardActions>
        </AddNewFieldContainer>
      </SidebarSection>
    </SidebarWrap>
  );
};

export default DatasetDesignSettingsEditor;
