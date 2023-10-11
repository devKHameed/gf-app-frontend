import Model from "models";

class Account {
  private model = new Model<AppAccount>("/account", "public-1");

  async get(slug: string) {
    return await this.model.get(slug);
  }

  async create(data: Partial<Account>) {
    return await this.model.sendRequest<AppAccount>(`/create`, "POST", data);
  }
}

export default new Account();
