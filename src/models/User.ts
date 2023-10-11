import Model from "models";

class UserModel extends Model<User> {
  constructor() {
    super("/user", "user-mng");
  }

  async getUser() {
    return await this.sendRequest<{
      user: User;
      accounts: AppAccount[];
    }>("", "GET");
  }

  async updateUser(data: Partial<User>) {
    return await this.sendRequest("", "PUT", data);
  }
}

export default new UserModel();
