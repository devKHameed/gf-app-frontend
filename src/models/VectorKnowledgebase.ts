import Model from "models";

class VectorKnowledgebaseModel extends Model<VectorKnowledgebase> {
  constructor() {
    super("/vector-knowledgebase", "public-1");
  }

  async listMessages(knowledgebaseSlug: string) {
    return await this.sendRequest<VectorKnowledgebaseMessage[]>(
      `/message/${knowledgebaseSlug}`,
      "GET"
    );
  }

  async createMessage(knowledgebaseSlug: string, query: string) {
    return await this.sendRequest<{
      user_message: VectorKnowledgebaseMessage;
      response: VectorKnowledgebaseMessage;
    }>(`/message/${knowledgebaseSlug}`, "POST", {
      message: query,
    });
  }
}

const model = new VectorKnowledgebaseModel();
export default model;
