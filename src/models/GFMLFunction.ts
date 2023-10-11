import Model from "models";
import qs from "querystring";

class GFMLFunctionModel extends Model<GFMLFunction> {
  constructor() {
    super("/global-gfml-function", "dev-sett");
  }

  async getGlobalFunctionGroups(query?: qs.ParsedUrlQueryInput) {
    return await this.sendRequest<GFMLFunctionGroup[]>(
      `/groups?${qs.stringify(query)}`,
      "GET"
    );
  }
}

export default new GFMLFunctionModel();
