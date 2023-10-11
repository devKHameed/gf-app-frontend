import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  ListItem,
  ListItemIcon,
  Drawer as MuiDrawer,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { createSelectorFunctions } from "auto-zustand-selectors-hook";
import { SortableList } from "components/SortableList";
// import { SideNavTopSelector } from "components/layout-components/system-layout/SideNav";
import FormatAlignLeftOutlinedIcon from "@mui/icons-material/FormatAlignLeftOutlined";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSystemLayoutStore } from "store/stores/systemLayout";
import { useStageStore } from "store/stores/transcription/StageDataList";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Scrollbar from "components/Scrollbar";
import WFPlayer from "components/WFPlayer";
import SubTitleWithContext from "./components/SubTitle";
import Timelaps from "./components/TimeLapse";
import TranscriptionControlls from "./components/TranscriptionControlls";
import useSlide from "./hooks/useSlide";
import {
  BoxWrap,
  ContentBox,
  Drawer,
  DrawerOverlay,
  DurationBar,
  ListItemStyle,
  MenuListLink,
  MuiDrawerBody,
  MuiDrawerHeader,
  Progress,
  ScrollbarC,
  WaveWrapper,
} from "./Transcription.styles";

type TranscriptionEditorProps = {};
const useStgStore = createSelectorFunctions(useStageStore);
type ItemType = { id: number | string };
type ScriptsContentType = { name?: string; content?: string };
const CustomListItem = React.memo(
  React.forwardRef<
    HTMLLIElement,
    {
      item: ItemType;
      onClick?: (_: any) => void;
      onContextMenu?: (
        _: React.MouseEvent<HTMLDivElement>,
        extra?: string
      ) => void;
      isActive?: boolean;
    }
  >(({ item, onClick, onContextMenu, isActive, ...rest }, ref) => {
    const handleClick = () => {
      onClick?.(item);
    };
    const onContextMenuHandler = (e: React.MouseEvent<HTMLDivElement>) => {
      onContextMenu?.(e, item?.id as string);
    };
    return (
      <ListItemStyle
        className={`${isActive ? "active_slide" : ""}`}
        onClick={handleClick}
        sx={{ zIndex: 10000000000 }}
        ref={ref}
        {...rest}
        id={item.id + ""}
        key={item.id}
        onContextMenu={onContextMenuHandler}
      >
        <Box className='user-item' ref={ref}>
          <Stack
            direction='row'
            alignItems='center'
            key={`${item.id}`}
            className='user-holder'
            justifyContent='space-between'
          >
            <Stack
              direction='row'
              spacing={1}
              className='user-detail'
              alignItems='center'
            >
              <Avatar
                alt='Remy Sharp'
                src='/static/images/avatar/1.jpg'
                sizes='26px'
              />
              <Typography variant='body2' className='user-name'>
                Michael Jackson
              </Typography>
            </Stack>
            <SortableList.DragHandle>
              <DragIndicatorIcon
                sx={{
                  verticalAlign: "middle",
                  // color: theme.palette.background.GF20,
                  cursor: "grab",
                }}
              />
            </SortableList.DragHandle>
          </Stack>
        </Box>
      </ListItemStyle>
    );
  })
);
const MenuWrap = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  margin: "0 -14px 0 0",

  ".MuiDivider-root ": {
    borderColor: theme.palette.background.GF20,
  },
}));
const ListingNavBar = () => {
  return (
    <MenuWrap>
      <MenuListLink>
        <ListItem>
          <Link to={`transcript`}>Audio Editor</Link>
        </ListItem>
        <ListItem>
          <Link to={`some`}>Some</Link>
        </ListItem>
        <ListItem>
          <Link to={`thing`}>Thing</Link>
        </ListItem>
        <ListItem>
          <Link to={`menu`}>Menu</Link>
        </ListItem>
      </MenuListLink>
    </MenuWrap>
  );
};
const ScriptsContent = (props: ScriptsContentType) => {
  const { name = " Michael Jackson", content } = props;
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar alt={name} src='/static/images/avatar/1.jpg' sizes='26px' />
        }
        title={name}
      />
      <CardContent>
        <Typography paragraph>{content}</Typography>
      </CardContent>
    </Card>
  );
};

