type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  custom_data: unknown;
  project_type_slug: string;
  created_by: string;
  due_date: string | null;
  start_date: string | null;
  status: string;
  created_at: string | null;
  updated_at: string | null;
  is_active: number;
  is_deleted: number;
  roles: {
    [role_slug: string]: {
      user_slug: string;
    };
  };
  project_tags: string[];
};

type ProjectUpdate = {
  id: string;
  slug: string;
  project_slug: string;
  event_type: string;
  event_data: Record<string, any>;
  created_by: Record<string, any>;
  updated_at: string;
  created_at: string;
};
