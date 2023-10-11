type DatasetDesign = {
  id: string;
  slug: string;
  dataset_slug: string;
  name: string;
  color?: string;
  icon?: string;
  description?: string;
  parent_type: number;
  parent_id: number;
  color: string;
  fields: {
    fields: DataField[];
  };
  engine: "sql" | "dynamo" | "both";
  sql_table_name: string;
  created_at: string | null;
  updated_at: string | null;
  is_active: number;
  is_deleted: number;
};

type DataFieldMapped = Partial<DataField> & {
  name?: string;
  label?: string;
  sx?: SxProps<any>;
};

type Dataset = {
  id: string;
  slug: string;
  title: string;
  icon: string;
  dataset_type_slug: string;
  fields: Record<string, unknown>;
  created_at: string | null;
  updated_at: string | null;
  is_active: number;
  is_deleted: number;
};
