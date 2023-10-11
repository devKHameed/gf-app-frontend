import Model from "models";

class ProjectTaskModel extends Model<ProjectTask> {
  constructor() {
    super("/task", "public-1");
  }
}

export default new ProjectTaskModel();
