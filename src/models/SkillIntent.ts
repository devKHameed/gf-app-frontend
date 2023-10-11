import Model from "models";

class SkillIntentModel extends Model<SkillIntent> {
  constructor() {
    super("/skill-intent", "public-1");
  }
}

const model = new SkillIntentModel();
export default model;
