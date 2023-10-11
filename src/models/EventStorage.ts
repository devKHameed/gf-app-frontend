import Model from "models";
import qs from "query-string";

class EventStorageModel {
  private model = new Model<EventStorage>("/event", "public-1");

  async listEvents(
    eventId: string,
    contactId: string,
    query?: Record<string, any>
  ) {
    return await this.model.sendRequest<EventStorage[]>(
      `/${eventId}/${contactId}${query ? `?${qs.stringify(query)}` : ""}`,
      "GET"
    );
  }
}

export default new EventStorageModel();
