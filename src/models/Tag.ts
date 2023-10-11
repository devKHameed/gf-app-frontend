import Model from "models";

class TagModal extends Model<UniversalTag> {
  constructor() {
    super("/universal-tag", "public-1");
  }
  async BulkUpdate<ReturnType = unknown>(data: {
    record_type: string;
    tags: Pick<UniversalTag, "record_id" | "action" | "tag" | "color">[];
  }) {
    await this.sendRequest<ReturnType>(`/bulk-update`, "PUT", data);
  }
}

export default new TagModal();
