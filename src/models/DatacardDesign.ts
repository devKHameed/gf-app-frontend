import Model from "models";

class DatacardDesignModel extends Model<DatacardDesign> {
  constructor() {
    super("/datacard-design", "data-mng");
  }
}

const model = new DatacardDesignModel();
export default model;
