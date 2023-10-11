import Model from "models";

class GmailAccount extends Model<any> {
  constructor() {
    super("/user-gmail-account", "public-1");
  }
}

export default new GmailAccount();
