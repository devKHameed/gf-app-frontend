import Model from "models";

class KnowledgeBaseModal extends Model<KnowledgeBase> {
  constructor() {
    super("/knowledgebase", "public-1");
  }
}

export default new KnowledgeBaseModal();
