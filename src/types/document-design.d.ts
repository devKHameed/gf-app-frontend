type DocumentDesign = {
  id: string;
  slug: string;
  color: string;
  name: string;
  fields: {
    fields: DocumentField[];
    data: Record<string, Record<string, unknown>>;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
