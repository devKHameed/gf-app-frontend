import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  MenuItem,
  Select,
  styled,
  TextField,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import FormField from "components/FormField";
import { FUSION_TYPE_OPTIONS } from "constants/Fusion";
import { FusionType } from "enums/Fusion";
import { ApiModels } from "queries/apiModelMapping";
import useCreateItem from "queries/useCreateItem";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const CheckboxStyled = styled(Checkbox)({
  display: "block",
  width: "fit-content",
});

const formSchema = z
  .object({
    fusion_title: z.string().min(1, "Name is required"),
    fusion_slug: z.string().min(1, "Slug is required"),
    fusion_type: z
      .enum([FusionType.Core, FusionType.Skills])
      .default(FusionType.Core)
      .optional(),
    fusion_description: z.string().optional().default(""),
    skill_description: z.string().optional().default(""),
    is_active: z.boolean().default(false),
  })
  .refine(
    (args) => {
      if (args.fusion_type === FusionType.Skills && !args.skill_description) {
        return false;
      }
      return true;
    },
    { message: "skill description is required", path: ["skill_description"] }
  );

type AddFusionFormType = z.infer<typeof formSchema>;

type Props = {
  type?: "skill_design" | "fusion";
  onClose: () => void;
} & Omit<DialogProps, "onSubmit">;

const AddFusionModal: React.FC<Props> = (props) => {
  const { onClose, type, ...dialogProps } = props;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    reset,
    watch,
  } = useForm<AddFusionFormType>({
    mode: "onBlur",
    resolver: zodResolver(formSchema),
  });

  const fusionType = watch("fusion_type");

  const queryClient = useQueryClient();

  const { mutate: createFusion, isLoading } = useCreateItem({
    modelName: ApiModels.Fusion,
  });

  useEffect(() => {
    if (dialogProps.open) {
      reset({
        fusion_type:
          type === "skill_design" ? FusionType.Skills : FusionType.Core,
      });
    }
  }, [dialogProps.open]);

  const submitHandler = (data: AddFusionFormType) => {
    createFusion(data, {
      onSuccess: () => {
        queryClient.refetchQueries([ApiModels.Folder, ApiModels.Fusion]);
        queryClient.refetchQueries([ApiModels.Fusion, type]);
        onClose();
      },
    });
  };

  return (
    <Dialog disableEscapeKeyDown scroll="body" {...dialogProps}>
      <DialogTitle>Add Dataset Design</DialogTitle>
      <DialogContent>
        <Box component="form">
          <FormField
            label="Fusion Name"
            error={dirtyFields.fusion_title ? errors.fusion_title : undefined}
          >
            <TextField
              {...register("fusion_title")}
              autoFocus
              margin="dense"
              id="fusion_title"
              type="text"
              fullWidth
            />
          </FormField>
          <FormField
            label="Fusion Slug"
            error={dirtyFields.fusion_slug ? errors.fusion_slug : undefined}
          >
            <TextField
              {...register("fusion_slug")}
              margin="dense"
              id="fusion_slug"
              type="text"
              fullWidth
            />
          </FormField>
          <FormField
            label="Fusion Type"
            error={dirtyFields.fusion_type ? errors.fusion_type : undefined}
          >
            <Controller
              control={control}
              name="fusion_type"
              render={({ field }) => (
                <Select {...field} id="fusion_type" type="text" fullWidth>
                  {FUSION_TYPE_OPTIONS.map((option) => (
                    <MenuItem value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormField>
          <FormField
            label="Fusion Description"
            error={
              dirtyFields.fusion_description
                ? errors.fusion_description
                : undefined
            }
          >
            <TextField
              {...register("fusion_description")}
              margin="dense"
              id="fusion_description"
              type="text"
              multiline
              fullWidth
            />
          </FormField>
          {fusionType === FusionType.Skills && (
            <FormField
              label="Skill Description"
              error={
                dirtyFields.fusion_description
                  ? errors.fusion_description
                  : undefined
              }
            >
              <TextField
                {...register("skill_description")}
                margin="dense"
                id="skill_description"
                type="text"
                multiline
                fullWidth
              />
            </FormField>
          )}
          <FormField
            label="Is Active"
            error={dirtyFields.is_active ? errors.is_active : undefined}
          >
            <Controller
              control={control}
              name="is_active"
              render={({ field }) => (
                <CheckboxStyled
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
          </FormField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton
          onClick={handleSubmit(submitHandler)}
          variant="contained"
          loading={isLoading}
          loadingPosition="start"
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddFusionModal;
