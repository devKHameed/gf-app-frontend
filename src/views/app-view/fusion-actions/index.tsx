import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Stack, styled, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/system";
import { useQueryClient } from "@tanstack/react-query";
import RenameModel from "components/share-components/RenameModel";
import useAppNavigate from "hooks/useAppNavigate";
import AnimationLayout, {
  AnimationLayoutRef,
  Config,
  TransitionComponent,
} from "layouts/AnimationLayout";
import debounce from "lodash/debounce";
import { ApiModels, ThreePAppSubModels } from "queries/apiModelMapping";
import useGetItem from "queries/useGetItem";
import useListItems from "queries/useListItems";
import useUpdateItem from "queries/useUpdateItem";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { useParams, useSearchParams } from "react-router-dom";
import useSystemLayoutStore from "store";
import { getSearchParams } from "utils";
import { z } from "zod";
import AddThreePAppActionModal from "./AddActionModel";
import AddConnectionModel from "./AddConnectionModel";
import AddFusionActionModal from "./AddFusionActionModel";
import AddThreePAppRemoteProcedureModal from "./AddRemoteProcedure";
import AddThreePAppWebhookModal from "./AddWebhookModel";
import EditConnections from "./EditConnections";
import EditModules from "./EditModules";
import EditRemoteProcedure from "./EditRemoteProcedure";
import EditWebhook from "./EditWebhook";
import MainComponent from "./MainComponent";

const ContainerWrap = styled(Box)(({ theme }) => ({
  minHeight: "calc(100vh - 60px)",
  overflowX: "hidden",
  overflowY: "visible",
}));

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

const AddFusionAction = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  useSystemLayoutStore.useSetButtonProps()({
    onClick: () => setAddModalOpen(true),
  });

  return (
    <AddFusionActionModal
      open={addModalOpen}
      onClose={() => setAddModalOpen(false)}
      onSubmit={(data) => {}}
    />
  );
};

const formSchema = z.object({
  app_name: z.string().min(1, "Name is required"),
  app_label: z.string().optional(),
  app_description: z.string().optional(),
  app_color: z.string().optional(),
  app_logo_image: z.any().optional(),
  app_language: z.string().optional(),
  base_structure: z.any().optional(),
});

const getInitialComponent = () => {
  return getSearchParams().get("c_name") || "main";
};

type threePModels =
  | typeof ThreePAppSubModels[keyof typeof ThreePAppSubModels]
  | null;
