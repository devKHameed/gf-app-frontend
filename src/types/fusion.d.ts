type Fusion<Node = unknown, Edge = unknown, Viewport = unknown> = {
  slug: string;
  account_id?: string;
  fusion_title: string;
  fusion_slug: string;
  fusion_type?: string;
  fusion_tags: string[];
  fusion_description?: string;
  fusion_icon?: string;
  input_vars: {
    type: string;
    name: string;
    slug: string;
    description?: string;
    default_value?: string;
  }[];
  output_vars: {
    type: string;
    name: string;
    slug: string;
    description?: string;
    default_value?: string;
  }[];
  schedule_type: "minute_count" | "days_of_week" | "dates_of_month";
  minute_count: number;
  days_of_week: string[];
  date_of_month: string[];
  dataset_slug: string;
  fusion_status: "CLEAR" | "ERROR";
  is_active: boolean;
  socket_session_id: string;
  socket_session_metadata: Record<string, any>;
  max_duration: number;
  message_success: string;
  fusion_operators?: FusionOperator[];
  version?: number;
  updated_at?: string;
  widget_data?: Record<string, any>;
  session_int_vars?: Record<string, any>;
  created_at: string;
  updated_at: string;
  scheduling?: SchedulingConfig;
  epoch?: {
    id?: string;
    date?: string;
    epoch_type?: string;
  };
  flow?: {
    nodes: Node[];
    edges: Edge[];
    viewport: Viewport;
  };
  widget_action_form_data?: {
    widget_slug?: string;
    form_id?: string;
  };
  meta_data?: Record<string, unknown>;
  fusion_fields?: BaseFields;
  skill_user_fields?: BaseFields;
  skill_session_fields?: BaseFields;
  skill_user_tables?: SkillUserTable[];
  skill_user_table_sidebars?: SkillUserTableSidebar[];
  skill_user_table_modules?: SkillUserTableModule[];
  skill_session_slug?: string;
  skill_description?: string;
};

type SkillUserTable = {
  id: string;
  icon?: string;
  name: string;
  slug: string;
  description: string;
  fields?: BaseFields;
  module_id: string;
  hidden?: boolean;
};

type SkillUserTableSidebar = {
  id: string;
  icon?: string;
  name: string;
  slug: string;
  description: string;
  fields?: BaseFields;
  table_id: string;
  hidden?: boolean;
  parent_sidebar_id?: string;
};

type SkillUserTableModule = {
  id: string;
  icon?: string;
  name: string;
  slug: string;
  hidden?: boolean;
};

type IndefiniteScheduling = {
  type: "indefinitely";
  start?: string;
  end?: string;
  interval: string;
  restrict?: {
    days: number[];
    months: number[];
    time: { from: string; to: string };
  }[];
};

type OnceScheduling = {
  type: "once";
  date: string;
};

type DailyScheduling = {
  type: "daily";
  time: string;
  start?: string;
  end?: string;
};

type WeeklyScheduling = {
  type: "weekly";
  time: string;
  start?: string;
  end?: string;
  days: number[];
};

type MonthlyScheduling = {
  type: "monthly";
  time: string;
  start?: string;
  end?: string;
  dates: number[];
};

type YearlyScheduling = {
  type: "yearly";
  time: string;
  start?: string;
  end?: string;
  dates: number[];
  months: number[];
};

type SchedulingConfig =
  | IndefiniteScheduling
  | OnceScheduling
  | DailyScheduling
  | WeeklyScheduling
  | MonthlyScheduling
  | YearlyScheduling;

