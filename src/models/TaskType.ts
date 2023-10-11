import Model from "models";

class TaskTypeModel extends Model<TaskType> {
  constructor() {
    super("/project-task-type", "public-1");
  }
}

export default new TaskTypeModel();
