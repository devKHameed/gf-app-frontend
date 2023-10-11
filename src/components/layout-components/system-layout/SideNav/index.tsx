import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { CSS, Transform } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useMutation } from "@tanstack/react-query";
import AddFolder from "assets/icons/AddFolder";
import classNames from "classnames";
import FormField from "components/FormField";
import Scrollbar from "components/Scrollbar";
import SearchInput from "components/SearchInput";
import Spin from "components/Spin";
import {
  MultipleContainers,
  SortableItemType,
} from "components/drag-drop/MultipleContainer";
import { ContainerProps, Handle } from "components/drag-drop/components";
import { DraggableItemProps } from "components/drag-drop/components/Item/Item";
import GenericIcon from "components/util-components/Icon";
import { Icons } from "constants/index";
import Fuse from "fuse.js";
import useOpenClose from "hooks/useOpenClose";
import useRouteToApiModel from "hooks/useRouteToApiModel";
import debounce from "lodash/debounce";
import isArray from "lodash/isArray";
import FolderModel from "models/Folder";
import { queryClient } from "queries";
import { ApiModelDataTypes, ApiModels } from "queries/apiModelMapping";
import useCreateItem from "queries/useCreateItem";
import useDeleteItem from "queries/useDeleteItem";
import useListItems from "queries/useListItems";
import useUpdateItem from "queries/useUpdateItem";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useSystemLayoutStore } from "store/stores/systemLayout";
import Swal from "sweetalert2";
import { z } from "zod";
import {
  AddButton,
  BottomSection,
  BoxWrap,
  DividerWrap,
  Drawer,
  DrawerHeader,
  DrawerOverlay,
  ListItemButtonWrap,
  ListItemStyle,
  MenuContainer,
} from "./index.styles.";

type MenuInfo = {
  title: string;
  key: string;
  icon: Icons;
  children?: MenuInfo[];
};

export const CustomListItem = React.memo(
  React.forwardRef<
    HTMLLIElement,
    {
      item: { title: string; key: string; icon: Icons };
      onClick?: (_: MenuInfo) => void;
      [key: string]: any;
      handleContextMenu: (
        _: React.MouseEvent<HTMLDivElement>,
        extra?: MenuInfo
      ) => void;
    } & DraggableItemProps
  >(
    (
      {
        item,
        onClick,
        transition,
        handleProps,
        listeners,
        transform,
        index,
        color,
        dragging,
        handleContextMenu,
        ...rest
      },
      ref
    ) => {
      const { onClick: onItemClick, isActive } =
        useSystemLayoutStore.useItemProps?.() || {};

      const handleClick = () => {
        onItemClick?.(item);
      };
      const onContextMenuHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        handleContextMenu?.(e, item);
      };
      return (
        <ListItemStyle
          disablePadding
          onClick={handleClick}
          sx={{ zIndex: 10000000000 }}
          ref={ref}
          isActive={isActive?.(item)}
          {...rest}
          {...(rest.listeners || {})}
          style={{
            transition: [transition].filter(Boolean).join(", "),
            "--translate-x": transform
              ? `${Math.round(transform.x)}px`
              : undefined,
            "--translate-y": transform
              ? `${Math.round(transform.y)}px`
              : undefined,
            "--scale-x": transform?.scaleX ? `${transform.scaleX}` : undefined,
            "--scale-y": transform?.scaleY ? `${transform.scaleY}` : undefined,
            "--index": index,
            "--color": color,
            opacity: dragging ? 0 : 1,
          }}
          id={item.key}
          onContextMenu={onContextMenuHandler}
        >
          <Handle {...handleProps} {...listeners} />
          <ListItemButtonWrap
            sx={{
              minHeight: 40,
              justifyContent: open ? "initial" : "center",
              px: 2,
            }}
            disableRipple={true}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                // mr: open ? 1.5 : "auto",
                mr: 1.5,
                justifyContent: "center",
              }}
            >
              <GenericIcon
                iconName={item.icon || "Menu"}
                sx={{ width: "16px", height: "auto" }}
                key={item.icon}
              />
            </ListItemIcon>
            <ListItemText
              primary={item.title}
              sx={{ opacity: open ? 1 : 0, m: 0 }}
            />
          </ListItemButtonWrap>
          {/* </AccountLink> */}
        </ListItemStyle>
      );
    }
  )
);

const MenuListContainer: React.FC<
  React.PropsWithChildren<
    {
      title: string;
      handleContextMenu: (
        _: React.MouseEvent<HTMLDivElement>,
        id?: string
      ) => void;
    } & ContainerProps
  >
