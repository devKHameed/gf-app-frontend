import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TollIcon from "@mui/icons-material/Toll";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  timelineItemClasses,
  TimelineSeparator,
} from "@mui/lab";
import {
  Avatar,
  Box,
  ClickAwayListener,
  Collapse,
  Drawer,
  DrawerProps,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import LabelArrowIcon from "assets/icons/LabelArrowIcon";
import SidebarSection from "components/RightSidebar";
import RunFusion from "components/RunFusion/RunFusion";
import Scrollbar from "components/Scrollbar";
import { SystemModules } from "constants/Fusion";
import { OperatorStatus, SessionStatus } from "enums/Fusion";
import moment from "moment";
import use3pAppModules from "queries/3p-app/use3pAppModules";
import use3pApps from "queries/3p-app/use3pApps";
import React, { useState } from "react";
import { getNameInitial } from "utils";

const ErrorContent: React.FC = (props) => {
  const theme = useTheme();

  const [collapsed, setCollapsed] = useState(true);

  return (
    <Collapse in={!collapsed} collapsedSize={30} sx={{ mt: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={1}
        >
          <InfoOutlinedIcon sx={{ color: theme.palette.red[500] }} />
          <Typography sx={{ color: theme.palette.red[500] }}>
            Errors: Code cancelation
          </Typography>
        </Stack>
        <IconButton sx={{ p: 0 }} onClick={() => setCollapsed((prev) => !prev)}>
          <LabelArrowIcon
            sx={{ fontSize: 16, color: theme.palette.red[500] }}
          />
        </IconButton>
      </Stack>
      <Typography>
        Account verification denied. Must submit new user diagnostics for
        upload.
      </Typography>
    </Collapse>
  );
};

const SessionTimelineItem: React.FC<{
  operator: SessionOperator;
  isLast: boolean;
  operatorOperations: OperatorResponse["operations"];
}> = (props) => {
  const { operator, isLast, operatorOperations = [] } = props;

  const theme = useTheme();

  const { data: apps } = use3pApps();
  const app = apps?.find((app) => {
    return app.slug === operator.app;
  });
  const color = app?.app_color || theme.palette.primary.main;

  const { data: appModules } = use3pAppModules(app?.slug, app?.id);
  const appModule = appModules?.find(
    (appMod) => appMod.slug === operator.app_module
  );

  const systemModule = SystemModules.find(
    (mod) => mod.slug === operator.app_module
  );

  const moduleLabel =
    operator.app === "system" ? systemModule?.label : appModule?.module_name;
  const appLabel = operator.app === "system" ? "System" : app?.app_name;
  const avatar = operator.app === "system" ? undefined : app?.app_color_logo;
  const hasErrors = operatorOperations?.some(
    (operation) => operation.data.status === OperatorStatus.Failed
    // ||
    // operation.data.logs?.some((l) => l.status === "Failed"
    // )
  );

  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          sx={{
            backgroundColor: "#fff",
            // borderColor: "blue",
            m: 0,
          }}
        >
          <Avatar
            src={avatar}
            variant="circular"
            sx={{
              height: 36,
              width: 36,
              backgroundColor: color,
              color: "#fff",
            }}
          >
            {getNameInitial(moduleLabel || "")}
          </Avatar>
        </TimelineDot>
        {!isLast && <TimelineConnector sx={{ background: color }} />}
      </TimelineSeparator>
      <TimelineContent sx={{ py: 0, px: 2, mb: 4 }}>
        <Typography variant="h6" component="span">
          {moduleLabel}
        </Typography>
        <Typography>{appLabel}</Typography>
        {hasErrors && <ErrorContent />}
      </TimelineContent>
    </TimelineItem>
  );
};

type Props = {
  session?: FusionSession;
} & DrawerProps;

const SessionRunDrawer: React.FC<Props> = (props) => {
  const { session, ...drawerProps } = props;

  const theme = useTheme();

  const duration = moment.duration(
    moment(session?.created_at).diff(moment(session?.updated_at))
  );
  const formattedDuration = moment
    .utc(duration.asMilliseconds())
    .format("HH:mm:ss");

  const creditsUsed =
    session?.session_data.session_operators.reduce((credits, operator) => {
      const operations =
        session?.session_data.operator_responses?.[
          operator.operator_slug
        ]?.operations?.filter(
          (op) => op.data.status !== OperatorStatus.Failed
        ) || [];

      return credits + operations.length * (operator.total_credit || 0);
    }, 0) || 0;

  const errorCount =
    session?.session_data.session_operators.reduce((count, operator) => {
      const operations =
        session?.session_data.operator_responses?.[operator.operator_slug]
          ?.operations || [];

      return (
        count +
        operations.reduce((acc, cur) => {
          if (cur.data.status === OperatorStatus.Failed) {
            return acc + 1;
          }
          return acc;
        }, 0)
      );
    }, 0) || 0;

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
        onClickAway={(e) => drawerProps.onClose?.(e, "backdropClick")}
      >
        <Stack spacing={1} height="100%">
          <RunFusion
            actions={false}
            title={
              session?.session_data.session_status === SessionStatus.Building
                ? "Running Test"
                : session?.session_data.session_status
            }
            progress={
              session?.session_data.session_status === SessionStatus.Complete
                ? 100
                : 60
            }
          />
          <Box height="100%">
            <Scrollbar>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      sx={{
                        background:
                          theme.palette.background.GFRightNavForeground,
                      }}
                    >
                      <AccessTimeIcon sx={{ color: "#fff", opacity: 0.6 }} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={2}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.text.secondary,
                            opacity: 0.7,
                          }}
                        >
                          Total run time:
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: theme.palette.text.primary }}
                        >
                          {formattedDuration}
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      sx={{
                        background:
                          theme.palette.background.GFRightNavForeground,
                      }}
                    >
                      <TollIcon sx={{ color: "#fff", opacity: 0.6 }} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={2}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.text.secondary,
                            opacity: 0.7,
                          }}
                        >
                          Fuse credits used:
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: theme.palette.text.primary }}
                        >
                          {`${creditsUsed}`.padStart(2, "0")}
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      sx={{
                        background:
                          theme.palette.background.GFRightNavForeground,
                      }}
                    >
                      <CalendarTodayIcon sx={{ color: "#fff", opacity: 0.6 }} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={2}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.text.secondary,
                            opacity: 0.7,
                          }}
                        >
                          Last updated:
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: theme.palette.text.primary }}
                        >
                          {moment(session?.updated_at).format("ll")}
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      sx={{
                        background: theme.palette.red[500],
                      }}
                    >
                      <InfoOutlinedIcon sx={{ color: "#fff" }} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={2}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.text.secondary,
                            opacity: 0.7,
                          }}
                        >
                          Errors:
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: theme.palette.text.primary }}
                        >
                          {`${errorCount}`.padStart(2, "0")}
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItem>
              </List>
              <Box sx={{ px: 2 }}>
                <SidebarSection title="Todays activity" rightIcon={false}>
                  <Timeline
                    sx={{
                      [`& .${timelineItemClasses.root}:before`]: {
                        flex: 0,
                        padding: 0,
                      },
                    }}
                  >
                    {session?.session_data?.session_operators?.map(
                      (op, i, arr) => (
                        <SessionTimelineItem
                          operator={op}
                          isLast={i === arr.length - 1}
                          operatorOperations={
                            session?.session_data?.operator_responses?.[
                              op.operator_slug
                            ]?.operations || []
                          }
                        />
                      )
                    )}
                  </Timeline>
                </SidebarSection>
              </Box>
            </Scrollbar>
          </Box>
        </Stack>
      </ClickAwayListener>
    </Drawer>
  );
};

export default SessionRunDrawer;
