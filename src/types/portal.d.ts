type Portal = {
  id: string;
  slug: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  infra: { [key: string]: string };
  is_active: 1 | 0;
  is_deleted: 1 | 0;
};
