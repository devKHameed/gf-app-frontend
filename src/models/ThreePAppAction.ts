import Model from "models";
import qs from "querystring";

class ThreePAppActionModel {
  private baseModel = new Model<ThreePAppAction>("/3p-apps-action", "dev-sett");

  async list(appSlug?: string, query?: qs.ParsedUrlQueryInput) {
    return await this.baseModel.sendRequest<ThreePAppAction[]>(
      `/list/${appSlug}?${qs.stringify(query)}`,
      "GET"
    );
  }

  async create(appSlug: string, data: Partial<ThreePAppAction>) {
    return await this.baseModel.sendRequest<ThreePAppAction>(
      `/${appSlug}`,
      "POST",
      data
    );
  }

  async get(slug: string) {
    return await this.baseModel.sendRequest<ThreePAppAction>(`/${slug}`, "GET");
  }

  async update(slug: string, data: Partial<ThreePAppAction>) {
    return await this.baseModel.sendRequest<ThreePAppAction>(
      `/${slug}`,
      "PUT",
      data
    );
  }

  async delete(slug: string) {
    return await this.baseModel.sendRequest(`/${slug}`, "DELETE");
  }

  async getEpochResponse(slug: string, data?: Record<string, unknown>) {
    return await this.baseModel.sendRequest<EpochResponse[]>(
      `/${slug}/epoch`,
      "POST",
      data
    );
  }
}

export default new ThreePAppActionModel();
