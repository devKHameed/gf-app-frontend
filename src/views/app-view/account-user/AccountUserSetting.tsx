import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import TagEditor from "components/Form/TagEditor";
import ProfileUpload from "components/ProfileUploader/ProfileUploader";
import { debounce, uniqueId } from "lodash";
import { ApiModels } from "queries/apiModelMapping";
import useGetItem from "queries/useGetItem";
import useUpdateItem from "queries/useUpdateItem";
import { useCallback, useEffect, useRef } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";

const AccountUserSidebarContainer = styled(Box)(({ theme }) => {
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

const SidebarSectionBlock = styled(Box)(({ theme }) => {
  return {
    marginTop: "20px",
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

const formSchema = z.object({
  image: z.any(),
  tags: z
    .array(
      z.object({ label: z.string(), value: z.string(), color: z.string() })
    )
    .optional(),
});

const AccountUserSetting = ({
  disableScrollbar,
}: {
  disableScrollbar?: boolean;
}) => {
  const { slug: accountUserSlug } = useParams<{ slug: string }>();

  const { data: accountUser } = useGetItem({
    modelName: ApiModels.AccountUser,
    slug: accountUserSlug,
  });
  const form = useForm<Partial<User>>({
    defaultValues: accountUser,
    resolver: zodResolver(formSchema),
  });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    reset,
    watch,
  } = form;
  const initialValueSet = useRef(false);
  const allowNetworkRequest = useRef(false);

  const { mutate: updateAccountUser } = useUpdateItem({
    modelName: ApiModels.AccountUser,
    mutationOptions: {
      mutationKey: [ApiModels.AccountUser],
    },
  });

  useEffect(() => {
    initialValueSet.current = false;
  }, [accountUserSlug]);

  useEffect(() => {
    if (accountUser && !initialValueSet.current) {
      reset(accountUser);
      initialValueSet.current = true;
      setTimeout(() => {
        allowNetworkRequest.current = true;
      }, 1000);
    }
  }, [reset, accountUser]);

  const submitHandler = useCallback(
    (data: Partial<User>) => {
      if (accountUserSlug && allowNetworkRequest.current) {
        updateAccountUser(
          { slug: accountUserSlug, data },
          {
            onSuccess: () => {
              console.log("AccountUser edit success");
            },
          }
        );
      }
    },
    [accountUserSlug, updateAccountUser]
  );

  useEffect(() => {
    const submitDeb = debounce(() => {
      handleSubmit(submitHandler)();
    }, 600);
    const subscription = watch((_) => {
      submitDeb();
    });
    return () => subscription.unsubscribe();
  }, [watch, submitHandler, handleSubmit]);

  return (
    <AccountUserSidebarContainer>
      <FormProvider {...form}>
        <Box sx={{ marginTop: 2.5 }}>
          <Controller
            control={control}
            name="image"
            render={({ field }) => {
              return (
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
              );
            }}
          />
        </Box>
        <SidebarSectionBlock>
          <TagEditor name="tags" />
        </SidebarSectionBlock>
      </FormProvider>
    </AccountUserSidebarContainer>
  );
};

export default AccountUserSetting;
