import Model from "models";

class DatasetDesignModel extends Model<DatasetDesign> {
  constructor() {
    super("/dataset-design", "data-mng");
  }
}

const model = new DatasetDesignModel();
export default model;
