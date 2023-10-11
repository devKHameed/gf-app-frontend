type GFMLFunction = {
  function_script?: string;
  function_title?: string;
  function_subtitle?: string;
  function_slug: string;
  function_group?: string;
  function_sub_group?: string;
  function_button_title: string;
  function_preview: string;
  function_color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  slug?: string;
};

type GFMLFunctionGroup = {
  function_group_name: string;
  function_group_sub_groups: GFMLFunctionSubGroups[];
};

type GFMLFunctionSubGroups = {
  function_sub_group_name: string;
  functions: GFMLFunction[];
};
