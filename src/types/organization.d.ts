type Organization = {
  id: string;
  slug: string;
  name:string;
  data: Record<string, any>;
  type_id: string;
  created_at: string | null;
  updated_at: string | null;
  is_deleted: number;
};
