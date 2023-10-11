import { zodResolver } from "@hookform/resolvers/zod";
import { ContentCopy } from "@mui/icons-material";
import {
  Box,
  Portal,
  Snackbar,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import CodeEditorField from "components/CodeEditor/CodeEditorField";
import FormField from "components/FormField";
import { ModuleType } from "enums/3pApp";
import InnerPageLayout from "layouts/inner-app-layout";
import debounce from "lodash/debounce";
import useGet3pSubmoduleItem from "queries/3p-app-submodules/useGet3pSubmoduleItem";
import useUpdate3pAppConnection from "queries/3p-app-submodules/useUpdate3pSubmodule";
import { ThreePAppSubModels } from "queries/apiModelMapping";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Control,
  Controller,
  FieldErrors,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import { useParams, useSearchParams } from "react-router-dom";
import { z } from "zod";
import ConnectionSelector from "./component/ConnectionSelector";

const TabStyle = ({ title }: { title: string }) => {
  return (
    <Stack direction="row" spacing={1}>
      <Typography className="tab-text" sx={{ color: "#fff" }}>
        {title}
      </Typography>
    </Stack>
  );
};

type Props = {
  register: UseFormRegister<Partial<ThreePAppWebhook>>;
  errors: FieldErrors<Partial<ThreePAppWebhook>>;
  control: Control<Partial<ThreePAppWebhook>, any>;
  actionType?: string;
  shareableUrl?: string;
};

const ItemWrapper = styled(Stack)(() => {
  return {
    marginBottom: "30px",

    "&.small-space": {
      marginBottom: "20px",
    },
  };
});

const InnerAppLayout = styled(Box)(({ theme }) => {
  return {
    ".MuiCardContent-root": {
      marginBottom: "0",
    },

    ".heading-light": {
      fontWeight: "400",
      color: theme.palette.text.secondary,
      marginRight: "4px",
    },

    ".heading-wrap ": {
      marginBottom: "0",
    },

    ".heading-icon ": {
      width: "30px",
      height: "30px",

      svg: {
        width: "100%",
        height: "auto",
        display: "block",
      },
    },

    ".heading-title": {
      fontSize: "24px",
      lineHeight: "32px",
      fontWeight: "600",
    },
  };
});

const LinkWrapper = styled(Box)(({ theme }) => {
  return {
    display: "inline-block",
    verticalAlign: "top",
    color: theme.palette.primary.main,
    cursor: "pointer",

    svg: {
      width: "24px",
      height: "auto",
      marginLeft: "8px",
      display: "inline-block",
      verticalAlign: "middle",
      color: theme.palette.background.GF60,
    },
  };
});

const SnackbarWrap = styled(Snackbar)(({ theme }) => {
  return {
    ".MuiPaper-root ": {
      background: theme.palette.success.main,
      color: theme.palette.text.primary,
    },
  };
});

const CommunicationsComponet = ({
  register,
  errors,
  actionType,
  control,
  shareableUrl,
}: Props) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
    navigator.clipboard.writeText(window.location.toString());
  };
  return (
    <Box>
      <ItemWrapper gap={2.5}>
        <Box>
          <Typography variant="body1" color="text.secondary">
            Specification of incoming data processing. This specification does
            not inherit from base and does not have access to connection.
          </Typography>
        </Box>
        <FormField>
          <Controller
            name="incoming_communication"
            control={control}
            render={({ field }) => (
              <CodeEditorField {...field} value={field.value!} mode="json" />
            )}
          />
        </FormField>
      </ItemWrapper>

      <ItemWrapper gap={2.5} className="small-space">
        <Controller
          name="connection_id"
          control={control}
          render={({ field }) => (
            <ConnectionSelector
              value={field.value}
              onChange={field.onChange}
              label={
                actionType === ModuleType.InstantTrigger
                  ? "Webhook"
                  : "Connection"
              }
              module={
                actionType === ModuleType.InstantTrigger
                  ? ThreePAppSubModels.ThreePAppWebhook
                  : ThreePAppSubModels.ThreePAppConnection
              }
            />
          )}
        />
      </ItemWrapper>

      <ItemWrapper gap={2.5} className="small-space">
        <Controller
          name="alt_connection_id"
          control={control}
          render={({ field }) => (
            <ConnectionSelector
              value={field.value}
              onChange={field.onChange}
              label="Alternative Connection (advanced)"
            />
          )}
        />
      </ItemWrapper>

      <ItemWrapper className="typography">
        <Typography variant="h6">Shared URL Address</Typography>
        <LinkWrapper onClick={handleClick}>
          {shareableUrl} <ContentCopy />
        </LinkWrapper>
        <Portal>
          <SnackbarWrap
            open={open}
            message="Copied to clipboard"
            onClose={() => setOpen(false)}
            autoHideDuration={2000}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          />
        </Portal>
      </ItemWrapper>
    </Box>
  );
};