type FusionOperator = {
  total_credit: number;
  app: string;
  app_module: string;
  parent_fusion_id: string;
  id?: string;
  operator_id?: string;
  operator_slug: string;
  parent_operator_slug?: string;
  parent_output_slug?: string;
  operator_type_id?: string;
  operator_type_slug?: string;
  operator_color?: string;
  operator_subtitle?: string;
  operator_title: string;
  operator_icon?: string;
  parent_operator_id?: string;
  parent_output_id?: string;
  is_start_node?: boolean;
  operator_input_settings?: Record<string, any>;
  output_settings?: FusionOutputSettings;
  slug?: string;
  created_at?: string;
  edge_data?: { label: string; condition_sets: FilterFieldType[] };
  app_id?: string;
  module_type?: string;
  in_loop?: boolean;
  loop_data?: {
    loop_start_slug: string;
    loop_end_slug: string;
  };
  operator_conditions?: { label: string; condition_sets: FilterFieldType[] };
};

type FilterFieldType = {
  condition_set: { a: string; b: string; o: string }[];
  id: string;
};

type FusionOutputSettings = {
  enable_conditional_output: boolean;
  query_title: string;
  query_description: string;
  output_options: FusionOutputOption[];
};

type FusionOutputOption = {
  output_name: string;
  output_slug: string;
  output_color: string;
  output_description: string;
  output_conditions: FusionOutputCondition[];
};

type FusionOutputCondition = {
  condition_set: FusionConditionSet[];
};

type FusionConditionSet = {
  rhs_value: string;
  lhs_value: string;
  comparison_value: string;
};

type DsFusionConditionSet = {
  ds_rhs_value: string;
  ds_lhs_value: string;
  ds_comparison_value: string;
};

type FusionConnection = {
  user_id: string;
  account_id: string;
  app_id: string;
  app_connection_id: string;
  is_active: boolean;
  meta_data: Record<string, any>;
  connection_name: string;
  slug: string;
  query_string: string;
};

type DataStructure = {
  name: string;
  slug: string;
  specifications: MappableParameter[];
};

type FusionWebhook = {
  webhook_name: string;
  module_slug: string;
  fusion_slug: string;
  fusion_connection_slug: string;
  user_id: string;
  account_id: string;
  is_active: boolean;
  slug: string;
  webhook_url: string;
  get_request_headers: boolean;
  get_request_http_method: boolean;
  data_structures: DataStructure[];
  data_structure: DataStructure;
  ip_restrictions: string;
  json_passthrough: boolean;
};

type FusionSession = {
  created_at: string;
  fusion_slug: string;
  id: string;
  is_deleted: boolean;
  is_paused: boolean;
  is_stopped: boolean;
  session_data: SessionData;
  slug: string;
  updated_at: string;
};

type SessionData = {
  account_id: string;
  operator_outputs: Record<string, any>[];
  paused_operators: Record<string, any>[];
  session_operators: SessionOperator[];
  session_output: Record<string, any>[];
  session_response: Record<string, any>;
  session_status: "Building" | "Paused" | "Complete" | "UserCancel";
  session_variables: Record<string, any>[];
  user_id: string;
  fusion: Fusion;
  operator_responses?: Record<string, OperatorResponse>;
  payload?: unknown;
};

type OperatorResponse = {
  operations: {
    id: string;
    data: {
      inputs: Record<string, unknown>;
      outputs: unknown;
      status: string;
      logs: FusionOperatorLog[];
    };
    created_at: number;
  }[];
};

type SessionOperator = {
  total_credit: number;
  app: string;
  app_module: string;
  is_start_node: boolean;
  operator_logs: FusionOperatorLog[];
  operator_slug: string;
  operator_status: "Pending" | "Processing" | "Failed" | "Complete";
  operator_title: string;
  parent_fusion_id: string;
  started_at: string;
  last_updated: string;
};

type FusionOperatorLog = {
  message: string;
  payload: Record<string, any>;
  status: "Warning" | "Failed" | "Success";
  timestamp: string;
};

type SystemModule = {
  module_name: string;
  label: string;
  module_type: string;
  slug: string;
  description: string;
  icon: string;
};

type SocketResponse = {
  action: string;
  type: string;
  data: unknown;
};
