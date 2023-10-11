import AddCircleIcon from "@mui/icons-material/AddCircle";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  IconButton,
  Input,
  InputAdornment,
  SelectChangeEvent,
  Stack,
  Typography,
  alpha,
  styled,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { grey } from "@mui/material/colors";
import { useMutation, useQuery } from "@tanstack/react-query";
import Autoplay from "assets/icons/Autoplay";
import LeftPanelClose from "assets/icons/LeftPanelClose";
import SendButton from "assets/icons/SendButton";
import S3View from "components/S3View";
import Scrollbar from "components/Scrollbar";
import SubHeader from "components/SubHeader";
import { SocketState } from "enums";
import useSocketWithResponse from "hooks/useSocketWithResponse";
import { produce } from "immer";
import { cloneDeep, isObject } from "lodash";
import moment from "moment";
import { queryClient } from "queries";
import React, {
  ReactNode,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useSocketStore } from "store/stores/socket";
import { GetLabel } from "stories/CompoundComponent/AccountSettings/AccountSetting";
import CodeView from "./CodeView";
import FusionView from "./FusionView";
type Props = {
  onChange?: (e: SelectChangeEvent<unknown>, child: ReactNode) => void;
};
const user = [
  {
    title: "/clip  <date>[today|yesterday]",
    subtitle:
      "Command     Evernote    Save conversations into Evernote for future reference and retrieve...",
  },
  {
    title: "/clip  <date>[today|yesterday]",
    subtitle:
      "Command     Evernote    Save conversations into Evernote for future reference and retrieve...",
  },
  {
    title: "/clip  <date>[today|yesterday]",
    subtitle:
      "Command     Evernote    Save conversations into Evernote for future reference and retrieve...",
  },
  {
    title: "/clip  <date>[today|yesterday]",
    subtitle:
      "Command     Evernote    Save conversations into Evernote for future reference and retrieve...",
  },
  {
    title: "/clip  <date>[today|yesterday]",
    subtitle:
      "Command     Evernote    Save conversations into Evernote for future reference and retrieve...",
  },
  {
    title: "/clip  <date>[today|yesterday]",
    subtitle:
      "Command     Evernote    Save conversations into Evernote for future reference and retrieve...",
  },
  {
    title: "/clip  <date>[today|yesterday]",
    subtitle:
      "Command     Evernote    Save conversations into Evernote for future reference and retrieve...",
  },
  {
    title: "/clip  <date>[today|yesterday]",
    subtitle:
      "Command     Evernote    Save conversations into Evernote for future reference and retrieve...",
  },
  {
    title: "/clip  <date>[today|yesterday]",
    subtitle:
      "Command     Evernote    Save conversations into Evernote for future reference and retrieve...",
  },
];

const TwoCols = styled(Stack)(({ theme }) => ({
  height: "100%",
}));

const ColHolder = styled(Stack)(({ theme }) => ({
  width: "53.2%",
  height: "100%",

  "&.col-white": {
    width: "46.8%",
    background: theme.palette.common.white,
    color: alpha(theme.palette.common.black, 0.2),

    ".sub-header": {
      background: theme.palette.common.white,
      borderBottomColor: "#EDEFEF",
      color: theme.palette.common.black,

      ".field-holder": {
        svg: {
          color: "#D9D9D9",

          path: {
            fillOpacity: "1",
          },
        },
      },
    },
  },

  ".sub-header": {
    padding: "8px 16px",
    minHeight: "50px",

    ".field-holder ": {
      width: "auto",
      background: "none",

      ".icons-holder": {
        gap: "20px",
      },

      svg: {
        color: theme.palette.background.GF80,
        width: "20px",
        cursor: "pointer",
      },
    },
  },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  flexGrow: "1",
  flexBasis: "0",
  minHeight: "0",
}));

const ChatBotArea = styled(Stack)(({ theme }) => ({
  flexGrow: "1",
  flexBasis: "0",
  minHeight: "0",
}));

const ChatContent = styled(Box)(({ theme }) => ({
  flexGrow: "1",
  flexBasis: "0",
  minHeight: "0",
}));

const ChatWrapper = styled(Box)(({ theme }) => ({
  padding: "10px 20px",
}));

const ChatInner = styled(Box)(({ theme }) => ({
  position: "relative",
}));