const formSchema = z.object({
  connection_id: z.string(),
  alt_connection_id: z.string(),
  incoming_communication: z.any().optional(),
  app_attach: z.any().optional(),
  app_detach: z.any().optional(),
  app_parameters: z.any().optional(),
});

const tabParamName = "inner_t";
const EditWebhook = ({
  onBackClick,
}: React.ComponentProps<typeof InnerPageLayout>) => {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(Number(searchParams.get(tabParamName)) || 0);
  const { slug: threePAppSlug, webhookSlug: threePAppWebhookSlug } =
    useParams<{ slug: string; webhookSlug: string }>();

  const { data: threePAppWebhook, isLoading } = useGet3pSubmoduleItem({
    app: threePAppSlug!,
    modelName: ThreePAppSubModels.ThreePAppWebhook,
    slug: threePAppWebhookSlug,
  });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    reset,
    watch,
  } = useForm<Partial<ThreePAppWebhook>>({
    defaultValues: threePAppWebhook,
    resolver: zodResolver(formSchema),
  });
  const initialValueSet = useRef(false);
  const allowNetworkRequest = useRef(false);
  const { mutate: updateThreePAppWebhook } = useUpdate3pAppConnection(
    ThreePAppSubModels.ThreePAppWebhook,
    { app: threePAppSlug! }
  );
  const tabLists = useMemo(() => {
    const tabs = [
      {
        label: <TabStyle title="Communications" />,
      },
      {
        label: <TabStyle title="Parameters" />,
      },
      {
        label: <TabStyle title="Attach" />,
      },
      {
        label: <TabStyle title="Detach" />,
      },
    ];

    return tabs;
  }, []);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  useEffect(() => {
    initialValueSet.current = false;
  }, [threePAppWebhookSlug]);
  useEffect(() => {
    if (threePAppWebhook && !initialValueSet.current) {
      reset(threePAppWebhook);
      initialValueSet.current = true;
      setTimeout(() => {
        allowNetworkRequest.current = true;
      }, 1000);
    }
  }, [reset, threePAppWebhook]);

  const submitHandler = useCallback(
    (data: Partial<ThreePAppWebhook>) => {
      if (threePAppWebhookSlug && allowNetworkRequest.current) {
        updateThreePAppWebhook(
          { slug: threePAppWebhookSlug, data },
          {
            onSuccess: () => {
              console.log("ThreePAppWebhook edit success");
            },
          }
        );
      }
    },
    [threePAppWebhookSlug, updateThreePAppWebhook]
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
    <InnerAppLayout>
      {/* <DevTool control={control} /> */}
      <InnerPageLayout
        title={
          <>
            <span className="heading-light">Module:</span>
            {threePAppWebhook?.label || "Title"}
          </>
        }
        tabList={tabLists}
        onChange={handleChange}
        backIcon
        onBackClick={onBackClick}
        paramName={tabParamName}
        // extra={}
      >
        {tab === 0 && (
          <CommunicationsComponet
            register={register}
            errors={errors}
            control={control}
            actionType={threePAppWebhook?.webhook_type}
            shareableUrl={threePAppWebhook?.shared_url_address}
          />
        )}
        {tab === 1 && (
          <ItemWrapper gap={2.5}>
            <Box>
              <Typography variant="body1" color="text.secondary">
                Array of parameters user should fill while creating a new
                webhook.
              </Typography>
            </Box>
            <FormField>
              <Controller
                name="app_parameters"
                control={control}
                render={({ field }) => (
                  <CodeEditorField
                    {...field}
                    value={field.value!}
                    mode="json"
                  />
                )}
              />
            </FormField>
          </ItemWrapper>
        )}
        {tab === 2 && (
          <ItemWrapper gap={2.5}>
            <Box>
              <Typography variant="body1" color="text.secondary">
                Describes how to register this webhook automatically via API.
                Leave empty if user needs to register webhook manually. This
                specification does inherit from base.
              </Typography>
            </Box>
            <FormField>
              <Controller
                name="app_attach"
                control={control}
                render={({ field }) => (
                  <CodeEditorField
                    {...field}
                    value={field.value!}
                    mode="json"
                  />
                )}
                defaultValue={[]}
              />
            </FormField>
          </ItemWrapper>
        )}
        {tab === 3 && (
          <ItemWrapper gap={2.5}>
            <Box>
              <Typography variant="body1" color="text.secondary">
                Describes how to unregister this webhook automatically via API.
                Leave empty if user needs to unregister webhook manually. This
                specification does inherit from base.
              </Typography>
            </Box>
            <FormField>
              <Controller
                name="app_detach"
                control={control}
                render={({ field }) => (
                  <CodeEditorField
                    {...field}
                    value={field.value!}
                    mode="json"
                  />
                )}
                defaultValue={[]}
              />
            </FormField>
          </ItemWrapper>
        )}
      </InnerPageLayout>
    </InnerAppLayout>
  );
};

export default EditWebhook;
