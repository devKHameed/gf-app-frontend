import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Menu, MenuItem, Select } from "@mui/material";
import { createSelectorFunctions } from "auto-zustand-selectors-hook";
import { SortableList } from "components/SortableList";
// import { SideNavTopSelector } from "components/layout-components/system-layout/SideNav";
import Icon from "components/util-components/Icon";
import usePresentation from "hooks/usePresentation";
import { ApiModels } from "queries/apiModelMapping";
import useCreateItem from "queries/useCreateItem";
import React, { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useParams } from "react-router-dom";
import { useStageStore } from "store/stores/presentation/StageDataList";
import { useModalOpenStore } from "store/stores/presentation/modal";
import { useSystemLayoutStore } from "store/stores/systemLayout";
import AutomaticSave from "./AutomaticSave";
import {
  BoxWrap,
  ContentBox,
  ContentHolder,
  ContentPreview,
  DividerWrap,
  Drawer,
  DrawerHeader,
  DrawerOverlay,
  ListItemStyle,
  ScrollbarC,
} from "./Presentation.styles";
import MenuListing from "./PresentationNavBar";
import useSlide from "./hook/useSlide";
import useWorkHistory from "./hook/useWorkHistory";
import HyperLinkModal from "./model/hyperLinkModel";
import PresentationView from "./views";

type PresentationProps = {};
const useStgStore = createSelectorFunctions(useStageStore);

const SideNavTopSelector: React.FC = () => {
  const selectedValue = useSystemLayoutStore.useSideNavSelectorValue();
  const setValue = useSystemLayoutStore.useSetSideNavSelectorValue();
  const options = useSystemLayoutStore.useSideNavSelectorOptions();

  return (
    <DrawerHeader>
      <Select
        onChange={(e) => {
          setValue(options.find((op) => op.key === e.target.value));
        }}
        value={selectedValue.key}
        size='small'
        className='header-select'
        IconComponent={ExpandMoreIcon}
        sx={{
          width: "100%",
          ".MuiSelect-select": {
            minHeight: "48px !important",
            padding: "6px 12px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
          },
          ".MuiOutlinedInput-notchedOutline": {
            border: "none !important",
          },
        }}
      >
        {options.map((item) => (
          <MenuItem key={item.key} value={item.key} sx={{ gap: "6px" }}>
            {item.icon && (
              <Icon
                className='header-select-icon'
                key={item.icon}
                iconName={item.icon as any}
                color={"primary"}
              />
            )}{" "}
            <Box className='header-id'>{item.id}</Box>
          </MenuItem>
        ))}
      </Select>
    </DrawerHeader>
  );
};
type ItemType = { id: number | string };

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
    const stageStore = useStgStore();
    const transformer = usePresentation().transformer;
    const { activeSlide, slidePreview } = useSlide(transformer);
    const { recordPast } = useWorkHistory();
    const url = stageStore?.stageList?.[item.id]?.thumbnail || "";
    // useEffect(() => {
    //   const isExist = stageStore.stageList?.[activeSlide]?.data || [];
    //   // if (isExist) {
    //   // slidePreview(activeSlide);
    //   recordPast(isExist);
    //   // }
    // }, [activeSlide]);
    useEffect(() => {
      const isExist = stageStore.stageList?.[activeSlide]?.slide_design;
      if (!!isExist && !!activeSlide) {
        slidePreview(activeSlide);
        recordPast(isExist);
      }
    }, [stageStore.stageList?.[activeSlide]?.slide_design]);
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
        <SortableList.DragHandle>
          <DragIndicatorIcon
            sx={{
              verticalAlign: "middle",
              // color: theme.palette.background.GF20,
              cursor: "grab",
            }}
          />
        </SortableList.DragHandle>
        {/* <Handle {...handleProps} {...listeners} /> */}
        <Box className='slide-item' ref={ref}>
          <Box key={`${item.id}`} className='slide-holder'>
            <img
              src={`${url}`}
              // srcSet={`${item.url}`}
              // src={`${item.url}?w=164&h=164&fit=crop&auto=format`}
              // srcSet={`${item.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              alt={`${item.id}`}
              loading='lazy'
            />
          </Box>
        </Box>
      </ListItemStyle>
    );
  })
);
const useStore = createSelectorFunctions(useModalOpenStore);

