import Model from "models";

class JobSessionModel extends Model<JobSession> {
  constructor() {
    super("/job-session", "public-1");
  }
}

const model = new JobSessionModel();
export default model;
