type AccountType = {
  id: string;
  slug: string;
  name: string;
  startup_fee: number;
  monthly_fee: number;
  app_user_settings: object;
  user_limit_settings: object;
  operation_settings: object;
  contact_settings: object;
  project_settings: object;
  dynamo_storage_settings: object;
  sql_storage_settings: object;
  chat_settings: object;
  created_at: string | null;
  updated_at: string | null;
  is_active: number;
  is_agent?: number;
};
