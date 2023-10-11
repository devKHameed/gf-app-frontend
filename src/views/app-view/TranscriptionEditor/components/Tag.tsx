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
import { useEffect, useState } from "react";
import { useTranscriptAudioStore } from "store/stores/transcription/TranscriptData";

import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { useStageStore } from "store/stores/transcription/StageDataList";
import { v4 } from "uuid";
import { BoxWidth, ContextMenu } from "../Transcription.styles";
type ITags = {};
const useAudioStore = createSelectorFunctions(useTranscriptAudioStore);
const PopUpWrapper = styled(Stack)(({ theme }) => ({
  padding: "16px",
  gap: "18px",
  width: "228px",
}));

type ITag = {
  onContextMenu: (
    event: React.MouseEvent<Element, MouseEvent>,
    extra: string
  ) => void;
  title: string;
};
const ClassChecker = ({
  handleActive,
  isActive,
  id,
}: {
  handleActive: (istagActive: boolean) => void;
  isActive: boolean;
  id: string;
}) => {
  // const store = useAudioStore();
  // const waveSurferRef = useTranscriptionRef()?.waveSurferRef;

  // const totalTime = waveSurferRef.current?.getDuration() || 0;
  // const storeTime = store.time || 0;
  // let currentTimeInpercent = (storeTime / totalTime) * 100;
  // const isNumber = isNaN(Number(currentTimeInpercent));

  // if (isNumber) {
  //   currentTimeInpercent = 0;
  // }
  useEffect(() => {
    const progressElement = document.getElementById("content-progress");
    const tagElement = document.getElementById(id);
    if (progressElement && tagElement) {
      const progressRect = progressElement.getBoundingClientRect();

      const tagbounding = tagElement.getBoundingClientRect();
      const isOn =
        tagbounding.left <= progressRect.left &&
        tagbounding.right >= progressRect.right;

      if (isOn) {
        if (!isActive) {
          handleActive(true);
        }
        return;
      }
      if (!isOn && isActive) {
        handleActive(false);
      }
    }
  }, []);
  return null;
};
const Tag = ({ onContextMenu, title }: ITag) => {
  const [isActive, setIsActive] = useState(false);
  const [id, setId] = useState(v4());

  const handleActive = (isTagActive: boolean) => {
    if (isActive !== isTagActive) {
      setIsActive(isTagActive);
    }
  };

  return (
    <>
      <ClassChecker handleActive={handleActive} isActive={isActive} id={id} />
      <Box
        id={id}
        className={`title-item ${isActive ? "active_tag" : ""}`}
        onContextMenu={(e) => onContextMenu(e, title)}
      >
        {title}
      </Box>
    </>
  );
};
const useStgStore = createSelectorFunctions(useStageStore);
const Tags = (props: ITags) => {
  const store = useStgStore();
  const [isEdit, setIsEdit] = useState(false);

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
    <>
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
      <Stack direction={"row"} spacing={0.375}>
        <BoxWidth></BoxWidth>
        {store?.stageIds?.map((slideId: any) => {
          const transcriptIds = [
            ...(store?.transcriptContent?.[slideId?.id]?.contentIds || []),
          ];
          const transcriptContent = {
            ...(store?.transcriptContent?.[slideId?.id]?.contentList || {}),
          };
          return transcriptIds?.map((contentId) => {
            return transcriptContent?.[contentId?.id]?.alternatives?.map(
              (tag: Alternative) => {
                return (
                  <Tag
                    key={`${tag?.content}`}
                    title={tag?.content}
                    onContextMenu={handleItemContextMenu}
                  />
                );
              }
            );
          });
        })}
      </Stack>
    </>
  );
};

export default Tags;
