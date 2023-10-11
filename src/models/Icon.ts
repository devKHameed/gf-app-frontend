import Model from "models/index";

class IconModel extends Model<Icon> {
  constructor() {
    super("/icon", "public-1");
  }
}

const model = new IconModel();
export default model;
