import {
  Box,
  Button,
  CardHeader,
  MenuItem,
  PopoverPosition,
  Stack,
  TextField,
  styled,
} from "@mui/material";
import { createSelectorFunctions } from "auto-zustand-selectors-hook";
import useItemContextMenu from "hooks/useItemContextMenu";
import { useState } from "react";

import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import classNames from "classnames";
import { isEqual } from "lodash";
import React, { memo } from "react";
import { useStageStore } from "store/stores/transcription/StageDataList";
import { useTranscriptAudioStore } from "store/stores/transcription/TranscriptData";
import { ContextMenu } from "../Transcription.styles";
import useTranscriptionRef from "../hooks/useTranscriptionRef";

const PopUpWrapper = styled(Stack)(({ theme }) => ({
  padding: "16px",
  gap: "18px",
  width: "228px",
}));
const Timeline = styled(Box)(({ theme }) => ({
  position: "absolute",
  zIndex: "9",
  top: "0",
  right: "0",
  bottom: "0",
  left: "0",
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  padding: "6px 16px",
  borderBottom: `1px solid ${theme.palette.background.GF10}`,
  minHeight: "46px",

  ".react-contextmenu-wrapper": {
    position: "absolute",
    zIndex: "9",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "all",
  },

  ".title-item": {
    fontSize: "13px",
    lineHeight: "21px",
    padding: "6px",
    fontWeight: "500",
    background: theme.palette.background.LeftNavBody,
    color: theme.palette.text.primary,
    borderRadius: "4px",
    cursor: "pointer",
    transition: "all 0.4s ease",
    position: "relative",

    "&:hover, &.active_tag": {
      background: theme.palette.primary.main,
    },

    "&:after": {
      position: "absolute",
      left: "-3px",
      bottom: "-6px",
      content: `""`,
      height: "1px",
      background: theme.palette.background.GF10,
      right: "0",
      display: "none",
    },

    "&:first-child:after": {
      left: "-16px",
    },

    "&:last-first-child:after": {
      right: "-16px",
    },
  },

  ".sub-item": {
    position: "absolute",
    top: "6px",
    left: "0",
    height: "33px",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontSize: "13px",
    lineHeight: "21px",
    userSelect: "none",
    pointerEvents: "all",
    borderRadius: "4px",
    background: theme.palette.background.LeftNavBody,
    color: theme.palette.text.primary,

    "&:hover": {
      background: theme.palette.primary.main,
    },

    "&.sub-highlight": {
      background: theme.palette.primary.main,
    },

    "&.sub-illegal": {
      background: theme.palette.primary.main,
    },

    ".sub-handle": {
      position: "absolute",
      top: "0",
      bottom: "0",
      zIndex: "1",
      height: "100%",
      userSelect: "none",

      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
      },
    },

    ".sub-text": {
      position: "relative",
      zIndex: "0",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      wordBreak: "break-all",
      whiteSpace: "nowrap",
      width: "100%",
      height: "100%",

      p: {
        margin: "2px 0",
        lineHeight: "1",

        "&.bilingual": {
          transform: "scale(0.8)",
        },
      },
    },

    ".sub-duration": {
      opacity: "0.5",
      position: "absolute",
      left: "0",
      right: "0",
      bottom: "0",
      width: "100%",
      textAlign: "center",
      fontSize: "12px",
    },
  },
}));

function getCurrentSubs(
  subs: AlternativeContent[],
  beginTime: number,
  duration: number
) {
  return subs?.filter((item) => {
    return (
      (parseFloat(item.start_time) >= beginTime &&
        parseFloat(item.start_time) <= beginTime + duration) ||
      (parseFloat(item.end_time) >= beginTime &&
        parseFloat(item.end_time) <= beginTime + duration) ||
      (parseFloat(item.start_time) < beginTime &&
        parseFloat(item.start_time) > beginTime + duration)
    );
  });
}

