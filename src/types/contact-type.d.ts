type ContactType = {
  id: string;
  slug: string;
  name: string;
  color: string;
  fields: Record<string, any>;
  created_at: string;
  updated_at: string;
  is_deleted: number;
};
