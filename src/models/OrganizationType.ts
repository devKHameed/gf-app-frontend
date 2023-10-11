import Model from "models";

class OrganizationTypeModel extends Model<OrganizationType> {
  constructor() {
    super("/organization-type", "public-1");
  }
}

export default new OrganizationTypeModel();
