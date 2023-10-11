import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Divider, Stack, styled, Switch, Typography } from "@mui/material";
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
  register: UseFormRegister<Partial<ThreePAppAction>>;
  errors: FieldErrors<Partial<ThreePAppAction>>;
  control: Control<Partial<ThreePAppAction>, any>;
  actionType?: string;
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

const OptionsWrap = styled(Box)(({ theme }) => {
  return {
    ".MuiSwitch-root": {
      width: "32px",
      height: "18px",
      padding: "0",

      ".MuiSwitch-track": {
        display: "none",
      },
    },

    ".MuiButtonBase-root ": {
      width: "100%",
      height: "100%",
      padding: "0",
      background: theme.palette.background.GF20,
      borderRadius: "9px",
      transition: "all 0.4s ease",
      transform: "none !important",

      "&.Mui-checked": {
        background: theme.palette.background.GF40,

        "&:before": {
          left: "16px",
          background: theme.palette.text.primary,
        },
      },

      "&:before": {
        position: "absolute",
        left: "2px",
        top: "2px",
        width: "14px",
        height: "14px",
        background: theme.palette.background.GF40,
        borderRadius: "100%",
        content: `""`,
        transition: "all 0.4s ease",
      },

      ".MuiSwitch-thumb": {
        display: "none",
      },

      ".mui-track": {
        display: "none",
      },

      ".MuiTouchRipple-root": {
        display: "none",
      },
    },

    ".MuiDivider-root ": {
      margin: "18px 0",
    },
  };
});

const CommunicationsComponet = ({
  register,
  errors,
  actionType,
  control,
}: Props) => {
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
            name="communication"
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
      <ItemWrapper className="small-space">
        <Typography variant="h6" sx={{ mb: "6px" }}>
          Options
        </Typography>
        <OptionsWrap>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box flex="auto">
              <Typography variant="body1" color="text.secondary">
                Available on invite-only basis
              </Typography>
            </Box>
            <Box>
              <Controller
                name="allow_for_invite"
                control={control}
                render={({ field }) => (
                  <Switch {...field} checked={field.value} />
                )}
              />
            </Box>
          </Stack>
          <Divider />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box flex="auto">
              <Typography variant="body1" color="text.secondary">
                Available for everyone
              </Typography>
            </Box>
            <Box>
              <Controller
                name="availability"
                control={control}
                render={({ field }) => (
                  <Switch {...field} checked={field.value} />
                )}
              />
            </Box>
          </Stack>
        </OptionsWrap>
      </ItemWrapper>
    </Box>
  );
};

const formSchema = z.object({
  connection_id: z.string(),
  alt_connection_id: z.string(),
  allow_for_invite: z.boolean(),
  availability: z.boolean(),
  communication: z.any().optional(),
  interface: z.any().optional(),
  mappable_parameters: z.any().optional(),
  samples: z.any().optional(),
  static_parameters: z.any().optional(),
});

const tabParamName = "inner_t";
const EditModules = ({
  onBackClick,
}: React.ComponentProps<typeof InnerPageLayout>) => {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(Number(searchParams.get(tabParamName)) || 0);
  const { slug: threePAppSlug, moduleSlug: threePAppActionSlug } =
    useParams<{ slug: string; moduleSlug: string }>();

  const { data: threePAppAction, isLoading } = useGet3pSubmoduleItem({
    app: threePAppSlug!,
    modelName: ThreePAppSubModels.ThreePAppAction,
    slug: threePAppActionSlug,
  });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    reset,
    watch,
  } = useForm<Partial<ThreePAppAction>>({
    defaultValues: threePAppAction,
    resolver: zodResolver(formSchema),
  });
  const initialValueSet = useRef(false);
  const allowNetworkRequest = useRef(false);
  const { mutate: updateThreePAppAction } = useUpdate3pAppConnection(
    ThreePAppSubModels.ThreePAppAction,
    { app: threePAppSlug! }
  );
  const tabLists = useMemo(() => {
    const tabs = [
      {
        label: <TabStyle title="Communications" />,
      },
      {
        label: <TabStyle title="Static Parameters" />,
      },
      {
        label: <TabStyle title="Interface" />,
      },
      {
        label: <TabStyle title="Samples" />,
      },
      {
        label: <TabStyle title="Mappable Parameters" />,
      },
      {
        label: <TabStyle title="Required Scopes" />,
      },
    ];

    return tabs;
  }, []);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  useEffect(() => {
    initialValueSet.current = false;
  }, [threePAppActionSlug]);
  useEffect(() => {
    if (threePAppAction && !initialValueSet.current) {
      reset(threePAppAction);
      initialValueSet.current = true;
      setTimeout(() => {
        allowNetworkRequest.current = true;
      }, 1000);
    }
  }, [reset, threePAppAction]);

  const submitHandler = useCallback(
    (data: Partial<ThreePAppAction>) => {
      if (threePAppActionSlug && allowNetworkRequest.current) {
        updateThreePAppAction(
          { slug: threePAppActionSlug, data },
          {
            onSuccess: () => {
              console.log("ThreePAppAction edit success");
            },
          }
        );
      }
    },
    [threePAppActionSlug, updateThreePAppAction]
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
            {threePAppAction?.label || "Title"}
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
            actionType={threePAppAction?.module_type}
          />
        )}
        {tab === 1 && (
          <ItemWrapper gap={2.5}>
            <Box>
              <Typography variant="body1" color="text.secondary">
                {`Array of static parameters user can fill while configuring the module. Static parameters can't contain variables from other modules. Parameters are accessible via {{parameters.paramName}}`}
              </Typography>
            </Box>
            <FormField>
              <Controller
                name="static_parameters"
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
                Array of output variables. Same syntax as used for parameters.
              </Typography>
            </Box>
            <FormField>
              <Controller
                name="interface"
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
                Collection of sample values. (key = variable name, value =
                sample value)
              </Typography>
            </Box>
            <FormField>
              <Controller
                name="samples"
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
        {tab === 4 && (
          <ItemWrapper gap={2.5}>
            <Box>
              <Typography variant="body1" color="text.secondary">
                {`Array of mappable parameters user can fill while configuring the module. Mappable parameters can contain variables from other modules. Parameters are accessible via {{parameters.paramName}}`}
              </Typography>
            </Box>

            <FormField>
              <Controller
                name="mappable_parameters"
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
        {tab === 5 && (
          <ItemWrapper gap={2.5}>
            <Box>
              <Typography variant="body1" color="text.secondary">
                Scope required by this module. Array of strings.
              </Typography>
            </Box>

            <FormField>
              <Controller
                name="required_scope"
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

export default EditModules;