const ChatInput = styled(Input)(({ theme }) => ({
  width: "100%",
  height: "60px",
  border: "2px solid #EBEDF1",
  borderRadius: "12px",
  padding: "0 20px 0 16px",
  color: "#000",
  display: "flex",
  alignItems: "center",

  "&:before, &:after": {
    display: "none !important",
  },

  ".MuiInputBase-input": {
    padding: "5px 0",
    height: "50px",
    color: "#000",
  },

  ".MuiInputAdornment-positionStart ": {
    height: "auto",
    marginRight: "14px",
    opacity: "1",

    svg: {
      width: "26px",
      height: "auto",
      display: "block",
      cursor: "pointer",
      color: "#D9D9D9",
      transition: "all 0.4s ease",

      "&:hover": {
        color: "#000",
      },
    },
  },

  ".MuiInputAdornment-positionEnd ": {
    gap: "27px",

    svg: {
      width: "21px",
      height: "auto",
      minWidht: "21px",
      cursor: "pointer",
      color: alpha("#000", 0.6),
      transition: "all 0.4s ease",

      "&:hover": {
        color: "#000",
      },
    },
  },
}));

const ChatItem = styled(GetLabel)(({ theme }) => ({
  padding: "21px 20px",
  color: "rgba(0, 0, 0, 0.8)",

  "&:nth-child(odd)": {
    background: "#F3F5F7",
  },

  ".MuiStack-root": {
    gap: "12px",
    alignItems: "flex-start",
  },

  ".icon-holder": {
    width: "30px",
    minWidth: "30px",
    height: "30px",
    borderRadius: "6px",
    background: "#0085FF",
    color: theme.palette.common.white,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    svg: {
      width: "16px",
      height: "auto",
    },
  },

  ".MuiTypography-root ": {
    fontSize: "15px",
    lineHeight: "18px",
    fontWeight: "400",
    color: "rgba(0, 0, 0, 0.8)",
    wordBreak: "break-all",
    whiteSpace: "normal",
  },
}));

const ButtonSelect = styled(IconButton)(({ theme }) => ({
  borderRadius: "3px",
  padding: "5px 10px",
  color: theme.palette.text.primary,
  background: theme.palette.background.GF10,
  display: "inline-flex",
  gap: "10px",
  alignItems: "center",
  fontSize: "12px",
  lineHeight: "15px",
  fontWeight: "500",

  svg: {
    width: "18px",
    height: "auto",
    display: "block",
  },
}));

const SelectMenu = styled(Menu)(({ theme }) => ({
  ".MuiPaper-root": {
    maxWidth: "615px",
    width: "100%",
    background: theme.palette?.other?.snackbar,
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.05)",
    margin: "4px 0 0",
  },

  ".MuiList-root": {
    padding: "0",
  },

  ".MuiButtonBase-root": {
    borderBottom: `1px solid ${theme.palette.background.GF5}`,
    padding: "0",
    transition: "all 0.4s ease",

    "&:hover": {
      background: theme.palette.text.primary,
      color: theme.palette?.other?.snackbar,

      ".extra, .MuiTypography-body2 ": {
        color: theme.palette?.other?.snackbar,
      },

      ".icon-holder": {
        background: theme.palette?.other?.snackbar,
        color: theme.palette.text.primary,
      },
    },
  },

  ".text-holder": {
    flexGrow: "1",
    flexBasis: "0",
    minWidth: "0",
    padding: "0 20px 0 0",
  },

  ".item-wrap": {
    padding: "12px 25px 12px 18px",
    display: "flex",
    gap: "17px",
    alignItems: "center",
    fontSize: "13px",
    lineHeight: "16px",
    fontWeight: "500",
    width: "100%",
  },

  ".icon-holder": {
    background: theme.palette.primary.main,
    width: "30px",
    height: "30px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.4s ease",

    svg: {
      width: "16px",
      height: "auto",
      display: "block",
    },
  },

  ".MuiTypography-body1": {
    fontSize: "14px",
    lineHeight: "17px",
    fontWeight: "500",
  },

  ".MuiTypography-body2": {
    fontSize: "13px",
    lineHeight: "15px",
    fontWeight: "500",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    color: theme.palette.text.secondary,
    transition: "all 0.4s ease",
  },

  ".extra": {
    fontSize: "12px",
    lineHeight: "15px",
    fontWeight: "600",
    color: theme.palette.background.GF80,
    transition: "all 0.4s ease",
  },
}));

