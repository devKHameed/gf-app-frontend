import Model from "models";
import qs from "querystring";

class ThreePAppConnectionModel {
  private baseModel = new Model<ThreePAppConnection>(
    "/3p-apps-connection",
    "dev-sett"
  );

  async list(appSlug?: string, query?: qs.ParsedUrlQueryInput) {
    return await this.baseModel.sendRequest<ThreePAppConnection[]>(
      `/list/${appSlug}?${qs.stringify(query)}`,
      "GET"
    );
  }

  async create(appSlug: string, data: Partial<ThreePAppConnection>) {
    return await this.baseModel.sendRequest<ThreePAppConnection>(
      `/${appSlug}`,
      "POST",
      data
    );
  }

  async get(slug: string) {
    return await this.baseModel.sendRequest<ThreePAppConnection>(
      `/${slug}`,
      "GET"
    );
  }

  async update(slug: string, data: Partial<ThreePAppConnection>) {
    return await this.baseModel.sendRequest<ThreePAppConnection>(
      `/${slug}`,
      "PUT",
      data
    );
  }

  async delete(slug: string) {
    return await this.baseModel.sendRequest(`/${slug}`, "DELETE");
  }
}

export default new ThreePAppConnectionModel();
