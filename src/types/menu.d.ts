//  for every account
// app-->gui-list-gui

type GuiItem = {
  title: string;
  key: string;
  icon?: string;
  type?: "dashboard" | "contact-list" | "dataset-list";
  children?: Array<Omit<GuiItem, "type">>;
};

type AppItem = {
  title: string;
  key: string;
  icon?: string;
  children?: GuiItem[];
  type?: "dashboard" | "contact-list" | "dataset-list";
};

type AppMenu = AppItem[];
