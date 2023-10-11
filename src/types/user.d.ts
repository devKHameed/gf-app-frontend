type User = {
  created_at: string | null;
  email: string;
  first_name: string;
  id: string;
  is_deleted: boolean;
  last_name: string;
  phone: string;
  slug: string;
  updated_at: string | null;
  subscription?: UserAccountSubscription;
  image?: {
    uid: string;
    url: string;
    name: string;
    size: number;
    type: string;
  };
  tags?: { label: string; value: string; color: string }[];
};

type UserAccountSubscription = {
  id: string;
  account_id: string;
  user_id: string;
  account_user_type: string;
  app_user_type: string;
  date_created: string;
  account_contact_id: string;
  is_active: string;
};
