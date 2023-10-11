type ProjectTask = {
  id: string;
  slug: string;
  title: string;
  description: string;
  custom_data: Record<string, unknown>;
  created_by: string;
  due_date: string;
  start_date: string;
  status: string;
  project_slug: string;
  task_type_slug: string;
  assignees: string[];
  is_active: number;
  is_deleted: number;
};
