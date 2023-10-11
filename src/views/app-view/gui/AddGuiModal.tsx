import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import FormField from "components/FormField";
import IconPickerField from "components/IconPicker";
import Scrollbar from "components/Scrollbar";
import { GUI_TYPE, GUI_TYPE_OPTIONS } from "constants/gui";
import { NativeMaterialIconNames } from "constants/index";
import { queryClient } from "queries";
import { ApiModels } from "queries/apiModelMapping";
import useCreateItem from "queries/useCreateItem";
import useListItems from "queries/useListItems";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const icons = NativeMaterialIconNames.map((icon, idx) => ({
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

const formSchema = z
  .object({
    name: z.string().min(1, { message: "title is required" }),
    parent_app_id: z.string().optional(),
    gui_type: z.string().min(1, { message: "type is required" }),
    description: z.string().optional(),
    icon: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.gui_type === GUI_TYPE.DATASET_LIST && !values.parent_app_id) {
      ctx.addIssue({
        message: "dataset design is required",
        code: z.ZodIssueCode.custom,
        path: ["parent_app_id"],
      });
    }
  });

type AddGuiFormType = z.infer<typeof formSchema>;

type Props = {
  onSubmit: (data: AddGuiFormType) => void;
  onClose: () => void;
} & Omit<DialogProps, "onSubmit">;

const AddGuiModal: React.FC<Props> = (props) => {
  const { onClose, onSubmit, ...dialogProps } = props;
  const form = useForm<AddGuiFormType>({
    // mode: "onBlur",
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    reset,
    watch,
  } = form;
  const { mutate: createGui, isLoading } = useCreateItem({
    modelName: ApiModels.Gui,
    mutationOptions: {
      mutationKey: [ApiModels.Gui],
    },
  });
  const { data: datasetDesigns } = useListItems({
    modelName: ApiModels.DatasetDesign,
  });

  const submitHandler = (data: AddGuiFormType) => {
    createGui(data, {
      onSuccess: () => {
        console.log("inner success");
        queryClient.refetchQueries([[ApiModels.Folder, ApiModels.Gui]]);
        onClose();
        reset();
      },
    });
  };
  const guiType = watch("gui_type");
  const handleClose = () => {
    onClose?.();
    reset();
  };
  return (
    <Dialog
      onClose={handleClose}
      disableEscapeKeyDown
      scroll="body"
      {...dialogProps}
    >
      <DialogTitle>Add Gui</DialogTitle>

      <Scrollbar className="form-scroller">
        <DialogContent>
          <Box component="form">
            <FormField label="Workspace Title" error={errors.name}>
              <TextField
                {...register("name")}
                autoFocus
                margin="dense"
                id="name"
                type="text"
                fullWidth
              />
            </FormField>
            <FormField label="Workspace type" error={errors.gui_type}>
              <TextField
                {...register("gui_type")}
                margin="dense"
                id="name"
                type="text"
                fullWidth
                select
              >
                {GUI_TYPE_OPTIONS.map((opt) => (
                  <MenuItem value={opt.value}>{opt.label}</MenuItem>
                ))}
              </TextField>
            </FormField>
            {guiType === GUI_TYPE.DATASET_LIST && (
              <FormField label="Dataset Design" error={errors.parent_app_id}>
                <TextField
                  {...register("parent_app_id")}
                  margin="dense"
                  id="name"
                  type="text"
                  fullWidth
                  select
                >
                  {datasetDesigns?.map((opt) => (
                    <MenuItem value={opt.slug}>{opt.name}</MenuItem>
                  ))}
                </TextField>
              </FormField>
            )}
            <FormField
              label="Icon"
              error={dirtyFields.icon ? errors.icon : undefined}
            >
              <Controller
                name="icon"
                control={control}
                render={({ field }) => (
                  <IconPickerField {...field} icons={icons} />
                )}
              />
            </FormField>
            <FormField
              label="Workspace Description"
              error={dirtyFields.description ? errors.description : undefined}
            >
              <TextField
                {...register("description")}
                margin="dense"
                id="name"
                type="text"
                fullWidth
                multiline
                rows={4}
              />
            </FormField>
          </Box>
        </DialogContent>
      </Scrollbar>

      <DialogActions>
        <LoadingButton onClick={handleClose}>Cancel</LoadingButton>
        <LoadingButton
          onClick={handleSubmit(submitHandler)}
          variant="contained"
          loading={isLoading}
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddGuiModal;
