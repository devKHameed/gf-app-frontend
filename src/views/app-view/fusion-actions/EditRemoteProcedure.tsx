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
  register: UseFormRegister<Partial<ThreePAppRemoteProcedure>>;
  errors: FieldErrors<Partial<ThreePAppRemoteProcedure>>;
  control: Control<Partial<ThreePAppRemoteProcedure>, any>;
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

const CommunicationsComponet = ({ register, errors, control }: Props) => {
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
              label={"Connection"}
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
    </Box>
  );
};

const formSchema = z.object({
  connection_id: z.string(),
  alt_connection_id: z.string(),
  communication: z.any().optional(),
  app_attach: z.any().optional(),
  app_detach: z.any().optional(),
  app_parameters: z.any().optional(),
});

const tabParamName = "inner_t";
const EditRemoteProcedure = ({
  onBackClick,
}: React.ComponentProps<typeof InnerPageLayout>) => {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(Number(searchParams.get(tabParamName)) || 0);
  const {
    slug: threePAppSlug,
    remoteProcedureSlug: threePAppRemoteProcedureSlug,
  } = useParams<{ slug: string; remoteProcedureSlug: string }>();

  const { data: threePAppRemoteProcedure, isLoading } = useGet3pSubmoduleItem({
    app: threePAppSlug!,
    modelName: ThreePAppSubModels.ThreePAppRemoteProcedure,
    slug: threePAppRemoteProcedureSlug,
  });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    reset,
    watch,
  } = useForm<Partial<ThreePAppRemoteProcedure>>({
    defaultValues: threePAppRemoteProcedure,
    resolver: zodResolver(formSchema),
  });
  const initialValueSet = useRef(false);
  const allowNetworkRequest = useRef(false);
  const { mutate: updateThreePAppRemoteProcedure } = useUpdate3pAppConnection(
    ThreePAppSubModels.ThreePAppRemoteProcedure,
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
    ];

    return tabs;
  }, []);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  useEffect(() => {
    initialValueSet.current = false;
  }, [threePAppRemoteProcedureSlug]);
  useEffect(() => {
    if (threePAppRemoteProcedure && !initialValueSet.current) {
      reset(threePAppRemoteProcedure);
      initialValueSet.current = true;
      setTimeout(() => {
        allowNetworkRequest.current = true;
      }, 1000);
    }
  }, [reset, threePAppRemoteProcedure]);

  const submitHandler = useCallback(
    (data: Partial<ThreePAppRemoteProcedure>) => {
      if (threePAppRemoteProcedureSlug && allowNetworkRequest.current) {
        updateThreePAppRemoteProcedure(
          { slug: threePAppRemoteProcedureSlug, data },
          {
            onSuccess: () => {
              console.log("ThreePAppRemoteProcedure edit success");
            },
          }
        );
      }
    },
    [threePAppRemoteProcedureSlug, updateThreePAppRemoteProcedure]
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
            {threePAppRemoteProcedure?.label || "Title"}
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
          <>
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
          </>
        )}
      </InnerPageLayout>
    </InnerAppLayout>
  );
};

export default EditRemoteProcedure;
