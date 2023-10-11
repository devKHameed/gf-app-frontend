type ProjectType = {
  id: string;
  slug: string;
  title: string;
  color: string;
  custom_fields: {
    fields: FormItem[];
    data: Record<string, Record<string, unknown>>;
  };
  created_at: string;
  updated_at: string;
  is_deleted: number;
  statuses: {
    slug: string;
    status_title: string;
    status_color: string;
    user_type_access: string[];
    role_based_access: string[];
  }[];
  default_roles: {
    slug: string;
    role_title: string;
    user_type_access: string[];
  }[];
  associated_task_types: string[];
};
