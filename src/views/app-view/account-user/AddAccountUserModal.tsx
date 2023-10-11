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
import ProfileUpload from "components/ProfileUploader/ProfileUploader";
import Scrollbar from "components/Scrollbar";
import { PhoneNumberRegex } from "constants/index";
import { queryClient } from "queries";
import { ApiModels } from "queries/apiModelMapping";
import useCreateItem from "queries/useCreateItem";
import React from "react";
import { Controller, useForm } from "react-hook-form";

import { isArray, uniqueId } from "lodash";
import useListItems from "queries/useListItems";
import { z } from "zod";

const formSchema = z.object({
  first_name: z.string().min(1, "first name is required"),
  last_name: z.string().min(1, "last name is required"),
  account_user_type: z.string().min(1, "user type name is required"),
  email: z
    .string()
    .min(1, "email name is required")
    .email("Please enter valid email"),
  password: z
    .string()
    .min(1, "password name is required")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must container a number,letter and special character."
    ),
  phone: z
    .string()
    .min(1, "phone name is required")
    .regex(PhoneNumberRegex, "Please enter a valid phone number"),
  image: z.any(),
});

type AddAccountUserFormType = z.infer<typeof formSchema>;

type Props = {
  onSubmit: (data: AddAccountUserFormType) => void;
  onClose: () => void;
} & Omit<DialogProps, "onSubmit">;

const AddAccountUserModal: React.FC<Props> = (props) => {
  const { onClose, onSubmit, ...dialogProps } = props;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    reset,
  } = useForm<AddAccountUserFormType>({
    mode: "onBlur",
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const { mutate: createAccountUser, isLoading } = useCreateItem({
    modelName: ApiModels.AccountUser,
    mutationOptions: {
      mutationKey: [ApiModels.AccountUser],
      onSuccess: (data) => {
        const user = (data as unknown as { user: User }).user;
        queryClient.setQueriesData(
          [ApiModels.AccountUser],
          (oldData: User[] = []) => {
            if (isArray(oldData)) {
              return [...oldData, user];
            }
            // If data is paginated add to first page

            return oldData;
          }
        );
      },
    },
  });
  const { data: userTypes } = useListItems({
    modelName: ApiModels.UserType,
  });

  const submitHandler = (data: AddAccountUserFormType) => {
    createAccountUser(data, {
      onSuccess: () => {
        console.log("inner success");
        queryClient.refetchQueries([[ApiModels.Folder, ApiModels.AccountUser]]);
        onClose();
        reset();
      },
    });
  };

  return (
    <Dialog
      onClose={(e, r) => {
        console.log(e, r);
      }}
      disableEscapeKeyDown
      scroll="body"
      {...dialogProps}
    >
      <DialogTitle>Add Datacard Design</DialogTitle>
      <Scrollbar className="form-scroller">
        <DialogContent>
          <Box component="form">
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <ProfileUpload
                  image={field.value?.url}
                  onChange={(url, file) => {
                    field.onChange({
                      uid: uniqueId(),
                      url: url,
                      name: file?.name,
                      size: file?.size,
                      type: file?.type,
                    });
                  }}
                />
              )}
            />
            <FormField
              label="First Name"
              error={dirtyFields.first_name ? errors.first_name : undefined}
            >
              <TextField
                {...register("first_name")}
                autoFocus
                margin="dense"
                id="name"
                type="text"
                fullWidth
              />
            </FormField>
            <FormField
              label="Last Name"
              error={dirtyFields.last_name ? errors.last_name : undefined}
            >
              <TextField
                {...register("last_name")}
                margin="dense"
                type="text"
                fullWidth
              />
            </FormField>
            <FormField
              label="User Type"
              error={
                dirtyFields.account_user_type
                  ? errors.account_user_type
                  : undefined
              }
            >
              <TextField
                {...register("account_user_type")}
                autoFocus
                margin="dense"
                id="name"
                type="text"
                fullWidth
                select
              >
                {userTypes?.map((ut) => (
                  <MenuItem value={ut.slug}>{ut.name}</MenuItem>
                ))}
              </TextField>
            </FormField>
            <FormField
              label="Email"
              error={dirtyFields.email ? errors.email : undefined}
            >
              <TextField
                {...register("email")}
                margin="dense"
                type="text"
                fullWidth
              />
            </FormField>
            <FormField
              label="Phone"
              error={dirtyFields.phone ? errors.phone : undefined}
            >
              <TextField
                {...register("phone")}
                margin="dense"
                type="text"
                fullWidth
              />
            </FormField>
            <FormField
              label="Password"
              error={dirtyFields.password ? errors.password : undefined}
            >
              <TextField
                {...register("password")}
                margin="dense"
                type="text"
                fullWidth
              />
            </FormField>
          </Box>
        </DialogContent>
      </Scrollbar>
      <DialogActions>
        <LoadingButton onClick={onClose}>Cancel</LoadingButton>
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

export default AddAccountUserModal;
