import Model from "models";

class PresentationSlideSortModel extends Model<PresentationSlide> {
  constructor() {
    super("/presentation-slide/sort", "public-1");
  }
}

const model = new PresentationSlideSortModel();
export default model;
