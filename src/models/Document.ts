import Model from "models";

class DocumentModel extends Model<GFDocument> {
  constructor() {
    super("/document", "data-mng");
  }
}

export default new DocumentModel();
