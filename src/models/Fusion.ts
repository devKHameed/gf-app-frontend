import Model from "models";
import qs from "query-string";

class FusionModel extends Model<Fusion> {
  constructor() {
    super("/fusion", "gui-fusion");
  }

  async createConnection(connection: Partial<FusionConnection>) {
    return await this.sendRequest<FusionConnection>(
      "/v2/connection",
      "POST",
      connection
    );
  }

  async getConnections(
    userSlug: string,
    appSlug: string,
    query?: Record<string, any>
  ) {
    return await this.sendRequest<FusionConnection[]>(
      `/connection/${appSlug}${query ? `?${qs.stringify(query)}` : ""}`,
      "GET"
    );
  }

  async updateConnection(slug: string, data: Partial<FusionConnection>) {
    return await this.sendRequest<FusionConnection>(
      `/connection/${slug}`,
      "PUT",
      data
    );
  }

  async getHistory(slug: string) {
    return await this.sendRequest<Fusion[]>(`/${slug}/history`, "GET");
  }

  async getHistoryDetails(slug: string) {
    return await this.sendRequest<Fusion>(`/history/${slug}`, "GET");
  }

  async getSessions(slug: string) {
    return await this.sendRequest<FusionSession[]>(
      `/v2/${slug}/session`,
      "GET"
    );
  }

  async runTest(fusion: Partial<Fusion>, userSlug: string) {
    return await this.sendRequest("/v2/test", "POST", {
      fusion,
      userSlug,
    });
  }

  async createWebhook(webhook: Partial<FusionWebhook>) {
    return await this.sendRequest<FusionWebhook>(
      "/v2/webhook",
      "POST",
      webhook
    );
  }

  async getWebhooks(moduleSlug: string, userSlug: string) {
    return await this.sendRequest<FusionWebhook[]>(
      `/webhook/${moduleSlug}`,
      "GET"
    );
  }

  async runWidgetFusion(
    accountId: string,
    userId: string,
    fusionSlug: string,
    chartInputs: Record<string, any>
  ) {
    return await this.sendRequest(`/v2/widget/${fusionSlug}`, "POST", {
      accountId,
      userId,
      chart_inputs: chartInputs,
    });
  }

  // async getActions(slug: string) {
  //   return await this.sendRequest<ThreePAppAction[]>(`/${slug}/action`, "GET");
  // }
}
const model = new FusionModel();

export default model;