const Hint = ({ message }: { message: string }) => {
  return (
    <Box display="flex" alignItems="center">
      <HelpOutlineIcon />
      <Typography marginLeft={1} sx={{ color: grey[800] }}>
        {message}
      </Typography>
    </Box>
  );
};

const ResultList = styled(Box)(({ theme }) => ({
  position: "absolute",
  left: "0",
  right: "0",
  bottom: "100%",
  zIndex: "9",
  background: "#FFFFFF",
  border: "1px solid #D7D7D7",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.05)",
  borderRadius: "12px",
  overflow: "hidden",

  ".result-item": {
    padding: "11px 19px",
    alignItems: "center",
    gap: "11px",

    "&:hover": {
      background: "#112672",
      color: "#fff",

      ".MuiTypography-subtitle1, .MuiTypography-caption": {
        color: "#fff",
      },
    },

    ".icon-holder": {
      width: "30px",
      height: "30px",
      minWidth: "30px",
      borderRadius: "6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      background: "linear-gradient(180deg, #FC954B 0%, #F45DD3 100%)",

      svg: {
        width: "18px",
        height: "auto",
        display: "block",
      },
    },

    ".MuiTypography-subtitle1 ": {
      color: "rgba(0, 0, 0, 0.8)",
      fontSize: "14px",
      lineHeight: "17px",
      fontWeight: "500",
    },

    ".MuiTypography-caption": {
      color: "rgba(0, 0, 0, 0.6)",
      fontSize: "13px",
      lineHeight: "16px",
      fontWeight: "500",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidde",
    },

    ".text-holder": {
      minWidth: "0",
    },
  },
}));

enum SylarEvent {
  INITIALIZE = "initialize",
  MESSAGE = "message",
  GET_SESSIONS = "get_sessions",
  GET_MESSAGES = "get_messages",
  CLOSE_SESSION = "close_session",
  GET_JOB_SESSIONS = "get_job_sessions",
  NEW_JOB_SESSION = "new_job_sessions",
  JOB_SESSION_STATUS_CHANGE = "job_sessions_status_change",
  NO_JOB_SESSION_FOUND = "no_job_session_found",
  MULTIPLE_JOB_CLOSED = "job_session_closed",
  UPDATE_DISPLAY = "update_display",
  ASK_QUESTION_RESPONSE = "ask_question_response",
  CHANGE_SELECTED_DISPLAY = "change_selected_display",
}
const getQuestionString = (question: QuestionData) => {
  const q = isObject(question.question)
    ? JSON.stringify(question.question)
    : question.question;
  if (question.question_type === "open_ended") return `${q}`;
  if (question.question_type === "yes_no") return `${q}(Yes/No)`;
  if (
    question.question_type === "multiple_items_from_list" ||
    question.question_type === "single_item_from_list"
  )
    return `${q}\n\n${question.options
      .map((op, idx) => `${idx + 1}. ${op.value}`)
      .join("\n")}`;
};

