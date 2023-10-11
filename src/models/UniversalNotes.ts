import Model from "models";

class UniversalNoteModel extends Model<UniversalNote> {
  constructor() {
    super("/universal-note", "public-1");
  }
}

const model = new UniversalNoteModel();
export default model;
