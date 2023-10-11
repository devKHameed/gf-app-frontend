import Model from "models";

class FinetuneKnowledgebaseTopicModel extends Model<FinetuneKnowledgebaseTopic> {
  constructor() {
    super("/finetune-knowledgebase-topic", "public-1");
  }
  async publish(knowledgebaseSlug: string, query?: string) {
    return await this.sendRequest("/publish", "POST", {
      finetune_Knowledgebase_id: knowledgebaseSlug,
    });
  }
}

const model = new FinetuneKnowledgebaseTopicModel();
export default model;
