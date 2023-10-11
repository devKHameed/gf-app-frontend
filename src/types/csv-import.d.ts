type ImportSettings = {
  slug: string;
  csv_name: string;
  csv_path: string;
  type: string;
  target_document: string;
  target_fusion: string;
  unique_settings: string;
  unique_comparison_field: string;
  automate_on_complete: boolean;
  select_fields: string[];
  field_targeting: TargetField[];
};

type TargetField = {
  import_column_name: string;
  target_field_slug: string;
  include_in_import: boolean;
  is_required: boolean;
};

type CSVImport = {
  csv_name: string;
  csv_path: string;
  import_status: string;
  import_type: string;
  slug: string;
  import_results: {
    processed_records?: number;
  };
  created_at: string;
  updated_at: string;
  target_document: string;
  target_fusion: string;
  unique_settings: string;
  unique_comparison_field: string;
  field_targeting: TargetField[];
  total_records: number;
};
