import Model from "models";

class FusionFlowModel extends Model<Fusion> {
  private fusionModel = new Model("/fusion/v2", "gui-fusion");

  constructor() {
    super("/fusion-flow", "gui-fusion");
  }

  async getSessions(slug: string) {
    return await this.fusionModel.sendRequest<FusionSession[]>(
      `/${slug}/session`,
      "GET"
    );
  }

  async updateSession(
    fusionSlug: string,
    slug: string,
    data: Partial<Pick<FusionSession, "is_paused" | "is_stopped">>
  ) {
    return await this.fusionModel.sendRequest<FusionSession[]>(
      `/${fusionSlug}/session/${slug}`,
      "PUT",
      data
    );
  }

  async runTest(fusion: Partial<Fusion>, userSlug: string) {
    return await this.fusionModel.sendRequest("/test", "POST", {
      fusion,
      userSlug,
    });
  }

  // async getActions(slug: string) {
  //   return await this.fusionModel.sendRequest<ThreePAppAction[]>(
  //     `/${slug}/action`,
  //     "GET"
  //   );
  // }

  async createWebhook(webhook: Partial<FusionWebhook>) {
    return await this.fusionModel.sendRequest<FusionWebhook>(
      "/v2/webhook",
      "POST",
      webhook
    );
  }
}

export default new FusionFlowModel();
