import Model from "models";

class AccountSubscriptionModel extends Model<UserAccountSubscription> {
  constructor() {
    super("/account-subscriptions", "gui-fusion");
  }
}

export default new AccountSubscriptionModel();
