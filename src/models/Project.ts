import Model from "models";

class ProjectModel extends Model<Project> {
  private projectUpdatesModel = new Model<ProjectUpdate>(
    "/project-update",
    "public-1"
  );

  constructor() {
    super("/project", "public-1");
  }

  async listUpdates(slug: string) {
    return await this.projectUpdatesModel.list({
      query: {
        project_slug: slug,
      },
    });
  }

  async createUpdate(data: Partial<ProjectUpdate>) {
    return await this.projectUpdatesModel.create(data);
  }
}

export default new ProjectModel();
