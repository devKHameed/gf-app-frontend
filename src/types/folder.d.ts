type Folder = {
  id: string;
  slug: string;
  name: string;
  sort_order: number;
  resource?: string;
  childs: { id: string; slug: string }[];
};