const useAudioStore = createSelectorFunctions(useTranscriptAudioStore);
const useStgStore = createSelectorFunctions(useStageStore);
export const SubTitle = memo(
  (props: {
    render: {
      padding: number;
      duration: number;
      gridGap: number;
      gridNum: number;
      beginTime: number;
    };
    currentTime: number;
    subtitles: AlternativeContent[];
  }) => {
    const { render, currentTime, subtitles } = props;
    const store = useStgStore();
    const [isEdit, setIsEdit] = useState(false);
    const $blockRef = React.useRef<any>();
    const $subsRef = React.useRef<any>();
    const currentSubs = getCurrentSubs(
      subtitles,
      render.beginTime,
      render.duration
    );
    const gridGap = document.body.clientWidth / render.gridNum;
    const currentIndex = currentSubs?.findIndex(
      (item: any) =>
        item.start_time <= currentTime && item.end_time > currentTime
    );

    const {
      itemContextMenu,
      handleItemContextMenuClose,
      handleItemContextMenu,
      ItemContextMenuOpen,
      handleCallBack,
      setItemContextMenu,
    } = useItemContextMenu();
    const onEditTranscriptText = () => {
      setIsEdit(true);
    };
    const onCancelTranscriptText = () => {
      setItemContextMenu(null);
      setIsEdit(false);
    };
    return (
      <Timeline ref={$blockRef} className='time-line'>
        <ContextMenu
          className='contextPopup'
          open={ItemContextMenuOpen}
          onClose={handleItemContextMenuClose}
          anchorReference='anchorPosition'
          anchorPosition={
            ItemContextMenuOpen
              ? ({
                  top: itemContextMenu?.mouseY,
                  left: itemContextMenu?.mouseX,
                } as PopoverPosition)
              : undefined
          }
        >
          <Box className='context-menu-wrap'>
            {isEdit ? (
              <PopUpWrapper>
                <CardHeader avatar={<EditOutlinedIcon />} title={"Edit text"} />
                <TextField
                  size='small'
                  variant='filled'
                  placeholder='Text'
                  value={""}
                  // onChange={(e) => handleChange(e)}
                />
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent='space-between'
                  className='action-btns'
                >
                  <Button
                    onClick={onCancelTranscriptText}
                    variant='contained'
                    className='btn-cancel'
                  >
                    Cancel
                  </Button>
                  <Button onClick={onCancelTranscriptText} variant='contained'>
                    {" "}
                    Save
                  </Button>
                </Stack>
              </PopUpWrapper>
            ) : !ItemContextMenuOpen ? null : (
              <>
                <MenuItem
                  onClick={() =>
                    handleCallBack(() => {
                      onEditTranscriptText();
                    })
                  }
                >
                  <EditOutlinedIcon /> Edit
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    handleCallBack(() => {
                      onCancelTranscriptText();
                    })
                  }
                >
                  <BlockOutlinedIcon /> Remove
                </MenuItem>
              </>
            )}
          </Box>
        </ContextMenu>
        <div ref={$subsRef}>
          {currentSubs?.map((sub, index) => {
            return (
              <Box
                key={sub.id}
                className={classNames(
                  // "title-item",
                  "sub-item",
                  { "sub-highlight": index === currentIndex }
                  // { active_tag: index === currentIndex }

                  // checkSub(sub) ? "sub-illegal" : "",
                )}
                style={{
                  left:
                    render.padding * gridGap +
                    (parseFloat(sub.start_time) - render.beginTime) *
                      gridGap *
                      10,
                  width:
                    (parseFloat(sub.end_time) - parseFloat(sub.start_time)) *
                    gridGap *
                    10,
                }}
              >
                <div
                  className='sub-text'
                  title={sub.content}
                  onContextMenu={(e) => handleItemContextMenu(e, sub?.content!)}
                >
                  <p>{sub?.content}</p>
                </div>
              </Box>
            );
          })}
        </div>
      </Timeline>
    );
  },
  (prevProps, nextProps) => {
    return (
      isEqual(prevProps.subtitles, nextProps.subtitles) &&
      isEqual(prevProps.render, nextProps.render) &&
      prevProps.currentTime === nextProps.currentTime
    );
  }
);

const SubTitleWithContext = () => {
  const waveform = useTranscriptionRef()?.waveSurferRef;
  const [render, setRender] = useState({
    padding: 2,
    duration: 0,
    gridGap: 10,
    gridNum: 110,
    beginTime: -5,
  });
  const store = useAudioStore();
  const transcriptStore = useStgStore();
  waveform?.current?.on("update", (cf: any) => {
    setRender(cf);
  });
  return (
    <Box>
      {transcriptStore?.stageIds?.map((stageId) => {
        const transcript = transcriptStore.stageList[stageId.id];
        return (
          <Box sx={{ height: "46px" }}>
            <SubTitle
              render={render}
              currentTime={store.time!}
              subtitles={transcript.results.items!}
            />
          </Box>
        );
      })}
    </Box>
  );
};
export default SubTitleWithContext;
