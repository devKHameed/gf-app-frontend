import Model from "models";

class ThreePAppModel extends Model<ThreePApp> {
  constructor() {
    super("/3p-apps", "dev-sett");
  }

  async importApp(filename: string) {
    return await this.sendRequest<ThreePApp>("/import", "POST", { filename });
  }
}

export default new ThreePAppModel();
