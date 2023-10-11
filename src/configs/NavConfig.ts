import { Icons } from "constants/index";

export type NavigationConfig = {
  key: string;
  path?: string;
  title: string;
  icon?: Icons;
  breadcrumb?: boolean;
  submenu?: any[];
  children?: NavigationConfig[];
  [key: string]: any;
};

export const SYSTEM_NAV: NavigationConfig[] = [
  {
    key: "fusions",
    path: `/fusion-module`,
    title: "Fusions",
    icon: "GfLogo",
  },
  {
    key: "dataset",
    path: `/dataset-module`,
    title: "Dataset",
    icon: "Dataset",
  },
  {
    key: "fusion-action",
    path: `/fusion-action-module`,
    title: "Fusion Action",
    icon: "GfLogo",
  },
];
