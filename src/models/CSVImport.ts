import Model from "models";

class CSVImportModel extends Model<CSVImport> {
  constructor() {
    super("/csv-import", "public-1");
  }
}

export default new CSVImportModel();
