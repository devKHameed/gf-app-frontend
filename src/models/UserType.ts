import Model from "models";

class UserTypeModel extends Model<UserType> {
  constructor() {
    super("/account-user-type", "user-mng");
  }
}

export default new UserTypeModel();
