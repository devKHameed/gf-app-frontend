type ChatConnection = {
  id: string;
  slug: string;
  start_day_time: string;
  recent_session: string;
  session_status: "browsing" | "open" | "closed";
  chat_risk_status: "RED" | "GREEN" | "YELLOW";
  internal_meta: {
    geolocation: {
      city?: string;
      country?: string;
      ip?: string;
      lat?: number;
      lng?: number;
      os?: string;
    };
    user_data?: {
      name: string;
      email: string;
      phone: string;
      contact_data: Record<string, unknown>;
    };
  };
  external_meta: {
    user_data?: {
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      slug: string;
    };
  };
  public_contact_id: string;
  is_customer_ban: boolean;
  created_at: string;
  updated_at: string;
  is_active: number;
  is_deleted: number;
  secondary_operators?: string[];
};

type ChatAccessList = {
  id: string;
  slug: string;
  internal_meta: {
    geolocation: {
      city?: string;
      country?: string;
      ip?: string;
      lat?: number;
      lng?: number;
      os?: string;
    };
    user_data?: {
      name?: string;
      email?: string;
      phone?: string;
      contact_data?: Record<string, unknown>;
    };
  };
  external_meta: {
    user_data?: {
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      slug: string;
    };
  };
  is_customer_ban: boolean;
  account_id?: string;
  user_data?: User;
  role: "agent" | "manager";
  chat_connection_id: string;
  unread_count: number;
  date_time: number;
  created_at: string;
  updated_at: string;
  is_active: number;
  is_deleted: number;
  session_status?: ChatSession["session_status"];
  connection: ChatConnection;
};

type ChatSession = {
  id: string;
  slug: string;
  start_day_time: string;
  end_day_time: string;
  session_status: "browsing" | "open" | "closed";
  primary_operator: string;
  created_at: string;
  updated_at: string;
  is_active: number;
  is_deleted: number;
};

type ChatEvent = {
  id: string;
  slug: string;
  date_time: number;
  event_type: string;
  event_creator: string;
  event_data?: Record<string, any>;
  creator_data: Record<string, unknown>;
  created_by: "user" | "agent";
  is_active: number;
  is_deleted: number;
  created_at: string;
  updated_at: string | null;
};

type ChatSessionEvents = ChatSession & { events: ChatEvent[] };

type ChatQueue = {
  id: string;
  slug: string;
  title: string;
  assign_to_users: { user: string; role: string }[];
  assign_to_user_types: { user_type: string; role: string }[];
  created_at: string | null;
  updated_at: string | null;
  is_deleted: number;
};

type ChatWidget = {
  id: string;
  slug: string;
  title: string;
  knowledgebase_id: string;
  chat_queue_id: string;
  contact_type_id: string;
  created_at: string | null;
  updated_at: string | null;
  is_deleted: number;
};
