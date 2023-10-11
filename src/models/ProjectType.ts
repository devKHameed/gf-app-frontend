import Model from "models";

class ProjectTypeModel extends Model<ProjectType> {
  constructor() {
    super("/project-type", "public-1");
  }
}

export default new ProjectTypeModel();
