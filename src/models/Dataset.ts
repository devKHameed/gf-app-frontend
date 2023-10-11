import Model from "models";

class DatasetModel extends Model<Dataset> {
  constructor() {
    super("/dataset", "data-mng");
  }
}

const model = new DatasetModel();
export default model;