> = React.memo(
  React.forwardRef(
    (
      {
        children,
        title,
        style,
        transform,
        transition,
        id,
        handleProps,
        isDragging,
        handleContextMenu,
      },
      ref
    ) => {
      const theme = useTheme();
      const [isExpended, setIsExpended] = React.useState(true);
      const onContextMenuHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        handleContextMenu?.(e, id as string);
      };
      return (
        <Stack
          gap={1.25}
          sx={{ minWidth: "0" }}
          id={id as string}
          onContextMenu={onContextMenuHandler}
        >
          <Box ref={ref} className="box-holder">
            <Accordion
              sx={{
                boxShadow: "none  !important",
                background: "none !important",
                borderRadius: "0 !important",
              }}
              expanded={isExpended && !isDragging}
              onChange={() => setIsExpended((ex) => !ex)}
              style={{
                ...style,
                transition,
                transform: CSS.Translate.toString(transform as Transform),
                opacity: isDragging ? 0.5 : undefined,
              }}
            >
              <AccordionSummary
                expandIcon={<ArrowDropDown />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{
                  minHeight: "40px",
                  boxShadow: "none",
                  padding: "0 12px",
                  "&:hover": {
                    ".MuiTypography-root ": {
                      color: theme.palette.background.GF60,
                    },

                    ".MuiAccordionSummary-expandIconWrapper": {
                      color: theme.palette.background.GF60,
                    },
                  },

                  ".draggable-handle ": {
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    right: "50px",
                    width: "auto",
                    opacity: 0,
                  },

                  "&.Mui-expanded": {
                    minHeight: "40px",

                    ".MuiAccordionSummary-content": {
                      margin: "5px 0",

                      [`${theme.breakpoints.only(
                        "sm"
                      )},${theme.breakpoints.only("md")}`]: {
                        margin: "0",
                      },
                    },
                  },

                  ".MuiAccordionSummary-content": {
                    margin: "5px 0",
                    alignItems: "center",

                    [`${theme.breakpoints.only("sm")},${theme.breakpoints.only(
                      "md"
                    )}`]: {
                      margin: "0",
                    },
                  },

                  ".MuiPaper-root": {
                    boxShadow: "none",
                  },

                  ".MuiAccordionSummary-expandIconWrapper": {
                    width: "18px",
                    transform: "rotate(90deg)",
                    color: theme.palette.background.Groups,

                    "&.Mui-expanded": {
                      transform: "rotate(0)",
                    },

                    svg: {
                      width: "100%",
                      height: "auto",
                    },
                  },
                }}
              >
                <Handle {...handleProps} />
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: theme.palette.background.Groups,
                    textTransform: "uppercase",
                    transition: "all 0.4s ease",
                  }}
                >
                  {title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  p: 0,
                }}
              >
                <List sx={{ p: 0 }}>{children}</List>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Stack>
      );
    }
  )
);

const open = true;

