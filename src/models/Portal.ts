import Model from "models";

class PortalModel extends Model<Portal> {
  constructor() {
    super("/portal", "public-1");
  }
  async deployFrontend(
    slug: string,
    data: Partial<{ origin: string; id: string; key: string }>
  ) {
    return await this.sendRequest<AppAccount>(
      `/deploy-frontend/${slug}`,
      "PUT",
      data
    );
  }
  async deployBackend(
    slug: string,
    data: Partial<{ origin: string; id: string; key: string }>
  ) {
    return await this.sendRequest<AppAccount>(
      `/deploy-backend/${slug}`,
      "PUT",
      data
    );
  }
}

export default new PortalModel();
