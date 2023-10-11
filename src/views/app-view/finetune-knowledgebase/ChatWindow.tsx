import AttachFileIcon from "@mui/icons-material/AttachFile";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import TagIcon from "@mui/icons-material/Tag";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import Scrollbar from "components/Scrollbar";
import Spin from "components/Spin";
import FinetuneKnowledgebaseModel from "models/FinetuneKnowledgebase";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import ReactQuill from "react-quill";

import "react-quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import { useFinetuneKnowledgebaseStore } from "store/stores/finetune-knowledgebase";
import { getNameInitial, getUser } from "utils";
import { v4 } from "uuid";

const EditorContainer = styled(Box)(({ theme }) => ({
  height: "75px",
  overflow: "auto",

  ".ql-container": {
    "&.ql-snow": {
      border: "none",
    },

    ".ql-editor": {
      padding: "12px 8px",

      "&.ql-blank::before": {
        color: theme.palette.background.GF60,
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "18px",
        left: "8px",
      },
    },
  },
}));

const MessageContainer = styled(Box)(({ theme }) => ({
  ".ql-container": {
    "&.ql-snow": {
      border: "none",
    },

    ".ql-editor": {
      padding: "0px",

      "&.ql-blank::before": {
        color: theme.palette.background.GF60,
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "18px",
        left: "8px",
      },
    },
  },
}));

type ActionBarProps = {
  onSubmit: () => Promise<void>;
};

const ActionBar: React.FC<ActionBarProps> = (props) => {
  const { onSubmit } = props;

  const theme = useTheme();

  const [submitting, setSubmitting] = useState(false);

  return (
    <Stack direction="row" justifyContent="space-between">
      <Stack direction="row">
        <IconButton>
          <TagIcon sx={{ fontSize: "16px" }} />
        </IconButton>
        <IconButton>
          <SentimentSatisfiedAltIcon sx={{ fontSize: "16px" }} />
        </IconButton>
        <IconButton>
          <AttachFileIcon
            sx={{ fontSize: "16px", transform: "rotate(45deg)" }}
          />
        </IconButton>
      </Stack>
      <Spin
        spinning={submitting}
        iconProps={{
          sx: {
            width: "20px !important",
            height: "20px !important",
            color: "#fff",
          },
        }}
      >
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            setSubmitting(true);
            onSubmit().finally(() => setSubmitting(false));
          }}
          sx={{ background: theme.palette.background.GF10 }}
        >
          Comment
        </Button>
      </Spin>
    </Stack>
  );
};

type ChatInputProps = {
  onMessageSubmit: (message: string) => Promise<void>;
};

const ChatInput: React.FC<ChatInputProps> = (props) => {
  const { onMessageSubmit } = props;

  const theme = useTheme();

  const [value, setValue] = useState("");

  const handleSubmit = async () => {
    setValue("");
    if (value) {
      await onMessageSubmit(value);
    }
  };

  return (
    <Box
      sx={{
        height: "150px",
        background: theme.palette.background.GFCardBG,
        padding: "35px 35px 10px 35px",
      }}
    >
      <EditorContainer>
        <Scrollbar>
          <ReactQuill
            theme="snow"
            value={value}
            onChange={setValue}
            placeholder="Please type here..."
            modules={{
              toolbar: false,
            }}
          />
        </Scrollbar>
      </EditorContainer>
      <ActionBar onSubmit={handleSubmit} />
    </Box>
  );
};

type MessageBoxProps = {
  message: FinetuneKnowledgebaseMessage;
};

const MessageBox: React.FC<MessageBoxProps> = (props) => {
  const { message } = props;

  const theme = useTheme();

  return (
    <Stack
      direction="row"
      sx={{ margin: "35px" }}
      spacing={2}
      alignItems="flex-start"
    >
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant="dot"
        color="success"
      >
        <Avatar
          src={
            message.sent_by === "user"
              ? message.user_data?.image?.url
              : undefined
          }
        >
          {message.sent_by === "bot"
            ? "B"
            : getNameInitial(
                `${message.user_data?.first_name} ${message.user_data?.last_name}`
              )}
        </Avatar>
      </Badge>
      <Card
        sx={{
          background: "#1F1F27",
          width: "100%",
          minHeight: "57px",
          borderRadius: "8px",
        }}
      >
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ height: "25px" }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: "18px",
                color: "#fff",
              }}
            >
              {message.sent_by === "user"
                ? `${message.user_data?.first_name} ${message.user_data?.last_name}`
                : "Bot"}
            </Typography>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "18px",
                color: theme.palette.background.GF80,
              }}
            >
              {moment(message.created_at).format("LLL")}
            </Typography>
          </Stack>
          <MessageContainer>
            <ReactQuill
              theme="snow"
              value={message.data}
              placeholder="Please type here..."
              modules={{
                toolbar: false,
              }}
              readOnly
            />
          </MessageContainer>
        </CardContent>
      </Card>
    </Stack>
  );
};

type ChatMessagesProps = {};

const ChatMessages: React.FC<ChatMessagesProps> = (props) => {
  const messages = useFinetuneKnowledgebaseStore.useMessages();

  return (
    <Box>
      {messages.map((message) => (
        <MessageBox message={message} />
      ))}
    </Box>
  );
};

type ChatWindowProps = {};

const ChatWindow: React.FC<ChatWindowProps> = (props) => {
  const { slug } = useParams<{ slug: string }>();

  const user = getUser();

  const addMessage = useFinetuneKnowledgebaseStore.useAddMessage();
  const updateMessage = useFinetuneKnowledgebaseStore.useUpdateMessage();
  const setMessages = useFinetuneKnowledgebaseStore.useSetMessages();

  const scrollbarRef = React.useRef<Scrollbars>(null);

  useEffect(() => {
    if (slug) {
      FinetuneKnowledgebaseModel.listMessages(slug).then((res) => {
        setMessages(
          res.data.sort((a, b) =>
            moment(a.created_at).isAfter(b.created_at) ? 1 : -1
          )
        );
        setTimeout(() => {
          scrollbarRef.current?.scrollToBottom();
        }, Infinity - 1);
      });
    }
  }, [slug]);

  const handleSubmit = async (value: string) => {
    if (slug) {
      const messageSlug = v4();
      addMessage({
        slug: messageSlug,
        data: value,
        sent_by: "user",
        user_data: {
          slug: user.slug,
          first_name: user.first_name,
          last_name: user.last_name,
          image: user.image,
          email: user.email,
        },
      });
      setTimeout(() => {
        scrollbarRef.current?.scrollToBottom();
      }, Infinity - 1);
      const { data } = await FinetuneKnowledgebaseModel.createMessage(
        slug,
        value
      );
      updateMessage(messageSlug, data.user_message);
      addMessage(data.response);
      setTimeout(() => {
        scrollbarRef.current?.scrollToBottom();
      }, Infinity - 1);
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ flex: 1, background: "#13131B" }}>
        <Scrollbar ref={scrollbarRef}>
          <ChatMessages />
        </Scrollbar>
      </Box>
      <ChatInput onMessageSubmit={handleSubmit} />
    </Box>
  );
};

export default ChatWindow;