const TranscriptionEditor: React.FC<TranscriptionEditorProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [audioUrl, setAudioUrl] = useState("/assets/audio/transcript.mp3");
  const setAppBarProps = useSystemLayoutStore.useSetAppBarProps();
  const { onCreateSlide, onInitializeSlide } = useSlide();
  const store = useStgStore();
  const uploadAudio = (onCallBack: any) => {
    const file = document.createElement("input");
    file.type = "file";
    file.accept = "audio/*";
    file.onchange = (e) => {
      const event = e;
      if (event.target && (event.target as HTMLInputElement).files) {
        Object.values((event.target as HTMLInputElement).files!).forEach(
          (file) => {
            try {
              const url = URL.createObjectURL(file);
              setAudioUrl(url);
              onCreateSlide();
            } catch (error) {}
          }
        );
      }
    };
    file.click();
  };
  useEffect(() => {
    setAppBarProps({
      centeredComponent: <ListingNavBar />,
      DropDown: null,
      title: "",
      color: "primary",
    });
    onInitializeSlide();
  }, []);
  const handleCloseDrawer = () => {
    setIsOpen(false);
  };

  return (
    <Box>
      <Box>
        <WaveWrapper className='wave-wrapper'>
          <Box
            sx={{ backgroundImage: `url("/assets/images/bars.png")` }}
            className='bars'
          />
          <WFPlayer
            config={{
              scrollable: true,
              cursor: true,
              cursorColor: "rgba(54, 179, 54, 0.6)",
              scrollbar: true,
              waveColor: "rgba(13, 143, 203, 1)",
              wave: true,
              backgroundColor: "transparent",
              progress: false,
              grid: false,
              ruler: false,
              rulerAtTop: false,
              useWorker: true,
              padding: 0,
            }}
            url={audioUrl}
          />
          <Box
            sx={{ backgroundImage: `url("/assets/images/bars.png")` }}
            className='bars bottom'
          />
        </WaveWrapper>
        <DurationBar>
          <Progress className='progress-line' />
          <Timelaps />
        </DurationBar>
        <Drawer variant='permanent' open={true}>
          <BoxWrap>
            <ScrollbarC>
              <Box className='presentation-slides'>
                <SortableList
                  items={store?.stageIds}
                  onChange={(updatedItems, dragIndex, dropIndex) => {
                    store.sortItems(updatedItems);
                  }}
                  modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
                  renderItem={(item) => {
                    return (
                      <>
                        <SortableList.Item id={item.id} handle>
                          <CustomListItem item={item} />
                        </SortableList.Item>
                      </>
                    );
                  }}
                />
                <Box className='btn-holder'>
                  <Button variant='contained' onClick={uploadAudio}>
                    Add Voice
                  </Button>
                </Box>
              </Box>
            </ScrollbarC>
          </BoxWrap>
          <DrawerOverlay className='overlay-holder'></DrawerOverlay>
        </Drawer>
      </Box>
      <TranscriptionControlls setIsOpen={setIsOpen} />
      <ContentBox className='transcript_content_box'>
        <Progress className='progress-line' id='content-progress' />
        <MuiDrawer
          container={() => document.querySelector(".transcript_content_box")}
          anchor={"right"}
          open={isOpen}
          onClose={handleCloseDrawer}
          PaperProps={{
            sx: {
              width: "100%",
              maxWidth: "420px",
            },
          }}
        >
          <MuiDrawerHeader>
            <ListItemIcon className='drawer-title'>
              <FormatAlignLeftOutlinedIcon sx={{ width: "16px" }} />
              Script
            </ListItemIcon>
            <ListItemIcon
              onClick={() => setIsOpen(false)}
              className='drawer-close'
            >
              <CloseOutlinedIcon sx={{ width: "16px" }} />
            </ListItemIcon>
          </MuiDrawerHeader>
          <MuiDrawerBody>
            <Scrollbar>
              <Box className='drawer-bodywrap'>
                {[1, 2, 3, 4].map((ele) => {
                  return (
                    <ScriptsContent
                      key={`key=${ele}`}
                      content='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'
                    />
                  );
                })}
              </Box>
            </Scrollbar>
          </MuiDrawerBody>
        </MuiDrawer>
        <SubTitleWithContext />
      </ContentBox>
    </Box>
  );
};

export default TranscriptionEditor;
