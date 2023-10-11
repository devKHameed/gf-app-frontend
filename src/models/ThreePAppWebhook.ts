import Model from "models";
import qs from "querystring";

class ThreePAppWebhookModel {
  private baseModel = new Model<ThreePAppWebhook>(
    "/3p-apps-webhook",
    "dev-sett"
  );

  async list(appSlug?: string, query?: qs.ParsedUrlQueryInput) {
    return await this.baseModel.sendRequest<ThreePAppWebhook[]>(
      `/list/${appSlug}?${qs.stringify(query)}`,
      "GET"
    );
  }

  async create(appSlug: string, data: Partial<ThreePAppWebhook>) {
    return await this.baseModel.sendRequest<ThreePAppWebhook>(
      `/${appSlug}`,
      "POST",
      data
    );
  }

  async get(slug: string) {
    return await this.baseModel.sendRequest<ThreePAppWebhook>(
      `/${slug}`,
      "GET"
    );
  }

  async update(slug: string, data: Partial<ThreePAppWebhook>) {
    return await this.baseModel.sendRequest<ThreePAppWebhook>(
      `/${slug}`,
      "PUT",
      data
    );
  }

  async delete(slug: string) {
    return await this.baseModel.sendRequest(`/${slug}`, "DELETE");
  }
}

export default new ThreePAppWebhookModel();
