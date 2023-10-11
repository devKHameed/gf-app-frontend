import {
  Box,
  debounce,
  Stack,
  styled,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import InnerPageLayout from "layouts/inner-app-layout";

import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import GenericIcon from "components/util-components/Icon";
import { PhoneNumberRegex } from "constants/index";
import { ApiModels } from "queries/apiModelMapping";
import useGetItem from "queries/useGetItem";
import useUpdateItem from "queries/useUpdateItem";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams, useSearchParams } from "react-router-dom";
import { z } from "zod";
import NotesList from "../universal-note/UniversalNotesList";
import AccountUserHistory from "./AccountUserHistory";
import AccountUserSetting from "./AccountUserSetting";
import BasicComponent from "./BasicComponent";

const InnerAppLayout = styled(Box)(({ theme }) => {
  return {
    ".heading-card": {
      padding: "0",
    },
  };
});

const TabStyle = ({ title }: { title: string }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" spacing={1}>
      <Typography className="tab-text" sx={{ color: "#fff" }}>
        {title}
      </Typography>
      <Typography
        sx={{ color: theme.palette.background.GF40 }}
        className="counter"
      >
        4
      </Typography>
    </Stack>
  );
};

const formSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  account_user_type: z.string(),
  email: z.string().email("Please enter valid email"),
  phone: z
    .string()
    .regex(PhoneNumberRegex, "Please enter a valid phone number"),
  image: z.any().optional(),
  mailing_address: z
    .object({
      address1: z.string().optional(),
      address2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zip: z.string().optional(),
    })
    .optional(),
});
export type FormType = z.infer<typeof formSchema>;
type props = { onNoteEdit: (_: UniversalNote) => void };
const MiddleComponent = ({ onNoteEdit }: props) => {
  const [searchParams] = useSearchParams();
  const { slug: accountUserSlug } = useParams<{ slug: string }>();
  const [value, setValue] = useState(Number(searchParams.get("t")) || 0);
  const theme = useTheme();
  const xlScreen = useMediaQuery(theme.breakpoints.up("xl"));

  const { data: accountUser } = useGetItem({
    modelName: ApiModels.AccountUser,
    slug: accountUserSlug,
  });
  const { mutate: updateAccountUser } = useUpdateItem({
    modelName: ApiModels.AccountUser,
    mutationOptions: {
      mutationKey: [ApiModels.AccountUser],
    },
  });

  const form = useForm<Partial<FormType>>({
    mode: "onBlur",
    resolver: zodResolver(formSchema),
    defaultValues: accountUser,
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

  const tabLists = useMemo(() => {
    const tabs = [
      {
        label: <TabStyle title="Records" />,
      },
      {
        label: <TabStyle title="History" />,
      },
      {
        label: <TabStyle title="Notes" />,
      },
    ];
    if (!xlScreen)
      tabs.push({
        label: <TabStyle title="Setting" />,
      });
    return tabs;
  }, [xlScreen]);

  useEffect(() => {
    if (xlScreen) {
      setValue((prev) => {
        //Change this right bar index or last index
        if (prev === 3) return 0;
        return prev;
      });
    }
  }, [xlScreen]);

  const submitHandler = useCallback(
    (data: Partial<User & { account_user_type: string }>) => {
      delete data.account_user_type;
      if (accountUserSlug && allowNetworkRequest.current) {
        updateAccountUser(
          { slug: accountUserSlug, data },
          {
            onSuccess: () => {
              console.log("inner success");
            },
          }
        );
      }
    },
    [accountUserSlug, updateAccountUser]
  );
  useEffect(() => {
    initialValueSet.current = false;
  }, [accountUserSlug]);
  useEffect(() => {
    if (accountUser && !initialValueSet.current) {
      reset({
        ...accountUser,
        account_user_type: accountUser?.subscription?.account_user_type,
      });
      initialValueSet.current = true;
      setTimeout(() => {
        allowNetworkRequest.current = true;
      }, 1000);
    }
  }, [reset, accountUser]);

  useEffect(() => {
    const submitDeb = debounce(() => {
      handleSubmit(submitHandler)();
    }, 600);
    const subscription = watch((_, { name }) => {
      switch (name) {
        case "account_user_type":
          submitDeb();
          break;
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, submitHandler, handleSubmit]);

  const handleChange = (_: any, tab: number) => {
    setValue(tab);
  };

  if (!accountUser) return null;
  return (
    <InnerAppLayout>
      <InnerPageLayout
        icon={
          (accountUser?.image?.url && (
            <GenericIcon
              sx={{
                width: "40px",
                height: "40px",
                color: "text.secondary",
              }}
              iconName={accountUser?.image.url as any}
              key={accountUser?.image.url}
            />
          )) as any
        }
        title={`${accountUser?.first_name} ${accountUser?.last_name}`}
        onChange={handleChange}
        subtitle={
          <Typography variant="body1" color="text.secondary">
            Title:{" "}
            <Typography
              component="span"
              variant="subtitle1"
              color="text.primary"
            >
              Gui Fusion CEO
            </Typography>
          </Typography>
        }
        tabList={tabLists}
        value={value}
      >
        {value === 0 && (
          <FormProvider {...form}>
            <form onSubmit={handleSubmit(submitHandler)}>
              <BasicComponent
                register={register}
                errors={errors}
                control={control}
              />
            </form>
          </FormProvider>
        )}
        {value === 1 && <AccountUserHistory />}
        {value === 2 && accountUserSlug && (
          <NotesList noteType={accountUserSlug!} onEdit={onNoteEdit} />
        )}
        {value === 3 && !xlScreen && (
          <Box>
            <AccountUserSetting disableScrollbar={true} />
          </Box>
        )}
      </InnerPageLayout>
      <DevTool control={control} />
    </InnerAppLayout>
  );
};

export default MiddleComponent;
