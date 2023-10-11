type GFDocument = {
  id: string;
  slug: string;
  title: string;
  document_type_slug: string;
  fields: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type DocumentFusion = {
  fusion_slug: string;
  is_active: boolean;
};

type DocumentField = {
  name: string;
  icon?: React.ReactNode | string;
  type: string;
  nested?: boolean;
  id?: string;
  children?: DocumentField[];
  field_slug: string;
};
