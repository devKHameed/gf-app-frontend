type Card = {
  id: string;
  primary: boolean;
  brand: string;

  /**
   * Two-letter ISO code representing the country of the card. You could use this attribute to get a sense of the international breakdown of cards you've collected.
   */
  country: string | null;

  customer?: string | Stripe.Customer | Stripe.DeletedCustomer | null;

  deleted?: void;

  /**
   * A high-level description of the type of cards issued in this range. (For internal use only and not typically available in standard API requests.)
   */
  description?: string;

  exp_month: number;

  /**
   * Four-digit number representing the card's expiration year.
   */
  exp_year: number;

  /**
   * The last four digits of the card.
   */
  last4: string;

  /**
   * Set of [key-value pairs](https://stripe.com/docs/api/metadata) that you can attach to an object. This can be useful for storing additional information about the object in a structured format.
   */
  metadata: Stripe.Metadata | null;

  /**
   * Cardholder name.
   */
  name: string | null;

  /**
   * For external accounts, possible values are `new` and `errored`. If a transfer fails, the status is set to `errored` and transfers are stopped until account details are updated.
   */
};
type AppAccount = {
  id: string;
  slug: string;
  account_slug: string;
  name: string;
  status: string;
  account_type_slug: string | AppAccount;
  account_type_name: string;
  stripe_card: Card[];
  created_at: string;
  updated_at: string;
  is_active: number;
  is_deleted: number;
  is_agent?: number;
  company_name?: string;
  primary_color?: string;
  logo?: string;
  logo_square?: string;
  default_price_per_chat?: string;
  payment_intent?: any;
} & MembershipBilling;

type AccountType = {
  id: string;
  slug: string;
  name: string;
  created_at: string;
  updated_at: string;
  is_active: number;
  is_deleted: number;
} & MembershipBilling;

type MembershipBilling = {
  startup_fee: number;
  monthly_fee: number;
  user_limit_settings: {
    included_guest_users: number;
    cost_per_additional_guest_user: number;
    included_account_users: number;
    cost_per_additional_account_user: number;
  };
  operation_settings: {
    included_monthly_operations: number;
    cost_per_additional_1000_monthly_operation: number;
  };
  contact_settings: {
    included_contacts: number;
    cost_per_additional_500_contact: number;
  };
  project_settings: {
    included_project_templates: number;
    cost_per_additional_5_project_template: number;
    included_projects: number;
    cost_per_additional_50_project: number;
  };
  dynamo_storage_settings: {
    included_dynamo_storage: number;
    cost_per_additional_gb_dynamo_storage: number;
  };
  sql_storage_settings: {
    included_sql_storage: number;
    cost_per_additional_gb_sql_storage: number;
  };
  chat_settings: {
    included_chat_widgets: number;
    cost_per_additional_5_chat_widget: number;
    chat_enabled: boolean;
    chat_monthly_fee: number;
  };
  three_p_app_settings?: {
    three_p_app_enabled: boolean;
  };
};
