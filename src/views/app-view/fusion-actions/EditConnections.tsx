import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Stack, styled, Typography } from "@mui/material";
import CodeEditorField from "components/CodeEditor/CodeEditorField";
import FormField from "components/FormField";
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
  register: UseFormRegister<Partial<ThreePAppConnection>>;
  errors: FieldErrors<Partial<ThreePAppConnection>>;
  control: Control<Partial<ThreePAppConnection>, any>;
};

const ItemWrapper = styled(Stack)(() => {
  return {
    marginBottom: "30px",

    "&.small-space": {
      marginBottom: "20px",

      ".MuiTypography-h6": {
        marginBottom: "6px",
      },
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

const CommunicationsComponet = ({ register, errors, control }: Props) => {
  return (
    <Box>
      <ItemWrapper gap={2.5}>
        <Box>
          <Typography color="text.secondary">
            Specifies the account validation process. This specification does
            not inherit from base.
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

      <ItemWrapper gap={2.5}>
        <Box>
          <Typography variant="h6">Common data</Typography>
          <Typography variant="body1" color="text.secondary">
            Collection of common data accessible through common.variable
            expression. Contains sensitive information like API keys or API
            secrets. This collection is shared across all modules.
          </Typography>
        </Box>
        <FormField>
          <Controller
            name="common_data"
            control={control}
            render={({ field }) => (
              <CodeEditorField {...field} value={field.value!} mode="json" />
            )}
          />
        </FormField>
      </ItemWrapper>
    </Box>
  );
};

const formSchema = z.object({
  label: z.string().min(1, "Name is required"),
  //app_description: z.string().optional(),
  communication: z.any().optional(),
  common_data: z.any().optional(),
  scope_list: z.any().optional(),
  app_parameters: z.any().optional(),
  default_scope: z.any().optional(),
});
const tabParamName = "inner_t";
const EditConnections = ({
  onBackClick,
}: React.ComponentProps<typeof InnerPageLayout>) => {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(Number(searchParams.get(tabParamName)) || 0);
  const { slug: threePAppSlug, connectionSlug: threePAppConnectionSlug } =
    useParams<{ slug: string; connectionSlug: string }>();

  const { data: threePAppConnection, isLoading } = useGet3pSubmoduleItem({
    app: threePAppSlug!,
    modelName: ThreePAppSubModels.ThreePAppConnection,
    slug: threePAppConnectionSlug,
  });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    reset,
    watch,
  } = useForm<Partial<ThreePAppConnection>>({
    mode: "onBlur",
    resolver: zodResolver(formSchema),
    defaultValues: threePAppConnection,
  });

  const { mutate: updatethreePAppConnection } = useUpdate3pAppConnection(
    ThreePAppSubModels.ThreePAppConnection,
    { app: threePAppSlug! }
  );
  const initialValueSet = useRef(false);
  const allowNetworkRequest = useRef(false);
  const tabLists = useMemo(() => {
    const tabs = [
      {
        label: <TabStyle title="Communications" />,
      },
      {
        label: <TabStyle title="Scope List" />,
      },
      {
        label: <TabStyle title="Default Scope" />,
      },
      {
        label: <TabStyle title="Parameters" />,
      },
    ];

    return tabs;
  }, []);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  useEffect(() => {
    initialValueSet.current = false;
  }, [threePAppConnectionSlug]);
  useEffect(() => {
    if (threePAppConnection && !initialValueSet.current) {
      reset(threePAppConnection);
      initialValueSet.current = true;
      setTimeout(() => {
        allowNetworkRequest.current = true;
      }, 1000);
    }
  }, [reset, threePAppConnection]);

  const submitHandler = useCallback(
    (data: Partial<ThreePAppConnection>) => {
      if (threePAppConnectionSlug && allowNetworkRequest.current) {
        updatethreePAppConnection(
          { slug: threePAppConnectionSlug, data },
          {
            onSuccess: () => {
              console.log("threePAppConnection edit success");
            },
          }
        );
      }
    },
    [threePAppConnectionSlug, updatethreePAppConnection]
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
            {threePAppConnection?.label || "Title"}
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
          />
        )}
        {tab === 1 && (
          <ItemWrapper gap={2.5}>
            <Box>
              <Typography color="text.secondary">
                Collection of available scopes. (key = scope name, value = human
                readable scope description)
              </Typography>
            </Box>
            <FormField>
              <Controller
                name="scope_list"
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
              <Typography color="text.secondary">
                Default scope for every new connection. Array of strings.
              </Typography>
            </Box>
            <FormField>
              <Controller
                name="default_scope"
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
              <Typography color="text.secondary">
                Array of parameters user should fill while creating a new
                connection.
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
                defaultValue={[]}
              />
            </FormField>
          </ItemWrapper>
        )}
      </InnerPageLayout>
    </InnerAppLayout>
  );
};

export default EditConnections;
