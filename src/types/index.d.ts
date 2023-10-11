declare module "react-cookie";
declare module "*.ico";

type LabeledValue = {
  label: string;
  value?: string;
  options?: Omit<LabeledValue, "options">[];
};

type FileMeta = {
  id: string;
  url?: string;
  name?: string;
  type?: string;
  size?: number;
  key?: string;
  loaded?: number | string;
  uploadingProgress?: number;
  status?: "start" | "uploading" | "completed" | "error";
  originalFile?: File;
};
