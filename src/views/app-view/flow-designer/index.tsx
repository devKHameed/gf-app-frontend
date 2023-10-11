import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined";
import { Box, Button, Stack } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import IOSSwitch from "components/IOSSwitch";
import { SocketState } from "enums";
import { FusionType, SessionStatus } from "enums/Fusion";
import useAccountSlug from "hooks/useAccountSlug";
import useSocket from "hooks/useSocket";
import { throttle } from "lodash";
import use3pApps from "queries/3p-app/use3pApps";
import { ApiModels } from "queries/apiModelMapping";
import useAuthenticate from "queries/auth/useAuthenticate";
import useFusion from "queries/fusion/useFusion";
import useGFMLFunctionGroups from "queries/fusion/useGFMLFunctionGroups";
import useRunFusionSession from "queries/fusion/useRunFusionSession";
import useUpdateItem from "queries/useUpdateItem";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";
import { useFusionFlowStore } from "store/stores/fusion-flow";
import { useSocketStore } from "store/stores/socket";
import { useSystemLayoutStore } from "store/stores/systemLayout";
import FusionFlowDesigner, {
  FlowDesignerRef,
} from "./components/FusionFlowDesigner";
import LayoutSwitcher from "./components/LayoutSwitcher";
import SessionHistoryDrawer from "./components/SessionHistoryDrawer";
import SessionRunDrawer from "./components/SessionRunDrawer";

type Props = {};

const FlowDesigner: React.FC<Props> = (props) => {
  const { fusionSlug } = useParams<{ fusionSlug: string }>();

  const { initialize, subscribe, unsubscribe } = useSocket();

  const navigate = useNavigate();
  const selectedAccount = useAccountSlug();
  const setAppBarProps = useSystemLayoutStore.useSetAppBarProps();
  const socketState = useSocketStore.useState();
  const fusionDraft = useFusionFlowStore.useFusionDraft();
  const updateLayout = useFusionFlowStore.useUpdateLayout();
  const setFusionDraft = useFusionFlowStore.useSetFusionDraft();
  const { data } = useAuthenticate();

  const [selectedSession, setSelectedSession] = useState<FusionSession>();
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [isSessionRunDrawerOpen, setIsSessionRunDrawerOpen] = useState(false);

  const { mutate: runFusionTest } = useRunFusionSession();
  const { mutate: updateFusion } = useUpdateItem({
    modelName: ApiModels.Fusion,
  });
  const queryClient = useQueryClient();

  const flowDesignerRef = useRef<FlowDesignerRef>();

  useFusion(fusionSlug);
  use3pApps();
  useGFMLFunctionGroups();

  const userSlug = data?.user?.slug;

  useEffect(() => {
    if (fusionDraft?.fusion_type) {
      setAppBarProps({
        onLeftIconClick: () => {
          navigate(
            `/${selectedAccount}/${
              fusionDraft?.fusion_type === FusionType.Skills
                ? "skill-design-module"
                : "fusion"
            }`
          );
        },
      });
    }
  }, [fusionDraft?.fusion_type, selectedAccount]);

  useEffect(() => {
    if (userSlug && socketState === SocketState.Open) {
      initialize({
        eventType: "init",
        metadata: userSlug,
      });
    }
  }, [userSlug, socketState, initialize]);

  useEffect(() => {
    const func = throttle((data) => {
      const session: FusionSession = data.data;
      if (session && session.fusion_slug === fusionSlug) {
        const queryKey = ["fusion-sessions", fusionSlug];
        const sessions = queryClient.getQueryData<FusionSession[]>(queryKey);
        const sessionAlreadyComplete =
          sessions?.find((s) => s.slug === session.slug)?.session_data
            .session_status === SessionStatus.Complete;
        if (!sessionAlreadyComplete) {
          setSelectedSession(session);
          queryClient.setQueryData<FusionSession[]>(queryKey, () => {
            if (!sessions) {
              return [session];
            } else {
              return [...sessions, session];
            }
          });
        }
      }
    }, 100);
    subscribe("fusion_test", "session", func);

    return () => {
      unsubscribe("fusion_test", "session");
    };
  }, [fusionSlug, isSessionRunDrawerOpen, queryClient, subscribe, unsubscribe]);

  const onRunTestClick = () => {
    if (userSlug && fusionDraft) {
      runFusionTest({ fusion: fusionDraft, userSlug });
      setIsSessionRunDrawerOpen(true);
    }
  };

  const handleActiveChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    if (fusionSlug) {
      updateFusion({
        slug: fusionSlug,
        data: {
          is_active: checked,
        },
      });
      setFusionDraft({ ...fusionDraft, is_active: checked });
    }
  };

  const onSaveFusionClick = () => {
    flowDesignerRef.current?.saveFusion();
  };

  return (
    <Box sx={{ height: "calc(100vh - 60px)" }}>
      <Box sx={{ p: 2, position: "absolute", width: "100%", zIndex: 2 }}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              endIcon={<PlayCircleFilledWhiteOutlinedIcon />}
              onClick={onRunTestClick}
            >
              RUN TEST
            </Button>
            <Button
              size="small"
              variant="outlined"
              endIcon={<PlayCircleFilledWhiteOutlinedIcon />}
              onClick={onSaveFusionClick}
            >
              Save Fusion
            </Button>
            <LayoutSwitcher onChange={(l) => updateLayout(l)} />
          </Stack>
          <Stack direction="row" spacing={1}>
            {fusionDraft?.slug && (
              <Button
                variant="outlined"
                size="small"
                endIcon={
                  <IOSSwitch
                    onChange={handleActiveChange}
                    size="small"
                    color="primary"
                    defaultChecked={!!fusionDraft?.is_active}
                  />
                }
              >
                ACTIVE
              </Button>
            )}
            <Button
              variant="outlined"
              size="small"
              endIcon={<RestoreOutlinedIcon />}
              onClick={() => setIsHistoryDrawerOpen(true)}
            >
              HISTORY
            </Button>
          </Stack>
        </Stack>
      </Box>
      <ReactFlowProvider>
        <FusionFlowDesigner ref={flowDesignerRef} />
        {/* <FusionFlowDesignerKonva /> */}
      </ReactFlowProvider>
      <SessionHistoryDrawer
        open={isHistoryDrawerOpen}
        onClose={() => {
          if (!isSessionRunDrawerOpen) {
            setIsHistoryDrawerOpen(false);
          }
        }}
        fusionSlug={fusionSlug}
        onSessionSelect={(session) => {
          setSelectedSession(session);
          setIsSessionRunDrawerOpen(true);
        }}
      />
      <SessionRunDrawer
        open={isSessionRunDrawerOpen}
        onClose={() => {
          setIsSessionRunDrawerOpen(false);
          setSelectedSession(undefined);
        }}
        session={selectedSession}
      />
    </Box>
  );
};

export default FlowDesigner;
