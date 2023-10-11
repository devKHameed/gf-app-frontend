type UniversalNote = {
  id: string;
  slug: string;
  title: string;
  value: string;
  note_type: string;
  tags: { label: string; value: string; color: string }[];
};
