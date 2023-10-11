type Condition = {
  id: string;
  operator: string;
  operant: [];
  include: boolean;
};
type IncludeTabs = {
  [key: string]: any;
  id: string;
  included_fields: string[];
  name: string;
  dataset_to_include: string;
  association_type: string;
  linking_field: string;
  record_type: "single" | "list";
};
type GfGui = {
  id: string;
  slug: string;
  name: string;
  parent_app_id: string; //string
  parent_folder_id: string; //string
  sort_order: number; //int
  color: string; //string
  icon: string; //string
  description: string; //string
  current_version: string; //string
  gui_type: string; //string
  role_based_access: Record<string, any>; //JSON
  individual_access: Record<string, any>; //JSON
  paramater_settings: Record<string, any>; //JSON
  filter_settings: { view_filters?: Condition[] }; //JSON
  org_list_settings: Record<string, any>; //JSON
  dataset_list_settings: {
    search_fields?: string[];
    form_fields?: string[];
    included_tabs?: IncludeTabs[];
    included_sidebar_widgets?: IncludeTabs[];
  }; //JSON
  contact_list_settings: Record<string, any>; //JSON
  fusion_list_settings: Record<string, any>; //JSON
  document_list_settings: Record<string, any>; //JSON
  dashboard_list_settings: DashboardListSettings; //JSON
  plugin_settings: Record<string, any>; //JSON
  created_at: string;
  updated_at: string;
  is_active: 1 | 0;
  is_deleted: 1 | 0;
};

type DashboardListSettings = {
  tabs?: DashboardTab[];
};

type DashboardTab = {
  tab_name: string;
  id: string;
  tab_rows?: DashboardTabRow[];
};

type DashboardTabRow = {
  row_id: string;
  row_column_count: number;
};

type GuiDashboardWidget = {
  id: string;
  slug: string;
  name: string; //string
  parent_gui_id: string; //string
  parent_tab_id: string; //string
  row_id: string; //string
  row_column: number; //int
  widget_type: string; //string (Line,Bar,Pie,Statistic,RecordList)
  filter_groups: WidgetFilterGroup[]; //JSON
  description: string; //string
  dummy_data_titles: Record<string, unknown>; //JSON
  associated_fusion_id: string; //string
  created_at: string;
  updated_at: string | null;
  is_active: number;
  is_deleted: number;
  create_forms?: WidgetAction[];
  edit_forms?: WidgetAction[];
};

type WidgetAction = {
  button_title: string;
  enable_populate_fusion: boolean;
  populate_fusion: string;
  submit_fusion: string;
  form_fields: {
    fields: DataField[];
  };
  id: string;
};

type WidgetFilterGroup = {
  id: string;
  title: string;
};
