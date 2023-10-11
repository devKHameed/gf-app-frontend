import Model from "models";

class SkillDataModel extends Model<SkillData> {
  constructor() {
    super("/skill-data", "gui-fusion");
  }

  async checkIsSlugValid(data: {
    skill_design_slug: string;
    type: string;
    slug: string;
    module_slug: string;
  }) {
    return await this.sendRequest<{ is_valid: boolean }>(
      "/check-is-slug-valid",
      "POST",
      data
    );
  }
}

const model = new SkillDataModel();
export default model;