const Presentation: React.FC<PresentationProps> = (props) => {
  const { slug } = useParams();
  const [itemContextMenu, setItemContextMenu] =
    React.useState<{
      mouseX: number;
      mouseY: number;
      item: string;
    } | null>(null);
  const { transformer } = usePresentation();
  const stageStore = useStgStore();
  const store = useStore();
  const { onCreateSlide, activeSlide, onDeleteSlide, onClickSlide } =
    useSlide(transformer);
  const { mutate: sortSlides } = useCreateItem({
    modelName: ApiModels.PresentationSlideSort,
    mutationOptions: {
      mutationKey: [ApiModels.PresentationSlideSort],
    },
    requestOptions: {
      query: {
        presentation_id: slug,
      },
    },
  });
  const showSideNavTopSelector =
    useSystemLayoutStore.useShowSideNavTopSelector();
  useHotkeys(
    "ctrl+Enter",
    (e) => {
      e.preventDefault();
      onCreateSlide(undefined, undefined as any);
    },
    {},
    [activeSlide, stageStore.stageList?.[activeSlide]]
  );
  const handleItemContextMenuClose = () => {
    setItemContextMenu(null);
  };
  const handleItemContextMenu = React.useCallback(
    (event: React.MouseEvent, extra: string) => {
      event.preventDefault();
      event.stopPropagation();
      setItemContextMenu(
        itemContextMenu === null
          ? {
              mouseX: event.clientX + 2,
              mouseY: event.clientY - 6,
              item: extra,
            }
          : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
            // Other native context menus might behave different.
            // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
            null
      );
    },
    [itemContextMenu]
  );
  const ItemContextMenuOpen = itemContextMenu !== null;
  const handleCreateNewSlide = () => {
    onCreateSlide(undefined, undefined as any);
    setItemContextMenu(null);
  };
  const handleDeleteSlide = () => {
    onDeleteSlide(itemContextMenu!.item);
    setItemContextMenu(null);
  };
  return (
    <Box>
      <Box>
        <Menu
          open={ItemContextMenuOpen}
          onClose={handleItemContextMenuClose}
          anchorReference='anchorPosition'
          anchorPosition={
            ItemContextMenuOpen
              ? { top: itemContextMenu.mouseY, left: itemContextMenu.mouseX }
              : undefined
          }
        >
          <MenuItem onClick={handleCreateNewSlide}>Add New</MenuItem>
          <MenuItem onClick={handleDeleteSlide}>Delete</MenuItem>
        </Menu>
        <Drawer
          variant='permanent'
          open={true}
          // PaperProps={{ className: classNames({ 'is-dragging': isDragging }) }}
        >
          <BoxWrap>
            {showSideNavTopSelector && (
              <>
                <SideNavTopSelector />
                <DividerWrap />
              </>
            )}
            <ScrollbarC>
              <Box className='presentation-slides'>
                <SortableList
                  items={stageStore?.stageIds}
                  onChange={(updatedItems, dragIndex, dropIndex) => {
                    stageStore.sortItems(updatedItems);
                    const numbers = [dragIndex as number, dropIndex as number];
                    const minIdex = Math.min(...numbers);
                    const maxIdex = Math.max(...numbers);
                    const sliceitems = updatedItems.slice(minIdex, maxIdex + 1);
                    const stageItem = { ...(stageStore.stageList || {}) };
                    const stageId = [...(stageStore.stageIds || [])];
                    let indexId = stageId[minIdex]?.id || "";
                    let incri = stageItem[indexId]?.sort_number || 0;
                    const res: any = sliceitems.map((ele, i) => {
                      const activeSlide = stageItem[ele?.id];
                      if (!!activeSlide?.id) {
                        stageItem[ele?.id] = {
                          ...activeSlide,
                          sort_number: incri + i,
                        };
                      }

                      return {
                        slug: ele.id,
                        sort_number: incri + i,
                      };
                    });
                    stageStore.setStageList(stageItem);
                    sortSlides({ data: res as any } as any);
                  }}
                  modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
                  renderItem={(item) => (
                    <>
                      <SortableList.Item id={item.id} handle>
                        <CustomListItem
                          isActive={activeSlide === item.id}
                          item={item}
                          onClick={() => {
                            onClickSlide(item.id);
                          }}
                          onContextMenu={(e) =>
                            handleItemContextMenu(e, item.id)
                          }
                        />
                      </SortableList.Item>
                    </>
                  )}
                />
              </Box>
            </ScrollbarC>
          </BoxWrap>
          <DrawerOverlay className='overlay-holder'></DrawerOverlay>
        </Drawer>
      </Box>
      <ContentBox>
        <MenuListing />
        <ContentHolder>
          <ContentPreview>
            <PresentationView />
          </ContentPreview>
        </ContentHolder>
      </ContentBox>
      {store.isOpen && <HyperLinkModal />}
      <AutomaticSave />
    </Box>
  );
};

export default Presentation;
