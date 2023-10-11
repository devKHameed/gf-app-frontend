import {
  Box,
  ClickAwayListener,
  Drawer,
  DrawerProps,
  Stack,
  Toolbar,
  useTheme,
} from "@mui/material";
import SidebarSection from "components/RightSidebar/SidebarSection";
import Scrollbar from "components/Scrollbar";
import SessionItem from "components/SessionItem/SessionItem";
import groupBy from "lodash/groupBy";
import sortBy from "lodash/sortBy";
import moment from "moment";
import useFusionSessions from "queries/fusion/useFusionSessions";
import React, { useMemo } from "react";
import FlowFieldWrapper from "./FlowFieldWrapper";

type GroupedSessions = {
  [date: string]: FusionSession[];
};

const groupSessionsByDate = (sessions: FusionSession[]): GroupedSessions => {
  const sortedSessions = sortBy(sessions, (session) =>
    moment(session.created_at).valueOf()
  ).reverse();

  return groupBy(sortedSessions, (session) =>
    moment(session.created_at).format("MMM DD - YYYY")
  );
};

type SessionHistoryProps = {
  fusionSessions?: FusionSession[];
  onItemClick(session: FusionSession): void;
};

const SessionHistory: React.FC<SessionHistoryProps> = (props) => {
  const { fusionSessions = [], onItemClick } = props;

  const groupedSessions = useMemo(
    () => groupSessionsByDate(fusionSessions),
    [fusionSessions]
  );
  return (
    <Scrollbar>
      <Box
        sx={{
          p: 2,
          pt: 0,
        }}
      >
        <SidebarSection title="Workflow History" rightIcon={false}>
          {Object.entries(groupedSessions).map(([date, sessions], i) => (
            <FlowFieldWrapper key={date} label={date}>
              <Stack spacing={1}>
                {sessions.map((session, j) => (
                  <Box onClick={() => onItemClick(session)}>
                    <SessionItem
                      key={session.slug}
                      timestamp={session.created_at}
                      title={`Run Test #${sessions.length - j}`}
                      status={session.session_data.session_status}
                      // errorCount={3}
                    />
                  </Box>
                ))}
              </Stack>
            </FlowFieldWrapper>
          ))}
        </SidebarSection>
      </Box>
    </Scrollbar>
  );
};

type Props = {
  fusionSlug?: string;
  onSessionSelect(session: FusionSession): void;
} & DrawerProps;

const SessionHistoryDrawer: React.FC<Props> = (props) => {
  const { fusionSlug, onSessionSelect, ...drawerProps } = props;

  const theme = useTheme();

  const { data: fusionSessions } = useFusionSessions(fusionSlug);

  // const getComponents: Config["getComponents"] = React.useCallback(
  //   (gotoComponent, goBack) => {
  //     return {
  //       "session-history": (
  //         <SessionHistory
  //           fusionSessions={fusionSessions}
  //           onItemClick={(session) => {
  //             gotoComponent({ name: "session-details", id: "session-details" });
  //           }}
  //         />
  //       ),
  //       "session-details": <SessionRunDrawer />,
  //     };
  //   },
  //   [fusionSessions]
  // );

  return (
    <Drawer
      sx={{
        width: 0,
        flexShrink: 0,
        zIndex: theme.zIndex.appBar - 1,

        [`& .MuiDrawer-paper`]: {
          zIndex: theme.zIndex.appBar - 1,
          width: 450,
          boxSizing: "border-box",
          boxShadow: "none",
          background: "none",
          backgroundImage: "none",
          backgroundColor: theme.palette.background.GFRightNavBackground,
          height: "100%",

          ".MuiPaper-root": {
            boxShadow: "none",
            background: "none",
            backgroundImage: "none",
          },
        },
      }}
      anchor="right"
      hideBackdrop
      {...drawerProps}
    >
      <Toolbar />
      <ClickAwayListener
        onClickAway={(e) => {
          drawerProps.onClose?.(e, "backdropClick");
        }}
      >
        <Box height="100%">
          <SessionHistory
            fusionSessions={fusionSessions}
            onItemClick={onSessionSelect}
          />
        </Box>
        {/* <AnimationLayout
          // ref={layoutRef}
          config={{
            getComponents,
            initialComponent: "session-history",
          }}
        /> */}
      </ClickAwayListener>
    </Drawer>
  );
};

export default SessionHistoryDrawer;
