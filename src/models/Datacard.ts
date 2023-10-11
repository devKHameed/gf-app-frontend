import Model from "models";

class DatacardModel extends Model<Datacard> {
  constructor() {
    super("/datacard", "data-mng");
  }
}

const model = new DatacardModel();
export default model;
