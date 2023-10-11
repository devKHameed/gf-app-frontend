type UploadDesign = {
  id: string;
  slug: string;
  title: string;
  type: "word_doc" | "image" | "csv" | "audio" | "video";
  sample_file: FileMeta;
  is_active: 0 | 1;
  is_deleted: 0 | 1;
  fusion_slug: string;
  created_at: string | null;
  updated_at: string | null;
};

type UploadDesignImport = {
  id: string;
  slug: string;
  files: { filename: string; file_url: string; type: string }[];
  error_file_url: string;
  status: string;
  uploaded_by: {
    slug: string;
    first_name: string;
    last_name: string;
    image: string;
  };
  upload_design_slug: string;
  processed_records: number;
  records_count: number;
  created_at: string | null;
  updated_at: string | null;
};
