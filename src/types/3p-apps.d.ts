type FileData = { id: string; url: string; type: string; name: string };
type ThreePApp = {
  app_status: string;
  app_label: string;
  app_description: string;
  app_color: string;
  app_logo_image: FileData;
  app_logo: string;
  app_color_logo: string;
  app_tags: string[];
  app_language: string;
  base_structure: Record<string, any>;
  common_data: Record<string, any>;
  invite_only: boolean;
  app_version: string;
  groups: Record<string, any>[];
  read_me: string;
  is_active: boolean;
  app_name: string;
  slug: string;
  id: string;
  app_invite_code: string;
  created_at: string;
  updated_at: string;
};

type ThreePAppConnection = {
  label: string;
  type: string;
  communication: Record<string, any>;
  common_data: Record<string, any>;
  scope_list: Record<string, any>;
  default_scope: Record<string, any>[];
  app_parameters: MappableParameter[];
  is_active: boolean;
  slug: string;
};

type ThreePAppAction = {
  module_name: string;
  label: string;
  connection_id: string;
  alt_connection_id: string;
  module_type: string;
  module_action: string;
  description: string;
  search: string;
  communication: Record<string, any>;
  static_parameters: Record<string, any>[];
  mappable_parameters: MappableParameter[];
  interface: Record<string, any>[];
  samples: Record<string, any>;
  required_scope: Record<string, any>[];
  availability: boolean;
  allow_for_invite: boolean;
  shared_url_address: string;
  detach: Record<string, any>;
  attach: Record<string, any>;
  epoch: Record<string, any>;
  universal_subtype: string;
  is_active: boolean;
  slug: string;
};

type ThreePAppWebhook = {
  label: string;
  incoming_communication: Record<string, any>;
  connection_id: string;
  alt_connection_id: string;
  shared_url_address: string;
  app_parameters: MappableParameter[];
  app_detach: Record<string, any>;
  app_attach: Record<string, any>;
  is_active: boolean;
  slug: string;
  webhook_type: string;
};

type ThreePAppRemoteProcedure = {
  module_name: string;
  label: string;
  description: string;
  communication: Record<string, any>;
  connection_id: string;
  alt_connection_id: string;
  app_parameters: Record<string, any>[];
  is_active: boolean;
  slug: string;
};

type ThreePAppGFMLFunction = {
  function_slug: string;
  label: string;
  function_value: string;
  slug: string;
  is_active: boolean;
};

type MappableParameter = {
  name: string;
  label?: string;
  help?: string;
  type?: string;
  required?: boolean;
  default?: any;
  advanced?: boolean;
  options?:
    | string
    | (LabeledValue & {
        options?: LabeledValue[];
        nested?: MappableParameter[] | string;
      })[]
    | {
        store?:
          | string
          | (LabeledValue & {
              // options?: LabeledValue[];
              nested?: MappableParameter[] | string;
            })[];
        placeholder?: string;
        operators?: LabeledValue[];
        logic?: string;
      }
    | ((
        operator: FusionOperator,
        operatorList: FusionOperator[]
      ) => LabeledValue[]);
  grouped?: boolean;
  multiple?: boolean;
  placeholder?: string;
  spec?: MappableParameter[] | MappableParameter;
  labels?: {
    add?: string;
    field?: string;
  };
  nested?: MappableParameter[];
  [key: string]: any;
};

type EpochResponse = {
  label?: string;
  description?: string;
  data?: {
    epoch: {
      id: string;
      date: string;
      type: "id" | "date";
      order: "asc" | "desc";
    };
  };
};
