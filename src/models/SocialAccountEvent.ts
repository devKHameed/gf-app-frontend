import Model from "models";

class SocialAccountEventModel extends Model<SocialAccountEvent> {
  constructor() {
    super("/soc-task", "public-1");
  }
}

export default new SocialAccountEventModel();
