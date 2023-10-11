type DatacardDesign = {
  id: string;
  slug: string;
  datacard_type: DatacardType;
  dataset_design_slug: string;
  name: string;
  description: string;
  sort_order: number;
  icon: string;
  associated_fields: {
    fields: DataField[];
  };
  is_universal: boolean;
  created_at: string | null;
  updated_at: string | null;
  is_active: number;
  is_deleted: number;
  color?: string;
};

type DatacardType = "datasets" | "contacts";

type Datacard = {
  id: string;
  slug: string;
  datacard_type: string;
  datacard_design_slug: string;
  parent_record_id: string;
  parent_record_slug: string;
  sort_order: number;
  associated_field_data: Record<string, unknown>;
  created_at: string | null;
  updated_at: string | null;
  is_active: number;
  is_deleted: number;
};
