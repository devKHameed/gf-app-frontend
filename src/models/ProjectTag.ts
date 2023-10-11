import Model from "models";

class ProjectTagModel extends Model<ProjectTag> {
  constructor() {
    super("/project-tag", "public-1");
  }
}

export default new ProjectTagModel();
