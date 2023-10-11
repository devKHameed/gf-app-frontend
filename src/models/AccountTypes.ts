import Model from "models";

class AccountTypeModel extends Model<AccountType> {
  constructor() {
    super("/account-type", "user-mng");
  }
}

export default new AccountTypeModel();
