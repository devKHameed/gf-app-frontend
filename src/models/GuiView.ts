import Model from "models";

class GuiViewModal extends Model<unknown> {
  constructor() {
    super("/gui-view", "gui-fusion");
  }
}

export default new GuiViewModal();
