import Model from "models";

class GuiModal extends Model<GfGui> {
  constructor() {
    super("/gf-gui", "gui-fusion");
  }
}

export default new GuiModal();
