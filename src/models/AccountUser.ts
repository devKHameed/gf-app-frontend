import Model from "models";

class AccountUser extends Model<User> {
  constructor() {
    super("/account-user", "user-mng");
  }
}

export default new AccountUser();
