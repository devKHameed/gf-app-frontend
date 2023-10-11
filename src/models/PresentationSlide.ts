import Model from "models";

class PresentationSlideModel extends Model<PresentationSlide> {
  constructor() {
    super("/presentation-slide", "public-1");
  }
}

const model = new PresentationSlideModel();
export default model;