const ThreePApps = () => {
  const [searchParams] = useSearchParams();
  const { slug: threePAppSlug } = useParams<{ slug: string }>();
  const appNavigate = useAppNavigate();
  const [tab, setTab] = useState(Number(searchParams.get("t")) || 0);
  const goToRightView = useSystemLayoutStore.useGoToRightView();

  const [activeModel, setActiveModel] = useState<threePModels>();
  const queryClient = useQueryClient();
  const [initialComponent, setInitialComponent] = useState<string>("");
  const layoutRef = useRef<AnimationLayoutRef>(null);

  const setMenu = useSystemLayoutStore.useSetMenu();
  const menuItemProps = useSystemLayoutStore.useSetItemProps();
  const historyIsSet = useRef(false);
  const theme = useTheme();
  const xlScreen = useMediaQuery(theme.breakpoints.up("xl"));

  const { data: threePApps, isFetched } = useListItems({
    modelName: ApiModels.ThreePApp,
  });
  const { data: threePApp, isLoading } = useGetItem({
    modelName: ApiModels.ThreePApp,
    slug: threePAppSlug,
  });
  const initialValueSet = useRef(false);
  const allowNetworkRequest = useRef(false);
  const tabLists = useMemo(() => {
    const tabs = [
      {
        label: <TabStyle title="Base" />,
      },
      {
        label: <TabStyle title="Connections" />,
      },
      {
        label: <TabStyle title="Webhooks" />,
      },
      {
        label: <TabStyle title="Modules" />,
      },
      {
        label: <TabStyle title="Remote Procedures" />,
      },
      {
        label: <TabStyle title="Groups" />,
      },
      {
        label: <TabStyle title="Review" />,
      },
      {
        label: <TabStyle title="Readme" />,
      },
      {
        label: <TabStyle title="App Flow" />,
      },
      {
        label: <TabStyle title="General" />,
      },
    ];

    return tabs;
  }, []);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    reset,
    watch,
  } = useForm<Partial<ThreePApp>>({
    mode: "onBlur",
    resolver: zodResolver(formSchema),
    defaultValues: threePApp,
  });

  useEffect(() => {
    if (isFetched && threePApps && threePApps.length > 0) {
      setMenu(
        threePApps.map((fusionActions) => ({
          title: fusionActions.app_name,
          key: fusionActions.slug,
          // icon: fusionActions.app_logo_image?.url,
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threePApps, isFetched]);

  useEffect(() => {
    menuItemProps({
      onClick: (item) => {
        layoutRef.current?.reset();
        goToRightView();
        const data = queryClient.getQueryData<DatasetDesign[]>([
          ApiModels.ThreePApp,
        ]);
        const designItem = data?.find((d) => d.slug === item.key);
        if (designItem) {
          queryClient.setQueryData([ApiModels.ThreePApp, item.key], designItem);

          appNavigate(`/fusion-action-module/${designItem.slug}?t=0`);
        }
      },
      isActive: (item) => item.key === threePAppSlug,
    });
    setInitialComponent(getInitialComponent());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threePAppSlug]);

  const { mutate: updateThreePApp } = useUpdateItem({
    modelName: ApiModels.ThreePApp,
  });

  useEffect(() => {
    initialValueSet.current = false;
  }, [threePAppSlug]);
  useEffect(() => {
    if (threePApp && !initialValueSet.current) {
      reset(threePApp);
      initialValueSet.current = true;
      setTimeout(() => {
        allowNetworkRequest.current = true;
      }, 1000);
    }
  }, [reset, threePApp]);

  const submitHandler = useCallback(
    (data: Partial<ThreePApp>) => {
      if (threePAppSlug && allowNetworkRequest.current) {
        updateThreePApp(
          { slug: threePAppSlug, data },
          {
            onSuccess: () => {
              console.log("inner success");
            },
          }
        );
      }
    },
    [threePAppSlug, updateThreePApp]
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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };
  const handleModelClose = () => {
    setActiveModel(null);
  };
  const handleActiveModelChange = (m: threePModels) => {
    setActiveModel(m);
  };
  useLayoutEffect(() => {
    if (!historyIsSet.current) {
      const c = getSearchParams().get("c_name");
      if (c && threePApp && layoutRef.current) {
        const transitionHistory: TransitionComponent[] = [
          { name: "main", id: "main" },
          { name: c, id: c },
        ];

        layoutRef.current.setTransitionHistory(transitionHistory);

        historyIsSet.current = true;
      }
    }
  }, [threePApp, xlScreen]);
  const getComponentMiddleComponent: Config["getComponents"] =
    React.useCallback(
      (gotoComponent, goBack) => {
        return {
          main: (
            <MainComponent
              threePApp={threePApp}
              tabLists={tabLists}
              handleTabChange={handleChange}
              handleActiveModelChange={handleActiveModelChange}
              activeTab={tab}
              register={register}
              errors={errors}
              control={control}
              onConnectionEdit={(item) => {
                if (item?.slug) {
                  appNavigate(`connection/${item.slug}`);
                  gotoComponent({
                    name: "edit-connections",
                    id: "edit-connections",
                  });
                }
              }}
              onModuleEdit={(item) => {
                if (item?.slug) {
                  appNavigate(`module/${item.slug}`);
                  gotoComponent({
                    name: "edit-module",
                    id: "edit-module",
                  });
                }
              }}
              onWebhookEdit={(item) => {
                if (item?.slug) {
                  appNavigate(`webhook/${item.slug}`);
                  gotoComponent({
                    name: "edit-webhook",
                    id: "edit-webhook",
                  });
                }
              }}
              onRemoteProcedureEdit={(item) => {
                if (item?.slug) {
                  appNavigate(`remote-procedure/${item.slug}`);
                  gotoComponent({
                    name: "edit-remote-procedure",
                    id: "edit-remote-procedure",
                  });
                }
              }}
              onAdd={(model: threePModels) => {
                setActiveModel(model);
              }}
            />
          ),
          "edit-connections": (
            <EditConnections
              onBackClick={() => {
                appNavigate(`/fusion-action-module/${threePAppSlug}?t=1`);
                setTab(1);
                goBack();
              }}
            />
          ),
          "edit-webhook": (
            <EditWebhook
              onBackClick={() => {
                appNavigate(`/fusion-action-module/${threePAppSlug}?t=2`);
                setTab(1);
                goBack();
              }}
            />
          ),
          "edit-module": (
            <EditModules
              onBackClick={() => {
                appNavigate(`/fusion-action-module/${threePAppSlug}?t=3`);
                setTab(1);
                goBack();
              }}
            />
          ),
          "edit-remote-procedure": (
            <EditRemoteProcedure
              onBackClick={() => {
                appNavigate(`/fusion-action-module/${threePAppSlug}?t=4`);
                setTab(1);
                goBack();
              }}
            />
          ),
        };
      },
      [control, errors, appNavigate, register, tab, tabLists, threePAppSlug]
    );
  return (
    <ContainerWrap className="animations-action">
      <React.Fragment>
        {threePApp?.slug && initialComponent && (
          <AnimationLayout
            ref={layoutRef}
            config={{
              getComponents: getComponentMiddleComponent,
              initialComponent,
            }}
          />
        )}
        <AddFusionAction />
        <RenameModel module={ApiModels.ThreePApp} title={"Fusion Actions"} />
        <AddConnectionModel
          open={activeModel === ThreePAppSubModels.ThreePAppConnection}
          onClose={handleModelClose}
        />
        <AddThreePAppWebhookModal
          open={activeModel === ThreePAppSubModels.ThreePAppWebhook}
          onClose={handleModelClose}
        />
        <AddThreePAppActionModal
          open={activeModel === ThreePAppSubModels.ThreePAppAction}
          onClose={handleModelClose}
        />
        <AddThreePAppRemoteProcedureModal
          open={activeModel === ThreePAppSubModels.ThreePAppRemoteProcedure}
          onClose={handleModelClose}
        />
      </React.Fragment>
    </ContainerWrap>
  );
};

export default ThreePApps;
