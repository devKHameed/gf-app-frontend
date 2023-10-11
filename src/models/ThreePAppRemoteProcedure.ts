import Model from "models";
import qs from "querystring";

class ThreePAppRemoteProcedureModel {
  private baseModel = new Model<ThreePAppRemoteProcedure>(
    "/3p-apps-rp",
    "dev-sett"
  );

  async list(appSlug?: string, query?: qs.ParsedUrlQueryInput) {
    return await this.baseModel.sendRequest<ThreePAppRemoteProcedure[]>(
      `/list/${appSlug}?${qs.stringify(query)}`,
      "GET"
    );
  }

  async create(appSlug: string, data: Partial<ThreePAppRemoteProcedure>) {
    return await this.baseModel.sendRequest<ThreePAppRemoteProcedure>(
      `/${appSlug}`,
      "POST",
      data
    );
  }

  async get(slug: string) {
    return await this.baseModel.sendRequest<ThreePAppRemoteProcedure>(
      `/${slug}`,
      "GET"
    );
  }

  async update(slug: string, data: Partial<ThreePAppRemoteProcedure>) {
    return await this.baseModel.sendRequest<ThreePAppRemoteProcedure>(
      `/${slug}`,
      "PUT",
      data
    );
  }

  async delete(slug: string) {
    return await this.baseModel.sendRequest(`/${slug}`, "DELETE");
  }

  async execute(
    rpc: string,
    appSlug: string,
    connectionSlug: string,
    userSlug: string,
    parameters?: Record<string, unknown>,
    query?: qs.ParsedUrlQueryInput
  ) {
    return await this.baseModel.sendRequest(
      `/execute?${qs.stringify(query)}`,
      "POST",
      {
        rpc,
        appSlug,
        connectionSlug,
        userSlug,
        parameters,
      }
    );
  }
}

export default new ThreePAppRemoteProcedureModel();
