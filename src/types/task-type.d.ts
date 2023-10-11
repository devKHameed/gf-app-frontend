type TaskType = {
  id: string;
  slug: string;
  name: string;
  color: string;
  fields?: CustomFieldsData;
  created_at: string;
  updated_at: string;
  is_deleted: number;
  statuses?: {
    slug: string;
    status_title?: string;
    status_color?: string;
  }[];
};