const ChatBoart: React.FC<Props> = (props) => {
  const { onChange, ...rest } = props;
  const inputRef = useRef() as RefObject<HTMLInputElement>;
  const systemFeildRef = useRef() as RefObject<HTMLInputElement>;

  // const { send,subscribe } = useSocket();
  const { sendAndWaitForResponsePromise, unsubscribe, subscribe } =
    useSocketWithResponse("sylar");
  const socketState = useSocketStore.useState();
  const [openSession, setOpenSession] = useState<SylarSession>();
  const [selectedSession, setSelectedSession] = useState<SylarSession>();
  const [isAllowToSendMessage, setIsAllowToSendMessage] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string>("general");

  const selectedJobRef = useRef<string>();
  const scrollerRef = useRef<Scrollbars>();
  const [selectedView, setSelectedView] = useState<"chat" | "session">("chat");
  const [viewData, setViewData] = useState<JobSessionDisplayData>();
  const { data: sessions } = useQuery(
    ["chat_session"],
    async () => {
      const res = (await sendAndWaitForResponsePromise({
        action: "sylar",
        metadata: { event: { event_type: SylarEvent.GET_SESSIONS } },
      })) as { sessions: SylarSession[] };
      return res.sessions;
    },
    {
      enabled: socketState === SocketState.Open,
      onSuccess: (sessions) => {
        const openSession = sessions?.find((s) =>
          s.slug?.startsWith("ISOPEN:")
        );
        setSelectedSession(openSession);
        setOpenSession(openSession);
      },
    }
  );
  const { data: jobSessions } = useQuery(
    ["job_sessions"],
    async () => {
      const res = (await sendAndWaitForResponsePromise({
        action: "sylar",
        metadata: { event: { event_type: SylarEvent.GET_JOB_SESSIONS } },
      })) as { jobSessions: JobSession[] };
      return res.jobSessions;
    },
    {
      enabled: socketState === SocketState.Open,
    }
  );

  const { data: messages } = useQuery(
    [selectedSession?.slug, "chat_messagees"],
    async () => {
      const res = (await sendAndWaitForResponsePromise({
        action: "sylar",
        metadata: {
          event: {
            event_type: SylarEvent.GET_MESSAGES,
            chat_session_id: selectedSession?.slug,
          },
        },
      })) as { messages: SylarSessionMessage[] };
      return res.messages;
    },
    {
      enabled: !!selectedSession?.slug,
    }
  );
  const { mutate: openNewSession } = useMutation(
    ["open_session"],
    async () => {
      const res = (await sendAndWaitForResponsePromise({
        action: "sylar",
        metadata: { event: { event_type: SylarEvent.INITIALIZE } },
      })) as { session: SylarSession };
      return res.session;
    },
    {
      onSuccess: (session) => {},
    }
  );

  useEffect(() => {
    selectedJobRef.current = selectedJob;
  }, [selectedJob]);

  useEffect(() => {
    let jobData = jobSessions?.find(
      (jbs) => `${jbs.session_id}` === `${selectedJob}`
    )?.session_data?.session_data as JobSessionDisplayData;

    if (selectedJob === "general") {
      jobData = selectedSession?.meta_data
        ?.session_data as JobSessionDisplayData;
    }

    const data = jobData
      ? {
          ...jobData,
          html: jobData.html ? `${jobData.html}?${Date.now()}` : undefined,
          css: jobData.css ? `${jobData.css}?${Date.now()}` : undefined,
          js: jobData.js ? `${jobData.js}?${Date.now()}` : undefined,
          // id: v4(),
          // code: jobData.code ? `${jobData.code}?${Date.now()}` : undefined,
        }
      : {};

    setViewData(data);
  }, [jobSessions, selectedJob, selectedSession?.meta_data?.session_data]);

  const { mutate: closeSession } = useMutation(
    [SylarEvent.CLOSE_SESSION],
    async () => {
      const res = (await sendAndWaitForResponsePromise({
        action: "sylar",
        metadata: {
          event: {
            event_type: SylarEvent.CLOSE_SESSION,
            chat_session_id: openSession?.slug,
          },
        },
      })) as { session: SylarSession };
      return res.session;
    },
    {
      onSuccess: (session) => {},
    }
  );
  const { mutate: sendMessageToSylar } = useMutation(
    ["chat_message"],
    async ({
      message,
      type,
      ...rest
    }: {
      message: string;
      type: SylarEvent.ASK_QUESTION_RESPONSE | SylarEvent.MESSAGE;
      [key: string]: any;
    }) => {
      const requestId = Date.now();
      queryClient.setQueriesData<any[] | undefined>(
        [openSession?.slug, "chat_messagees"],
        (olderData) => {
          return [
            ...(olderData || []),
            {
              meta_data: { message: message },
              request_id: requestId,
            },
          ] as any[];
        }
      );
      const res = (await sendAndWaitForResponsePromise(
        {
          action: "sylar",
          metadata: {
            event: {
              event_type: type,
              message: message,
              system_message: systemFeildRef.current?.value,
              chat_session_id: openSession?.slug,
              ...rest,
            },
          },
        },
        { requestId }
      )) as { message: SylarSession };
      return res.message;
    }
  );

  const [displayUsers, setDisplayUsers] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElJobDropDown, setAnchorElJobDropDown] =
    useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleInputChange = (event: any) => {
    if (event.target.value.endsWith("/")) {
      setDisplayUsers(true);
    } else {
      setDisplayUsers(false);
    }
  };

  useEffect(() => {
    subscribe("sylar-message", "sylar-message-handler", (res) => {
      if (res.data.isResponseComplete) setIsAllowToSendMessage(true);

      queryClient.setQueriesData<SylarSessionMessage[] | undefined>(
        [openSession?.slug, "chat_messagees"],
        (olderData) => {
          if (olderData?.length) {
            const lastMessage = olderData[olderData?.length - 1];
            //if message exist just update it otherwise add new
            if (
              res.data?.message?.slug &&
              lastMessage.slug === res.data?.message?.slug
            ) {
              olderData[olderData?.length - 1] = res.data?.message;
              return olderData;
            }
            return [...(olderData || []), res.data.message] as any[];
          }
        }
      );
    });
    subscribe("sylar-event", "sylar-event-handler", (res) => {
      const data = res.data;
      if (data.type === SylarEvent.NEW_JOB_SESSION) {
        queryClient.setQueriesData<JobSession[] | undefined>(
          ["job_sessions"],
          (olderData) => {
            if (olderData?.length) {
              return [...(olderData || []), data.jobSession] as JobSession[];
            } else {
              return [data.jobSession];
            }
          }
        );
      }

      if (data.type === SylarEvent.JOB_SESSION_STATUS_CHANGE) {
        queryClient.setQueriesData<JobSession[] | undefined>(
          ["job_sessions"],
          (olderData) => {
            if (olderData?.length) {
              return produce(olderData, (draftState) => {
                const findIndex = draftState.findIndex(
                  (f) =>
                    f.session_id?.toString() ===
                    data.jobSession.session_id?.toString()
                );
                if (findIndex !== -1) {
                  draftState[findIndex].status = data.jobSession.status;
                }
              });
            }
          }
        );
      }

      if (data.type === SylarEvent.CHANGE_SELECTED_DISPLAY) {
        if (data.data.job_slug) {
          setSelectedJob(`${data.data.job_slug}`);
        }
      }

      if (data.type === SylarEvent.UPDATE_DISPLAY) {
        const responseData = data.data as JobSessionDisplayData & {
          job_slug: string;
        };
        console.log(
          "🚀 ~ file: index.tsx:742 ~ subscribe ~ responseData:",
          responseData
        );
        if (responseData.job_slug.toString() === "general") {
          setSelectedSession(
            (prev) =>
              ({
                ...(prev || {}),
                meta_data: {
                  ...(prev?.meta_data || {}),
                  session_data: responseData as any,
                },
              } as any)
          );
        } else {
          queryClient.setQueriesData<JobSession[] | undefined>(
            ["job_sessions"],
            (oData) => {
              const olderData = cloneDeep(oData);
              if (olderData?.length) {
                const findIndex = olderData.findIndex(
                  (f) =>
                    f.session_id?.toString() ===
                    responseData.job_slug?.toString()
                );
                if (findIndex !== -1) {
                  olderData[findIndex].session_data.session_data = {
                    ...(olderData[findIndex]?.session_data?.session_data || {}),
                    ...responseData,
                  };
                  return olderData;
                }
                return olderData;
              }
            }
          );
          if (`${responseData.job_slug}` === `${selectedJobRef.current}`) {
            const data = responseData
              ? {
                  ...responseData,
                  // id: v4(),
                  html: responseData.html
                    ? `${responseData.html}?${Date.now()}`
                    : undefined,
                  css: responseData.css
                    ? `${responseData.css}?${Date.now()}`
                    : undefined,
                  js: responseData.js
                    ? `${responseData.js}?${Date.now()}`
                    : undefined,
                  // code: responseData.code
                  //   ? `${responseData.code}?${Date.now()}`
                  //   : undefined,
                }
              : {};
            setViewData(data);
          }
        }
      }
    });
    subscribe("response", "syc-handler", (res) => {
      const data = res.data;

      if (res.action === "sylar") {
        if (data.type === SylarEvent.CLOSE_SESSION) {
          const session = data.session as SylarSession;
          setSelectedSession(session);
          setOpenSession(undefined);
          queryClient.setQueriesData<SylarSession[] | undefined>(
            ["chat_session"],
            (olderData) => {
              if (Array.isArray(olderData)) {
                return olderData.map((s) => {
                  if (s.slug?.startsWith("ISOPEN:")) {
                    return session;
                  }
                  return s;
                });
              }
              return olderData;
            }
          );
        } else if (data.type === SylarEvent.MESSAGE) {
          setIsAllowToSendMessage(false);
          const message = data.message as SylarSessionMessage;
          queryClient.setQueriesData<
            (SylarSessionMessage & { request_id?: string | number })[]
          >([openSession?.slug, "chat_messagees"], (olderData = []) => {
            const lastMessage = olderData[olderData?.length - 1];
            //if message exist just update it otherwise add new
            if (res.data?.uid && lastMessage.request_id === res.data?.uid) {
              olderData[olderData?.length - 1] = message;
              return olderData;
            }
            return [...(olderData || []), message] as any[];
          });
        } else if (data.type === SylarEvent.INITIALIZE) {
          const session = data.session as SylarSession;
          setSelectedSession(session);
          setOpenSession(session);
          queryClient.setQueriesData<SylarSession[] | undefined>(
            ["chat_session"],
            (olderData) => {
              if (Array.isArray(olderData)) {
                return [...olderData, session];
              }
              return olderData;
            }
          );
        }
      }
    });
    return () => {
      unsubscribe("sylar-message", "sylar-message-handler");
      unsubscribe("response", "sylar");
    };
  }, [openSession?.slug]);

  const handleOpenNewSession = async () => {
    handleClose();
    await openNewSession();
  };
  const handleCloseSession = async () => {
    handleClose();
    await closeSession();
  };
  const handleOnSend = async () => {
    if (!isAllowToSendMessage) return;
    if (inputRef?.current?.value.length) {
      const lastMessage = messages?.[messages.length - 1];
      const isQuestion = lastMessage?.meta_data?.type === "question";

      await sendMessageToSylar({
        message: inputRef.current.value,
        type: isQuestion
          ? SylarEvent.ASK_QUESTION_RESPONSE
          : SylarEvent.MESSAGE,
        sessionData: lastMessage?.meta_data.sessionData,
      });
      setIsAllowToSendMessage(false);
      inputRef.current.value = "";
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages?.length, selectedView]);

  const scrollToBottom = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollToBottom();
    }
  };

  const handleViewSession = () => {
    setSelectedView("session");
    handleClose();
  };
  const isJobDropDownOpen = Boolean(anchorElJobDropDown);
  return (
    <React.Fragment>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {openSession?.slug ? (
          <React.Fragment>
            <MenuItem onClick={handleCloseSession}>Close Session</MenuItem>
          </React.Fragment>
        ) : (
          <MenuItem onClick={handleOpenNewSession}>Open New Session</MenuItem>
        )}
        {selectedView === "chat" && (
          <MenuItem onClick={handleViewSession}>Session History</MenuItem>
        )}
      </Menu>
      <SelectMenu
        id="job_list_menu"
        anchorEl={anchorElJobDropDown}
        open={isJobDropDownOpen}
        onClose={() => setAnchorElJobDropDown(null)}
      >
        <MenuItem
          key={"general"}
          onClick={() => {
            setAnchorElJobDropDown(null);
            setSelectedJob("general");
          }}
        >
          <Box className="item-wrap">
            <Box className="icon-holder">
              <SettingsIcon />
            </Box>
            <Box className="text-holder">
              <Typography variant="body1">{"GENERAL"}</Typography>
              <Typography variant="body2">{"general"}</Typography>
            </Box>
            <Box className="extra" sx={{ textTransform: "uppercase" }}>
              Open
            </Box>
          </Box>
        </MenuItem>
        {jobSessions?.map((jb) => {
          return (
            <MenuItem
              key={jb.session_id}
              onClick={() => {
                setAnchorElJobDropDown(null);
                setSelectedJob(jb.session_id);
              }}
            >
              <Box className="item-wrap">
                <Box className="icon-holder">
                  <SettingsIcon />
                </Box>
                <Box className="text-holder">
                  <Typography variant="body1">{jb.title}</Typography>
                  <Typography variant="body2">{jb.session_id}</Typography>
                </Box>
                <Box className="extra" sx={{ textTransform: "uppercase" }}>
                  {jb.status}
                </Box>
              </Box>
            </MenuItem>
          );
        })}
      </SelectMenu>
      <TwoCols direction={"row"}>
        <ColHolder>
          <SubHeader
            leftExtras={
              <ButtonSelect
                onClick={(event) => setAnchorElJobDropDown(event.currentTarget)}
              >
                <Autoplay />{" "}
                {jobSessions?.find(
                  (s) => `${s.session_id}` === `${selectedJob}`
                )?.session_id || "General"}
              </ButtonSelect>
            }
            title={
              jobSessions?.find((s) => `${s.session_id}` === `${selectedJob}`)
                ?.title || "General"
            }
            icon={<CodeOutlinedIcon />}
            rightSide={
              <Stack className="icons-holder" direction={"row"}>
                <ModeCommentOutlinedIcon />
                <Autoplay />
              </Stack>
            }
          />
          <ContentBox>
            <Scrollbar>
              {viewData?.display_type === "code" ? (
                <CodeView data={viewData} />
              ) : viewData?.display_type === "fusion" ? (
                <FusionView data={viewData} />
              ) : (
                <S3View data={viewData} />
              )}
            </Scrollbar>
          </ContentBox>
        </ColHolder>
        <ColHolder className="col-white">
          <SubHeader
            title="Sylar Welcomes You"
            leftIcon={false}
            rightSide={
              <Stack direction={"row"} className="icons-holder">
                <LeftPanelClose />
                <MoreHorizOutlinedIcon onClick={handleClick} />
              </Stack>
            }
          />
          <ChatBotArea>
            <React.Fragment>
              <ChatContent>
                <Scrollbar ref={scrollerRef}>
                  {selectedView === "chat" ? (
                    <React.Fragment>
                      {messages?.map((message) => {
                        return (
                          <ChatItem
                            className="chat-item"
                            leftIcon={
                              <Box className="icon-holder">
                                <SettingsIcon />
                              </Box>
                            }
                            label={
                              message.meta_data.type === "question"
                                ? getQuestionString(
                                    message.meta_data.question_data
                                  )
                                : `${message?.meta_data?.message}`
                            }
                          />
                        );
                      })}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      {sessions?.map((session) => {
                        return (
                          <Box
                            onClick={() => {
                              setSelectedSession(session);
                              setSelectedView("chat");
                            }}
                          >
                            <ChatItem
                              className="chat-item"
                              leftIcon={
                                <Box className="icon-holder">
                                  <SettingsIcon />
                                </Box>
                              }
                              sx={{
                                "& p": {
                                  color: session.slug?.startsWith("ISOPEN:")
                                    ? "#039200 !important"
                                    : undefined,
                                  fontWeight: "500 !important",
                                },
                              }}
                              label={
                                session.slug?.startsWith("ISOPEN:")
                                  ? "Active Now"
                                  : moment(session.created_at).format(
                                      "MMM DD, YYYY"
                                    )
                              }
                            />
                          </Box>
                        );
                      })}
                    </React.Fragment>
                  )}
                </Scrollbar>
              </ChatContent>
              {selectedView === "chat" &&
                selectedSession?.slug === openSession?.slug && (
                  <ChatWrapper>
                    <ChatInner>
                      {displayUsers && (
                        <ResultList>
                          <Scrollbar autoHeight autoHeightMax={250}>
                            {user.map(({ title, subtitle }) => (
                              <Stack
                                className="result-item"
                                direction={"row"}
                                alignItems="center"
                                spacing={0.75}
                              >
                                <Box className="icon-holder">
                                  <SettingsIcon />
                                </Box>
                                <Stack gap="5px" className="text-holder">
                                  {title && (
                                    <Typography
                                      variant="subtitle1"
                                      component="div"
                                    >
                                      {title}
                                    </Typography>
                                  )}
                                  {subtitle && (
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      fontWeight="400"
                                      component="div"
                                    >
                                      {subtitle}
                                    </Typography>
                                  )}
                                </Stack>
                              </Stack>
                            ))}
                          </Scrollbar>
                        </ResultList>
                      )}
                      {!openSession?.slug && (
                        <Hint message={"Please open a new session"} />
                      )}

                      <ChatInput
                        placeholder="System"
                        inputRef={systemFeildRef}
                        startAdornment={
                          <InputAdornment position="start">
                            <AddCircleIcon />
                          </InputAdornment>
                        }
                      />
                      <ChatInput
                        placeholder="Search"
                        onChange={handleInputChange}
                        inputRef={inputRef}
                        onKeyDown={(e) => {
                          if (e.key === "enter" || e.key === "Enter")
                            handleOnSend();
                        }}
                        startAdornment={
                          <InputAdornment position="start">
                            <AddCircleIcon />
                          </InputAdornment>
                        }
                        endAdornment={
                          <InputAdornment position="end">
                            <SendButton onClick={handleOnSend} />
                            <GraphicEqIcon />
                          </InputAdornment>
                        }
                        disabled={!openSession?.slug}
                      />
                    </ChatInner>
                  </ChatWrapper>
                )}
            </React.Fragment>
          </ChatBotArea>
        </ColHolder>
      </TwoCols>
    </React.Fragment>
  );
};

export default ChatBoart;
