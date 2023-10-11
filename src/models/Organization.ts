import Model from "models";

class OrganizationModel extends Model<Organization> {
  constructor() {
    super("/organization", "public-1");
  }
}

export default new OrganizationModel();
