import { ButtonProps } from "@mui/material";
import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { SYSTEM_NAV } from "configs/NavConfig";
import { cloneDeep } from "lodash";
import { SystemAppBarProps } from "module/Appbar";
import { getSearchParams } from "utils";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export enum LAYOUT_VIEW {
  Left = "left",
  Right = "right",
}
const appMenu: AppMenu = [];
type ButtonOptions = {
  addFolder?: boolean;
  addItem?: boolean;
};
interface IStore {
  isLoading: boolean;
  menu: AppMenu;
  setMenu: (_: AppMenu) => void;
  addButtonProps?: Partial<ButtonProps> | any;
  itemProps?: JSX.IntrinsicAttributes & {
    onClick: (_: Pick<AppItem, "key" | "title">, e?: any) => void;
    isActive: (_: Pick<AppItem, "key" | "title">) => boolean;
  };
  showActionButtons: boolean;
  setShowActionButtons: (_: boolean) => void;
  layout: "default" | "search";
  setLayout: (_: "default" | "search") => void;
  setButtonProps: (_: Partial<ButtonProps>) => void;
  buttonOptions: ButtonOptions;
  setButtonOptions: (_: ButtonOptions) => void;
  setItemProps: (_: IStore["itemProps"]) => void;
  resetStore: () => void;
  activeView: `${LAYOUT_VIEW}`;
  goToLeftView: () => void;
  goToRightView: () => void;
  goToView: (_: `${LAYOUT_VIEW}`) => void;
  onRename?: (_: AppItem) => void;
  setOnRename: (_: IStore["onRename"]) => void;
  sideNavSelectorOptions: {
    key: string;
    title: string;
    icon?: string;
    id?: string;
  }[];
  sideNavSelectorValue: any;
  setSideNavSelectorValue: (value: any) => void;
  setSideNavSelectorOptions: (
    options: { key: string; title: string; icon?: string; id?: string }[]
  ) => void;
  sideNavItemsLoading: boolean;
  setSideNavItemsLoading: (loading: boolean) => void;
  showSideNavTopSelector: boolean;
  setShowSideNavTopSelector: (value: boolean) => void;
  enableSideNavSearch: boolean;
  searchValue: string;
  customSearch: boolean;
  setSearch: (value: IStore["searchValue"]) => void;
  setCustomSearch: (value: IStore["customSearch"]) => void;
  setEnableSideNavSearch: (value: boolean) => void;
  disableFolders: boolean;
  setDisableFolders: (value: boolean) => void;
  appBarProps: Partial<Omit<SystemAppBarProps, "ref" | "defaultValue" | "sx">>;
  setAppBarProps: (
    props: Partial<Omit<SystemAppBarProps, "ref" | "defaultValue" | "sx">>
  ) => void;
  sideNavSelectorProps: { onSelect?: (value: any) => void };
  setSideNavSelectorProps: (props: { onSelect?: (value: any) => void }) => void;
}
let initialState: IStore | undefined;

export const useSystemLayoutBaseStore = create(
  immer<IStore>((set, get) => {
    const store: IStore = {
      sideNavSelectorOptions: SYSTEM_NAV,
      sideNavSelectorValue: SYSTEM_NAV[0],
      isLoading: false,
      menu: appMenu,
      addButtonProps: undefined,
      itemProps: undefined,
      onRename: undefined,
      showActionButtons: true,
      buttonOptions: { addFolder: true, addItem: true },
      showSideNavTopSelector: true,
      enableSideNavSearch: true,
      disableFolders: false,
      appBarProps: {},
      sideNavSelectorProps: {},
      searchValue: "",
      customSearch: false,
      setSearch(value) {
        set((state) => {
          state.searchValue = value;
        });
      },
      setCustomSearch(b) {
        set((state) => {
          state.customSearch = b;
        });
      },
      setSideNavSelectorProps(props) {
        set((state) => {
          state.sideNavSelectorProps = props;
        });
      },
      setAppBarProps(props) {
        set((state) => {
          state.appBarProps = props;
        });
      },
      setDisableFolders(value) {
        set((state) => {
          state.disableFolders = value;
        });
      },
      setShowSideNavTopSelector(value) {
        set((state) => {
          state.showSideNavTopSelector = value;
        });
      },
      setEnableSideNavSearch(value) {
        set((state) => {
          state.enableSideNavSearch = value;
        });
      },
      setButtonOptions: (props) => {
        set((state) => {
          state.buttonOptions = { ...state.buttonOptions, ...props };
          return state;
        });
      },
      layout: "default",
      sideNavItemsLoading: false,
      setSideNavItemsLoading(loading: boolean) {
        set((state) => {
          state.sideNavItemsLoading = loading;
        });
      },
      setSideNavSelectorOptions(options) {
        set((state) => {
          state.sideNavSelectorOptions = options;
        });
      },
      setSideNavSelectorValue(value) {
        set((state) => {
          state.sideNavSelectorValue = value;
        });
      },
      setLayout: (props) => {
        set((state) => {
          state.layout = props;
          return state;
        });
      },
      activeView:
        (getSearchParams().get("layout_c_name") as IStore["activeView"]) ||
        LAYOUT_VIEW.Left,
      setItemProps: (props) => {
        set((state) => {
          state.itemProps = props as any;
          return state;
        });
      },
      setButtonProps: (props) => {
        set((state) => {
          state.addButtonProps = props as any;
          return state;
        });
      },
      setMenu: (appm) => {
        set((state) => {
          state.menu = appm;
          return state;
        });
      },
      goToLeftView: () => {
        set((state) => {
          state.activeView = LAYOUT_VIEW.Left;
        });
      },
      goToRightView: () => {
        set((state) => {
          state.activeView = LAYOUT_VIEW.Right;
        });
      },
      goToView: (view) => {
        set((state) => {
          state.activeView = view;
        });
      },
      setOnRename: (callback) => {
        set((state) => {
          state.onRename = callback;
        });
      },
      setShowActionButtons: (value) => {
        set((state) => {
          state.showActionButtons = value;
        });
      },
      resetStore: () => {
        set(() => initialState);
      },
    };
    if (!!initialState) initialState = cloneDeep(store);

    return store;
  })
);

export const useSystemLayoutStore = createSelectorHooks<IStore>(
  useSystemLayoutBaseStore
);
