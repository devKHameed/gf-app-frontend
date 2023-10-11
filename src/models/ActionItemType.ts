import Model from "models";

class ActionItemTypeModel extends Model<ActionItemType> {
  constructor() {
    super("/action-item-type", "public-1");
  }
}

export default new ActionItemTypeModel();
