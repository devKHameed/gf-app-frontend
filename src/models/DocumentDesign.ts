import Model from "models";

class DocumentDesignModel extends Model<DocumentDesign> {
  constructor() {
    super("/document-design", "data-mng");
  }
}

export default new DocumentDesignModel();
