import Model from "models";
import qs from "query-string";

class Chat extends Model<ChatAccessList> {
  constructor() {
    super("/chat", "public-1");
  }

  async listChatEvents(connectionId: string, query?: Record<string, any>) {
    return await this.sendRequest<ChatEvent[]>(
      `/event/${connectionId}${query ? `?${qs.stringify(query)}` : ""}`,
      "GET"
    );
  }
}

export default new Chat();
