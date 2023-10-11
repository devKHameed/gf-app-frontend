type Presentation = {
  id: string;
  slug: string;
  title: string;
  sort_order: number;
  created_at: string | null;
  updated_at: string | null;
  is_active: number;
  is_deleted: number;
};

type PresentationSlide = {
  id: string;
  slug: string;
  sort_number: number;
  title: string;
  sort_order?: number;
  slide_design: any[];
  created_at: string | null;
  updated_at: string | null;
  is_active: number;
  is_deleted: number;
};
type PresentationSlideSort = {
  slug: string;
  sort_number: number;
};
