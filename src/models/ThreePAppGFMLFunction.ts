import Model from "models";
import qs from "querystring";

class ThreePAppGFMLFunctionsModel {
  private baseModel = new Model<ThreePAppGFMLFunction>(
    "/3p-apps-gfml-function",
    "dev-sett"
  );

  async list(appSlug?: string, query?: qs.ParsedUrlQueryInput) {
    return await this.baseModel.sendRequest<ThreePAppGFMLFunction[]>(
      `/list/${appSlug}?${qs.stringify(query)}`,
      "GET"
    );
  }

  async create(appSlug: string, data: Partial<ThreePAppGFMLFunction>) {
    return await this.baseModel.sendRequest<ThreePAppGFMLFunction>(
      `/${appSlug}`,
      "POST",
      data
    );
  }

  async get(slug: string) {
    return await this.baseModel.sendRequest<ThreePAppGFMLFunction>(
      `/${slug}`,
      "GET"
    );
  }

  async update(slug: string, data: Partial<ThreePAppGFMLFunction>) {
    return await this.baseModel.sendRequest<ThreePAppGFMLFunction>(
      `/${slug}`,
      "PUT",
      data
    );
  }

  async delete(slug: string) {
    return await this.baseModel.sendRequest(`/${slug}`, "DELETE");
  }
}

export default new ThreePAppGFMLFunctionsModel();
