type FinetuneKnowledgebase = {
  id: string;
  slug: string;
  pinecone_index: string;
  name: string;
  description: string;
  created_at: string | null;
  updated_at: string | null;
  is_active: number;
  is_deleted: number;
};

type FinetuneKnowledgebaseTopic = {
  id: string;
  slug: string;
  name: string;
  meta_data: Record<string, unknown>;
  question: string;
  answer: string;
  value: string;
  description: string;
  created_at: string | null;
  updated_at: string | null;
  is_active: number;
  is_deleted: number;
};

type FinetuneKnowledgebaseMessage = {
  id: string;
  slug: string;
  data: string;
  sent_by: "user" | "bot";
  user_data?: Pick<
    User,
    "slug" | "first_name" | "last_name" | "email" | "image"
  >;
  created_at: string | null;
  updated_at: string | null;
  is_active: number;
  is_deleted: number;
};