const ButtonAdd = () => {
  const addButtonProps = useSystemLayoutStore.useAddButtonProps?.();
  const theme = useTheme();
  return (
    <React.Fragment>
      <AddButton
        fullWidth
        variant="outlined"
        color="inherit"
        sx={{ borderColor: theme.palette.background.GF10 }}
        {...addButtonProps}
      >
        <PersonAddAltIcon />
      </AddButton>
    </React.Fragment>
  );
};
const ButtonAddFolder = () => {
  const theme = useTheme();
  const [isOpen, onOpen, onClose] = useOpenClose();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<Folder>({
    mode: "onBlur",
    resolver: zodResolver(
      z.object({
        name: z.string().min(1, "Name is required"),
      })
    ),
    defaultValues: {},
  });

  const routeModel = useRouteToApiModel();
  const { mutate: createFolder } = useCreateItem({
    modelName: ApiModels.Folder,
    queryKey: [ApiModels.Folder, routeModel],
  });

  const closeHandler = () => {
    onClose();
    reset();
  };
  const submitHandler = (data: Folder) => {
    createFolder(
      { ...data, resource: routeModel, sort_order: 10000000000 },
      {
        onSuccess: () => {
          closeHandler();
        },
      }
    );
  };
  return (
    <React.Fragment>
      <AddButton
        fullWidth
        variant="outlined"
        color="inherit"
        sx={{ borderColor: theme.palette.background.GF10 }}
        onClick={onOpen}
      >
        <AddFolder />
      </AddButton>
      <Dialog open={isOpen} disableEscapeKeyDown scroll="body">
        <DialogTitle>Add Folder</DialogTitle>
        <Scrollbar className="form-scroller">
          <DialogContent>
            <Box component="form">
              <FormField
                label="Folder Name"
                error={dirtyFields.name ? errors.name : undefined}
              >
                <TextField
                  {...register("name")}
                  autoFocus
                  margin="dense"
                  id="name"
                  type="text"
                  fullWidth
                />
              </FormField>
            </Box>
          </DialogContent>
        </Scrollbar>
        <DialogActions>
          <Button onClick={closeHandler}>Cancel</Button>
          <Button onClick={handleSubmit(submitHandler)} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

const FolderRenameModel = ({
  folder,
  isOpen,
  onClose,
}: {
  folder: Folder | undefined;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<Folder>({
    mode: "onBlur",
    resolver: zodResolver(
      z.object({
        name: z.string().min(1, "Name is required"),
      })
    ),
    defaultValues: {},
  });

  const { mutate: updateFolder, isLoading } = useUpdateItem({
    modelName: ApiModels.Folder,
    queryKey: [ApiModels.Folder, ApiModels.DatasetDesign],
    mutationOptions: {
      onSuccess: (_, { slug, data }) => {
        const defaultQueryKey = [ApiModels.Folder, ApiModels.DatasetDesign];
        queryClient.setQueriesData(
          [defaultQueryKey],
          (oldData: ApiModelDataTypes[typeof ApiModels.Folder][] = []) => {
            if (isArray(oldData)) {
              return oldData.map((item) =>
                item.slug === slug ? { ...item, ...data } : item
              );
            }
            return oldData;
          }
        );
      },
    },
  });

  const closeHandler = () => {
    onClose();
  };
  const submitHandler = (data: Folder) => {
    if (folder?.slug)
      updateFolder(
        { slug: folder.slug, data },
        {
          onSuccess: () => {
            closeHandler();
          },
        }
      );
  };

  React.useEffect(() => {
    reset(folder);
  }, [folder, reset]);

  return (
    <React.Fragment>
      <Dialog open={isOpen} disableEscapeKeyDown scroll="body">
        <DialogTitle>Rename</DialogTitle>
        <Scrollbar className="form-scroller">
          <DialogContent>
            <Box component="form">
              <FormField
                label="Folder Name"
                error={dirtyFields.name ? errors.name : undefined}
              >
                <TextField
                  {...register("name")}
                  autoFocus
                  margin="dense"
                  id="name"
                  type="text"
                  fullWidth
                />
              </FormField>
            </Box>
          </DialogContent>
        </Scrollbar>
        <DialogActions>
          <Button onClick={closeHandler} disabled={isLoading}>
            Cancel
          </Button>
          <LoadingButton
            onClick={handleSubmit(submitHandler)}
            variant="contained"
            loading={isLoading}
            type="submit"
          >
            Submit
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

const options = {
  // isCaseSensitive: false,
  // includeScore: false,
  shouldSort: true,
  // includeMatches: false,
  // findAllMatches: false,
  // minMatchCharLength: 1,
  // location: 0,
  threshold: 0.3,
  // distance: 100,
  // useExtendedSearch: false,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  // fieldNormWeight: 1,
  keys: ["title"],
};

export const SideNavTopSelector: React.FC = () => {
  const selectedValue = useSystemLayoutStore.useSideNavSelectorValue();
  const setValue = useSystemLayoutStore.useSetSideNavSelectorValue();
  const options = useSystemLayoutStore.useSideNavSelectorOptions();
  const props = useSystemLayoutStore.useSideNavSelectorProps();

  return (
    <DrawerHeader>
      <Select
        onChange={(e) => {
          setValue(options.find((op) => op.key === e.target.value));
          props.onSelect?.(options.find((op) => op.key === e.target.value));
        }}
        value={selectedValue.key}
        size="small"
        className="header-select"
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
          <MenuItem value={item.key} sx={{ gap: "6px" }}>
            {item.icon && (
              <GenericIcon
                className="header-select-icon"
                key={item.icon}
                iconName={item.icon as any}
                color={"primary"}
              />
            )}{" "}
            <Box className="header-title">{item.title}</Box>
          </MenuItem>
        ))}
      </Select>
    </DrawerHeader>
  );
};

export default function SideNav() {
  const itemsLoading = useSystemLayoutStore.useSideNavItemsLoading();
  const rawMenu = useSystemLayoutStore.useMenu();
  const layout = useSystemLayoutStore.useLayout();
  const disableFolders = useSystemLayoutStore.useDisableFolders();
  const showActionButtons = useSystemLayoutStore.useShowActionButtons();
  const buttonOptions = useSystemLayoutStore.useButtonOptions();
  const showSideNavTopSelector =
    useSystemLayoutStore.useShowSideNavTopSelector();
  const enableSideNavSearch = useSystemLayoutStore.useEnableSideNavSearch();

  const onRename = useSystemLayoutStore.useOnRename?.();

  const [isDragging, setDragging] = React.useState(false);
  const [itemContextMenu, setItemContextMenu] =
    React.useState<{
      mouseX: number;
      mouseY: number;
      item: AppItem;
    } | null>(null);
  const [containerContextMenu, setContainerContextMenu] =
    React.useState<{
      mouseX: number;
      mouseY: number;
      item: Folder;
    } | null>(null);
  const [isRenameModelOpen, setRenameModelOpen] = React.useState(false);

  const [selectedFolder, setSelectedFolder] = React.useState<Folder | null>();
  const routeModule = useRouteToApiModel();
  const { data: folders } = useListItems({
    modelName: ApiModels.Folder,
    queryKey: [ApiModels.Folder, routeModule],
    requestOptions: { query: { resource: routeModule } },
    queryOptions: {},
  });
  const fuseRef = React.useRef(new Fuse(rawMenu, options));
  const searchValue = useSystemLayoutStore.useSearchValue?.();
  const setSearchValue = useSystemLayoutStore.useSetSearch?.();
  const useCustomSearch = useSystemLayoutStore.useCustomSearch?.();

  const { mutate: updateItemSort } = useMutation({
    mutationFn: async ({ data }: any) => {
      await FolderModel.sort(data);
    },
    onSuccess: (_) => {
      console.log("success");
    },
  });

  // console.log("🚀 ~ file: index.tsx:662 ~ SideNav ~ routeModule:", routeModule);
  const { mutate: deleteItem, isLoading: isDeleting } = useDeleteItem({
    modelName: routeModule! as any,
  });

  React.useEffect(() => {
    fuseRef.current = new Fuse(rawMenu, options);
  }, [rawMenu]);

  const menu = React.useMemo(() => {
    if (!searchValue?.length) return rawMenu;
    if (useCustomSearch) return rawMenu;
    return fuseRef.current.search(searchValue)?.map((i) => i.item);
  }, [searchValue, rawMenu]);

  const { sortItem, sortItemFolderMap, sortItemMap } = React.useMemo(() => {
    const sortItem: { [key: string]: string[] } = {};
    const sortItemFolderMap = new Map();
    const sortItemMap = new Map();
    /// When in Search view no need to drag and drop
    if (layout === "search" || !searchValue.length) {
      folders
        ?.sort((a, b) => a.sort_order - b.sort_order)
        .forEach((folder) => {
          sortItemFolderMap.set(folder.slug, folder);
          sortItemFolderMap.get(folder.slug);
          sortItem[folder.slug] =
            folder.childs?.filter(Boolean)?.map((i) => {
              return i.slug;
            }) || [];
        });

      menu.forEach((m) => {
        sortItemMap.set(m.key, m);
      });
    }
    return { sortItem, sortItemFolderMap, sortItemMap };
  }, [menu, folders, searchValue.length]);

  const handleSeach = (value: string) => {
    setSearchValue(value);
  };
  const onSortEnd = (container: string[], items: SortableItemType) => {
    const childMap = new Map();
    folders?.forEach((folder) => {
      folder.childs.forEach((child) => {
        childMap.set(child.slug, child);
      });
    });
    const data = container.map((key) => {
      return {
        id: key,
        childs: items[key].map((itkey) => {
          return childMap.get(itkey);
        }),
      };
    });
    updateItemSort({ data: { data, resource: routeModule } });
  };

  const handleItemContextMenu = React.useCallback(
    (event: React.MouseEvent, extra: AppItem) => {
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
  const handleContainerContextMenu = React.useCallback(
    (event: React.MouseEvent, id: string) => {
      event.preventDefault();
      setContainerContextMenu(
        containerContextMenu === null
          ? {
              mouseX: event.clientX + 2,
              mouseY: event.clientY - 6,
              item: sortItemFolderMap.get(id),
            }
          : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
            // Other native context menus might behave different.
            // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
            null
      );
    },
    [containerContextMenu, sortItemFolderMap]
  );
  const handleItemContextMenuClose = () => {
    setItemContextMenu(null);
  };
  const handleRenameItem = () => {
    onRename?.(itemContextMenu?.item!);
    handleItemContextMenuClose();
  };

  const handleContainerContextMenuClose = () => {
    setContainerContextMenu(null);
  };
  const handleRenameContainer = () => {
    setSelectedFolder(containerContextMenu?.item);
    setRenameModelOpen(true);
    handleContainerContextMenuClose();
  };

  const handleRenameModelClose = () => {
    setSelectedFolder(null);
    setRenameModelOpen(false);
  };
  const ItemContextMenuOpen = itemContextMenu !== null;
  const containerContextMenuOpen = containerContextMenu !== null;

  const handleOnDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteItem({ slug: itemContextMenu?.item?.key! });
      }
    });

    handleItemContextMenuClose();
  };
  return (
    <Box>
      <FolderRenameModel
        folder={selectedFolder!}
        isOpen={isRenameModelOpen}
        onClose={handleRenameModelClose}
      />

      {/*Start Menu Item Context Menu */}
      <Menu
        open={ItemContextMenuOpen}
        onClose={handleItemContextMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={
          ItemContextMenuOpen
            ? { top: itemContextMenu.mouseY, left: itemContextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={handleRenameItem}>Rename</MenuItem>
        <MenuItem onClick={handleOnDelete}>Delete</MenuItem>
      </Menu>
      {/*End Menu Item Context Menu */}

      {/*Start container Menu Context Menu */}
      <Menu
        open={containerContextMenuOpen}
        onClose={handleContainerContextMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={
          containerContextMenuOpen
            ? {
                top: containerContextMenu.mouseY,
                left: containerContextMenu.mouseX,
              }
            : undefined
        }
      >
        <MenuItem onClick={handleRenameContainer}>Rename</MenuItem>
      </Menu>
      {/*End container Menu Context Menu */}

      <Drawer
        variant="permanent"
        open={open}
        PaperProps={{ className: classNames({ "is-dragging": isDragging }) }}
      >
        <BoxWrap>
          {showSideNavTopSelector && (
            <>
              <SideNavTopSelector />
              <DividerWrap />
            </>
          )}
          {enableSideNavSearch && (
            <Box sx={{ py: 1.375, px: 1.75 }}>
              <SearchInput
                id="outlined-adornment-password"
                placeholder="Search..."
                size="small"
                sx={{ m: 0 }}
                onChange={debounce((e) => {
                  handleSeach(e.target.value);
                }, 300)}
              />
            </Box>
          )}
          <Scrollbar>
            <MenuContainer sx={{ color: "black" }}>
              {layout === "search" || searchValue?.length > 0 ? (
                <div>
                  {menu.map((m) => {
                    return <CustomListItem item={m} />;
                  })}
                </div>
              ) : disableFolders ? (
                <Box>
                  {menu.map((m) => {
                    return <CustomListItem item={m} />;
                  })}
                </Box>
              ) : (
                <Spin spinning={itemsLoading}>
                  <MultipleContainers
                    items={sortItem}
                    activationConstraint={{ distance: 10 }}
                    minimal
                    vertical={true}
                    modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
                    style={{ padding: 0 }}
                    renderContainer={(prps: any) => {
                      const container: any = sortItemFolderMap.get(prps.id);
                      if (!container) return null;
                      return (
                        <MenuListContainer
                          {...prps}
                          title={container.name}
                          handleContextMenu={handleContainerContextMenu}
                        />
                      );
                    }}
                    renderItem={(prps: any) => {
                      const item: MenuInfo = sortItemMap.get(prps.value);
                      if (!item) return null;
                      return (
                        <CustomListItem
                          {...prps}
                          item={item}
                          handleContextMenu={handleItemContextMenu}
                        />
                      );
                    }}
                    onSortEnd={onSortEnd as any}
                    isDragging={(isDragging) => setDragging(isDragging)}
                  />
                </Spin>
              )}
            </MenuContainer>
          </Scrollbar>
        </BoxWrap>
        {showActionButtons && (
          <BottomSection className="bottom-btns">
            {buttonOptions.addFolder && <ButtonAddFolder />}
            {buttonOptions.addItem && <ButtonAdd />}
          </BottomSection>
        )}
        <DrawerOverlay className="overlay-holder"></DrawerOverlay>
      </Drawer>
    </Box>
  );
}
