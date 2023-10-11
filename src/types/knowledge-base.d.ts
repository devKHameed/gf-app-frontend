type KnowledgeBase = {
  id: string;
  slug: string;
  name: string;
  faq: {
    title?: string;
    slug: string;
    primary_question?: string;
    keywords?: string[];
    additional_information?: string;
    additional_questions?: {
      title?: string;
      slug: string;
    }[];
  }[];
  created_at: string;
  updated_at: string;
};
