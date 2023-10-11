import Model from "models";

class UniversalEventModel extends Model<UniversalEvent> {
  constructor() {
    super("/universal-event", "public-1");
  }
}

const model = new UniversalEventModel();
export default model;
