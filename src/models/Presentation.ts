import Model from "models";

class PresentatinModel extends Model<Presentation> {
  constructor() {
    super("/presentation", "public-1");
  }
}

const model = new PresentatinModel();
export default model;
