type FormItem = {
  name: string;
  icon?: React.ReactNode | string;
  type: string;
  nested?: boolean;
  id?: string;
  children?: FormItem[];
  field_slug?: string;
};

type CustomFieldsData = {
  fields: FormItem[];
  data: Record<string, Record<string, unknown>>;
};

type ListItem = {
  id: string;
  title?: string | null;
  subtitle?: string | null;
  tag?: string;
  timestamp?: string;
  avatar?: string;
  color?: string;
  tagColor?: string;
  count?: number;
  badge?: boolean | { color?: string; active?: boolean };
  className?: string;
};

type DataField = {
  date_type?: string;
  title: string;
  slug: string;
  type: string;
  tooltip?: string;
  id: string;
  list_items?: Record<string, any>[];
  list_default_display_type?: "single_drop_down" | "multi_drop_down";
  list_source?: "hardcoded" | "record_association";
  multi?: boolean;
  fields?: DataField[];
  multi_user?: boolean;
  accept?: string;
  max_size?: number;
  max_count?: number;
  required?: boolean;
  children?: DataField[];
  default_value?: any;
  file_type?: string;
  number_type?: string;
};

type BaseFields = {
  fields?: DataField[];
};
