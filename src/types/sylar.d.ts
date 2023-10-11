type SylarSession = {
  id: string;
  slug: string;
  created_at: string;
  closed_at: string;
  is_open: 1 | 0;
  meta_data: { [key: string]: any };
  is_deleted: 1 | 0;
};
type QuestionData = {
  question: string;
  question_type:
    | "open_ended"
    | "yes_no"
    | "single_item_from_list"
    | "multiple_items_from_list";
  options: { value: string }[];
};
type SylarSessionMessage = {
  id: string;
  slug: string;
  created_at: string;
  is_open: 1 | 0;
  meta_data: {
    [key: string]: any;
    message: string;
    type: "question";
    question_data: QuestionData;
    sessionData: any;
  };
  is_deleted: 1 | 0;
};
type JobSession = {
  session_id: string;
  account_id: string;
  user_id: string;
  job_id: number; // primary key and auto incrementing
  related_skill_id: string;
  start_date_time: Date;
  end_date_time?: Date; // This is marked as optional because it might not be set when a record is initially created
  status: "Open" | "Closed" | "Awaiting Instruction";
  title?: string; // Optional as it may not always be provided
  note?: string; // Optional as it may not always be provided
  session_data: JobSessionData;
};
type JobSessionData = {
  id: string;
  slug: string;
  session_data: JobSessionDisplayData; // primary key and auto incrementing
};

type JobSessionDisplayData = {
  html?: string;
  css?: string;
  js?: string;
  code?: string;
  display_type?: "html" | "code" | "fusion";
  code_action?: "append" | "replace";
  id?: string;
  fusion_slug?: string;
};
