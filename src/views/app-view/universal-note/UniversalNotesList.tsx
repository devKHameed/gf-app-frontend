import { List } from "components/List";
import useOpenClose from "hooks/useOpenClose";
import kebabCase from "lodash/kebabCase";
import { ApiModels } from "queries/apiModelMapping";
import useListItems from "queries/useListItems";
import React from "react";
import AddUniversalNoteModal from "./AddNoteModal";
type Props = {
  onAdd?: React.MouseEventHandler<HTMLButtonElement>;
  onEdit?: (_: UniversalNote) => void;
  noteType: string;
};

const NotesList = ({ onAdd, onEdit, noteType }: Props) => {
  const [open, onOpen, onClose] = useOpenClose();
  const { data: uniNotes } = useListItems({
    modelName: ApiModels.UniversalNote,
    requestOptions: { path: kebabCase(noteType) },
    queryKey: [ApiModels.UniversalNote, noteType],
  });
  return (
    <div>
      <List
        data={uniNotes}
        keyBinding={{
          createdAt: "created_at",
          updatedAt: "updated_at",
          title: "title",
          description: "value",
          tags: "tags",
        }}
        addButtonProps={{ onClick: onOpen }}
        onItemClick={onEdit}
        addButtonTitle={"Create a new Note"}
        inlineSearch={true}
        type="card"
      />
      <AddUniversalNoteModal
        open={open}
        onClose={onClose}
        noteType={noteType}
      />
    </div>
  );
};

export default NotesList;
