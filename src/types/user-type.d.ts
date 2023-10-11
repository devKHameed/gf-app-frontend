type UserType = {
  is_deleted: boolean;
  id: string;
  updated_at: string | null;
  created_at: string | null;
  slug: string;
  name: string;
  fields?: Record<string, any>;
  contact_type_id: string;
  user_type_id: string;
  permissions: Record<string, any>;
};
