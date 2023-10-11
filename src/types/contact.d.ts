type Contact = {
  id: string;
  slug: string;
  icon: string;
  primary_email: string; //string GSI
  primary_phone: string; //string GSI
  first_name: string; //string
  last_name: string; //string
  all_emails: Record<string, any>; //JSON
  all_phones: Record<string, any>; //JSON
  country: string; //String
  profile_image: string; //string
  primary_user_type?: string;
  mailing_address: {
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zip?: string;
  }; //STRING
  created_at: string;
  updated_at: string;
  is_active: 1;
  is_universal: boolean;
  is_deleted: 0;
};

type ContactAndTypes = {
  contact_id: string;
  contact_type_id: string;
  data: Record<string, any>;
};

type ContactListRule = {
  id: string;
  slug: string;
  types_to_include: string[];
  tags_to_include: string[];
};

type ContactListAgg = {
  id: string;
  slug: string;
  contact_id_rule_id: string;
  contact_data: Record<string, unknown>;
  contact_id: string;
  rule_id: string;
};
