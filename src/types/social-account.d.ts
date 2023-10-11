type SocialAccountEvent = {
  device_id: string;
  account_type: string;
  event_type_id: string;
  event_status: string;
  event_type_instructions: Record<string, unknown>;
  event_type_results: Record<string, unknown>;
  event_start_date: string;
  event_complete_date: string;
  event_schedule_date: string;
  id: string;
  slug: string;
};
