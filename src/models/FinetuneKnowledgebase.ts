import Model from "models";

class FinetuneKnowledgebaseModel extends Model<FinetuneKnowledgebase> {
  constructor() {
    super("/finetune-knowledgebase", "public-1");
  }

  async listMessages(knowledgebaseSlug: string) {
    return await this.sendRequest<FinetuneKnowledgebaseMessage[]>(
      `/message/${knowledgebaseSlug}`,
      "GET"
    );
  }

  async createMessage(knowledgebaseSlug: string, query: string) {
    return await this.sendRequest<{
      user_message: FinetuneKnowledgebaseMessage;
      response: FinetuneKnowledgebaseMessage;
    }>(`/message/${knowledgebaseSlug}`, "POST", {
      message: query,
    });
  }
}

const model = new FinetuneKnowledgebaseModel();
export default model;
